export interface Transaction {
  txid: string
  version: number
  locktime: number
  vin: TransactionInput[]
  vout: TransactionOutput[]
  size: number
  weight: number
  fee: number
  status: TransactionStatus
}

export interface TransactionInput {
  txid: string
  vout: number
  prevout: TransactionOutput
  scriptsig: string
  scriptsig_asm: string
  witness: string[]
  sequence: number
  is_coinbase: boolean
}

export interface TransactionOutput {
  scriptpubkey: string
  scriptpubkey_asm: string
  scriptpubkey_type: string
  scriptpubkey_address?: string
  value: number
}

export interface TransactionStatus {
  confirmed: boolean
  block_height?: number
  block_hash?: string
  block_time?: number
}

export interface BuildTransactionParams {
  inputs: { txid: string; vout: number; value: number; scriptPubKey?: string }[]
  outputs: { address: string; value: number }[]
  feeRate: number
  enableRBF?: boolean
}

export interface RBFTransaction {
  originalTxid: string
  originalFee: number
  newFee: number
  feeIncrease: number
  inputs: TransactionInput[]
  outputs: TransactionOutput[]
}
