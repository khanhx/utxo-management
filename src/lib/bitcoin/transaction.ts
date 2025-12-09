/**
 * Bitcoin Transaction Builder using @scure/btc-signer
 * This provides proper PSBT creation for wallet signing
 */

import * as btc from '@scure/btc-signer'
import { hex } from '@scure/base'
import { BuildTransactionParams, UTXO } from '@/types'
import { RBF_SEQUENCE, DEFAULT_SEQUENCE } from '../utils/constants'

export class TransactionBuilder {
  private network: 'mainnet' | 'testnet4'
  private btcNetwork: typeof btc.TEST_NETWORK | typeof btc.NETWORK

  constructor(network: 'mainnet' | 'testnet4' = 'testnet4') {
    this.network = network
    this.btcNetwork = network === 'mainnet' ? btc.NETWORK : btc.TEST_NETWORK
  }

  /**
   * Create a basic transaction hex (simplified version)
   * In production, this would use @scure/btc-signer or bitcoinjs-lib
   */
  buildTransaction(params: BuildTransactionParams): string {
    const { inputs, outputs, feeRate, enableRBF = true } = params

    // Calculate total input value
    const totalInput = inputs.reduce((sum, input) => sum + input.value, 0)

    // Calculate total output value
    const totalOutput = outputs.reduce((sum, output) => sum + output.value, 0)

    // Estimate transaction size
    const estimatedSize = this.estimateSize(inputs.length, outputs.length)
    const fee = Math.ceil(estimatedSize * feeRate)

    // Validate fee
    if (totalInput < totalOutput + fee) {
      throw new Error(`Insufficient funds. Input: ${totalInput}, Output + Fee: ${totalOutput + fee}`)
    }

    // This is a placeholder for actual transaction building
    // In production, use @scure/btc-signer or bitcoinjs-lib
    const txData = {
      version: 2,
      inputs: inputs.map(input => ({
        txid: input.txid,
        vout: input.vout,
        sequence: enableRBF ? RBF_SEQUENCE : DEFAULT_SEQUENCE,
      })),
      outputs: outputs.map(output => ({
        address: output.address,
        value: output.value,
      })),
      locktime: 0,
    }

    // Return a pseudo-hex for now
    // In production, this would be actual transaction serialization
    return Buffer.from(JSON.stringify(txData)).toString('hex')
  }

  /**
   * Create PSBT hex string for wallet signing
   */
  createPSBT(params: BuildTransactionParams): string {
    const { inputs, outputs, enableRBF = true } = params

    try {
      // Create transaction
      const tx = new btc.Transaction()

      // Add inputs
      inputs.forEach(input => {
        if (!input.scriptPubKey) {
          throw new Error(`Missing scriptPubKey for input ${input.txid}:${input.vout}`)
        }

        tx.addInput({
          txid: hex.decode(input.txid),
          index: input.vout,
          sequence: enableRBF ? RBF_SEQUENCE : DEFAULT_SEQUENCE,
          witnessUtxo: {
            script: hex.decode(input.scriptPubKey),
            amount: BigInt(input.value),
          },
        })
      })

      // Add outputs
      outputs.forEach(output => {
        tx.addOutputAddress(output.address, BigInt(output.value), this.btcNetwork)
      })

      // Convert to PSBT hex
      const psbt = tx.toPSBT()
      return hex.encode(psbt)
    } catch (error) {
      console.error('Error creating PSBT:', error)
      throw new Error('Failed to create PSBT: ' + (error as Error).message)
    }
  }

  /**
   * Estimate transaction virtual size
   */
  estimateSize(inputCount: number, outputCount: number): number {
    // Rough estimate for P2WPKH
    const baseSize = 10
    const inputSize = 68 // P2WPKH input
    const outputSize = 34
    const witnessSize = inputCount * 107

    const totalSize = baseSize + (inputCount * inputSize) + (outputCount * outputSize)
    const vsize = Math.ceil((totalSize * 3 + witnessSize) / 4)

    return vsize
  }

  /**
   * Decode transaction from hex
   */
  decodeTransaction(txHex: string): any {
    try {
      // Check if it's our pseudo-format
      if (txHex.startsWith('psbt_')) {
        txHex = txHex.slice(5)
      }

      const json = Buffer.from(txHex, 'hex').toString('utf-8')
      return JSON.parse(json)
    } catch (error) {
      console.error('Error decoding transaction:', error)
      throw new Error('Invalid transaction hex')
    }
  }

  /**
   * Calculate transaction virtual size from hex
   */
  calculateVSize(txHex: string): number {
    try {
      const tx = this.decodeTransaction(txHex)
      return this.estimateSize(tx.inputs.length, tx.outputs.length)
    } catch {
      return 0
    }
  }

  /**
   * Check if transaction signals RBF
   */
  isRBFEnabled(txHex: string): boolean {
    try {
      const tx = this.decodeTransaction(txHex)
      return tx.inputs.some((input: any) => input.sequence < 0xfffffffe)
    } catch {
      return false
    }
  }
}

/**
 * Note: This is a simplified implementation for demonstration
 *
 * In production, you would use:
 *
 * import * as btc from '@scure/btc-signer'
 *
 * const tx = new btc.Transaction()
 * inputs.forEach(input => {
 *   tx.addInput({
 *     txid: input.txid,
 *     index: input.vout,
 *     sequence: enableRBF ? 0xfffffffd : 0xffffffff,
 *   })
 * })
 *
 * outputs.forEach(output => {
 *   tx.addOutputAddress(output.address, BigInt(output.value), network)
 * })
 *
 * return tx.toPSBT().toString('hex')
 */
