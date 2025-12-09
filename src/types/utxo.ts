export interface UTXO {
  txid: string
  vout: number
  value: number // satoshis
  status: UTXOStatus
  scriptPubKey?: string
  address?: string
}

export interface UTXOStatus {
  confirmed: boolean
  block_height?: number
  block_hash?: string
  block_time?: number
}

export interface CustomUTXO {
  txid: string
  vout: number
  value: number
  scriptPubKey: string
  label?: string
}
