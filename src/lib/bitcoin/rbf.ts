import { TransactionBuilder } from './transaction'
import { Transaction, TransactionOutput, BuildTransactionParams } from '@/types'
import { MempoolAPI } from '../api/mempool'

export class RBFHandler {
  private txBuilder: TransactionBuilder
  private api: MempoolAPI

  constructor(network: 'mainnet' | 'testnet4', api: MempoolAPI) {
    this.txBuilder = new TransactionBuilder(network)
    this.api = api
  }

  /**
   * Check if transaction is RBF-enabled (BIP 125)
   */
  isRBFEnabled(transaction: Transaction): boolean {
    return transaction.vin.some((input) => input.sequence < 0xfffffffe)
  }

  /**
   * Check if transaction is pending (unconfirmed)
   */
  isPending(transaction: Transaction): boolean {
    return !transaction.status.confirmed
  }

  /**
   * Calculate minimum fee for RBF replacement (BIP 125 rules)
   */
  calculateMinimumReplacementFee(
    originalFee: number,
    originalSize: number,
    newSize: number
  ): number {
    // BIP 125 rules:
    // 1. New fee must be higher than original
    // 2. Must pay for its own relay cost (1 sat/vB minimum)
    // 3. Fee increase must be meaningful

    const minFeeRate = 1 // sat/vB
    const minRelayFee = newSize * minFeeRate
    const minIncrement = Math.max(minRelayFee, originalFee * 0.01) // At least 1% increase

    return Math.ceil(originalFee + minIncrement)
  }

  /**
   * Create RBF replacement transaction with higher fee
   */
  async createReplacementTransaction(
    originalTxid: string,
    newFeeRate: number,
    customOutputs?: { address: string; value: number }[]
  ): Promise<{ psbt: string; fee: number; feeRate: number }> {
    try {
      // Fetch original transaction
      const originalTx = await this.api.getTransaction(originalTxid)

      // Only check if transaction is confirmed
      // Allow RBF regardless of signaling (user's choice to attempt)
      if (originalTx.status.confirmed) {
        throw new Error('Cannot replace confirmed transaction')
      }

      // Use same inputs from original transaction
      // Need to enrich with scriptPubKey for PSBT creation
      const inputs = originalTx.vin.map((input) => ({
        txid: input.txid,
        vout: input.vout,
        value: input.prevout.value,
        scriptPubKey: input.prevout.scriptpubkey,
      }))

      // Calculate total input value
      const totalInput = inputs.reduce((sum, input) => sum + input.value, 0)

      // Use custom outputs if provided, otherwise use original outputs
      let outputs: { address: string; value: number }[]

      if (customOutputs) {
        outputs = customOutputs
      } else {
        outputs = originalTx.vout
          .filter(out => out.scriptpubkey_address)
          .map((output) => ({
            address: output.scriptpubkey_address!,
            value: output.value,
          }))
      }

      // Calculate new fee
      const estimatedSize = this.txBuilder.estimateSize(inputs.length, outputs.length)
      const newFee = estimatedSize * newFeeRate

      // Validate new fee meets BIP 125 requirements
      const minFee = this.calculateMinimumReplacementFee(
        originalTx.fee,
        originalTx.size,
        estimatedSize
      )

      if (newFee < minFee) {
        throw new Error(`Fee too low. Minimum required: ${minFee} sats (${Math.ceil(minFee / estimatedSize)} sat/vB)`)
      }

      // Adjust outputs to account for new fee
      // Find change output (usually the one going back to sender)
      // For simplicity, reduce the last output
      const adjustedOutputs = this.adjustOutputsForFee(outputs, newFee, totalInput)

      // Build replacement transaction with RBF enabled
      const psbt = this.txBuilder.createPSBT({
        inputs,
        outputs: adjustedOutputs,
        feeRate: newFeeRate,
        enableRBF: true,
      })

      return {
        psbt,
        fee: newFee,
        feeRate: newFeeRate,
      }
    } catch (error: any) {
      console.error('Error creating RBF replacement:', error)
      throw error
    }
  }

  /**
   * Adjust outputs to accommodate new fee
   */
  private adjustOutputsForFee(
    outputs: { address: string; value: number }[],
    newFee: number,
    totalInput: number
  ): { address: string; value: number }[] {
    const totalOutput = outputs.reduce((sum, out) => sum + out.value, 0)
    const currentFee = totalInput - totalOutput
    const feeIncrease = newFee - currentFee

    if (feeIncrease <= 0) {
      // Fee is already sufficient
      return outputs
    }

    // Find the largest output (likely the change output)
    const adjustedOutputs = [...outputs]
    let largestIndex = 0
    let largestValue = outputs[0].value

    outputs.forEach((output, index) => {
      if (output.value > largestValue) {
        largestValue = output.value
        largestIndex = index
      }
    })

    // Reduce the largest output by the fee increase
    const newValue = adjustedOutputs[largestIndex].value - feeIncrease

    if (newValue < 546) { // Dust limit
      throw new Error('Cannot increase fee: output would fall below dust limit (546 sats)')
    }

    adjustedOutputs[largestIndex] = {
      ...adjustedOutputs[largestIndex],
      value: newValue,
    }

    return adjustedOutputs
  }

  /**
   * Validate RBF transaction before broadcast
   */
  validateRBFTransaction(
    originalTx: Transaction,
    newFee: number,
    newSize: number
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check if confirmed
    if (originalTx.status.confirmed) {
      errors.push('Cannot replace confirmed transaction')
    }

    // Check fee increase
    const minFee = this.calculateMinimumReplacementFee(
      originalTx.fee,
      originalTx.size,
      newSize
    )

    if (newFee < minFee) {
      errors.push(`Fee increase insufficient. Minimum: ${minFee} sats`)
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Calculate recommended fee bump
   */
  async getRecommendedFeeBump(originalTxid: string): Promise<{
    currentFee: number
    currentFeeRate: number
    recommendedFee: number
    recommendedFeeRate: number
  }> {
    const tx = await this.api.getTransaction(originalTxid)
    const fees = await this.api.getRecommendedFees()

    // Use vsize (weight/4) for accurate fee rate calculation
    const vsize = Math.ceil(tx.weight / 4)
    const currentFeeRate = parseFloat((tx.fee / vsize).toFixed(1))
    const recommendedFeeRate = fees.fastestFee

    const recommendedFee = Math.ceil(vsize * recommendedFeeRate)

    return {
      currentFee: tx.fee,
      currentFeeRate,
      recommendedFee,
      recommendedFeeRate,
    }
  }
}
