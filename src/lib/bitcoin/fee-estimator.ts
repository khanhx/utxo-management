import { MempoolAPI } from '../api/mempool'
import { TX_SIZE_ESTIMATES } from '../utils/constants'

export class FeeEstimator {
  private api: MempoolAPI

  constructor(api: MempoolAPI) {
    this.api = api
  }

  /**
   * Get recommended fee rates
   */
  async getRecommendedFees() {
    try {
      return await this.api.getRecommendedFees()
    } catch (error) {
      console.error('Error fetching fees:', error)
      // Return default fees if API fails
      return {
        fastestFee: 20,
        halfHourFee: 10,
        hourFee: 5,
        economyFee: 1,
        minimumFee: 1,
      }
    }
  }

  /**
   * Calculate total fee for transaction
   */
  calculateFee(vsize: number, feeRate: number): number {
    return Math.ceil(vsize * feeRate)
  }

  /**
   * Estimate transaction size (vBytes)
   */
  estimateTransactionSize(
    inputCount: number,
    outputCount: number,
    inputType: 'p2pkh' | 'p2wpkh' | 'p2sh' = 'p2wpkh'
  ): number {
    const baseTxSize = TX_SIZE_ESTIMATES.base

    let inputSize: number
    switch (inputType) {
      case 'p2pkh':
        inputSize = TX_SIZE_ESTIMATES.p2pkh_input
        break
      case 'p2wpkh':
        inputSize = TX_SIZE_ESTIMATES.p2wpkh_input
        break
      case 'p2sh':
        inputSize = TX_SIZE_ESTIMATES.p2sh_input
        break
    }

    const outputSize = TX_SIZE_ESTIMATES.output

    const totalSize = baseTxSize + (inputCount * inputSize) + (outputCount * outputSize)

    // For SegWit, calculate vsize
    if (inputType === 'p2wpkh') {
      const witnessSize = inputCount * 107
      const vsize = Math.ceil((totalSize * 3 + witnessSize) / 4)
      return vsize
    }

    return totalSize
  }

  /**
   * Get fee for priority level
   */
  async getFeeForPriority(priority: 'fastest' | 'fast' | 'medium' | 'slow'): Promise<number> {
    const fees = await this.getRecommendedFees()

    switch (priority) {
      case 'fastest':
        return fees.fastestFee
      case 'fast':
        return fees.halfHourFee
      case 'medium':
        return fees.hourFee
      case 'slow':
        return fees.economyFee
      default:
        return fees.hourFee
    }
  }

  /**
   * Format fee for display
   */
  formatFee(satoshis: number): string {
    const btc = satoshis / 100_000_000
    return `${btc.toFixed(8)} BTC (${satoshis.toLocaleString()} sats)`
  }

  /**
   * Calculate fee rate from transaction
   */
  calculateFeeRate(fee: number, vsize: number): number {
    return Math.ceil(fee / vsize)
  }
}
