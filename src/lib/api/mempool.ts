import { MempoolClient } from './client'
import { UTXO, Transaction, TransactionStatus, FeeEstimates, AddressInfo } from '@/types'

export class MempoolAPI extends MempoolClient {
  // Get UTXOs for address with scriptPubKey enrichment
  async getAddressUTXOs(address: string): Promise<UTXO[]> {
    try {
      const response = await this.client.get(`/address/${address}/utxo`)
      const utxos: UTXO[] = response.data

      // Enrich UTXOs with scriptPubKey from transaction details
      const enrichedUtxos = await Promise.all(
        utxos.map(async (utxo) => {
          try {
            const tx = await this.getTransaction(utxo.txid)
            const output = tx.vout[utxo.vout]

            return {
              ...utxo,
              scriptPubKey: output.scriptpubkey,
              address: output.scriptpubkey_address || address,
            }
          } catch (error) {
            console.error(`Error enriching UTXO ${utxo.txid}:${utxo.vout}`, error)
            // Return UTXO without scriptPubKey if enrichment fails
            return utxo
          }
        })
      )

      return enrichedUtxos
    } catch (error) {
      console.error('Error fetching UTXOs:', error)
      throw error
    }
  }

  // Get address transactions
  async getAddressTransactions(address: string): Promise<Transaction[]> {
    try {
      const response = await this.client.get(`/address/${address}/txs`)
      return response.data
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  }

  // Get address info
  async getAddressInfo(address: string): Promise<AddressInfo> {
    try {
      const response = await this.client.get(`/address/${address}`)
      return response.data
    } catch (error) {
      console.error('Error fetching address info:', error)
      throw error
    }
  }

  // Get transaction details
  async getTransaction(txid: string): Promise<Transaction> {
    try {
      const response = await this.client.get(`/tx/${txid}`)
      return response.data
    } catch (error) {
      console.error('Error fetching transaction:', error)
      throw error
    }
  }

  // Get transaction status
  async getTransactionStatus(txid: string): Promise<TransactionStatus> {
    try {
      const response = await this.client.get(`/tx/${txid}/status`)
      return response.data
    } catch (error) {
      console.error('Error fetching transaction status:', error)
      throw error
    }
  }

  // Get raw transaction hex
  async getRawTransaction(txid: string): Promise<string> {
    try {
      const response = await this.client.get(`/tx/${txid}/hex`)
      return response.data
    } catch (error) {
      console.error('Error fetching raw transaction:', error)
      throw error
    }
  }

  // Broadcast transaction
  async broadcastTransaction(txHex: string): Promise<string> {
    try {
      const response = await this.client.post('/tx', txHex, {
        headers: { 'Content-Type': 'text/plain' },
      })
      return response.data // Returns txid
    } catch (error) {
      console.error('Error broadcasting transaction:', error)
      throw error
    }
  }

  // Get recommended fees
  async getRecommendedFees(): Promise<FeeEstimates> {
    try {
      const response = await this.client.get('/v1/fees/recommended')
      return response.data
    } catch (error) {
      console.error('Error fetching fees:', error)
      throw error
    }
  }

  // Get current block height
  async getCurrentBlockHeight(): Promise<number> {
    try {
      const response = await this.client.get('/blocks/tip/height')
      return response.data
    } catch (error) {
      console.error('Error fetching block height:', error)
      throw error
    }
  }

  // Get mempool info
  async getMempoolInfo(): Promise<any> {
    try {
      const response = await this.client.get('/mempool')
      return response.data
    } catch (error) {
      console.error('Error fetching mempool info:', error)
      throw error
    }
  }
}

// Singleton instance
let mempoolAPI: MempoolAPI | null = null

export function getMempoolAPI(network: 'mainnet' | 'testnet4' = 'testnet4'): MempoolAPI {
  if (!mempoolAPI) {
    mempoolAPI = new MempoolAPI(network)
  } else {
    mempoolAPI.switchNetwork(network)
  }
  return mempoolAPI
}
