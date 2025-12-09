export interface FeeEstimates {
  fastestFee: number    // sat/vB
  halfHourFee: number   // sat/vB
  hourFee: number       // sat/vB
  economyFee: number    // sat/vB
  minimumFee: number    // sat/vB
}

export interface AddressInfo {
  address: string
  chain_stats: {
    funded_txo_count: number
    funded_txo_sum: number
    spent_txo_count: number
    spent_txo_sum: number
    tx_count: number
  }
  mempool_stats: {
    funded_txo_count: number
    funded_txo_sum: number
    spent_txo_count: number
    spent_txo_sum: number
    tx_count: number
  }
}
