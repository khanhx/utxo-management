import axios, { AxiosInstance, AxiosError } from 'axios'
import { BitcoinNetwork } from '@/types'

const MAINNET_BASE_URL = 'https://mempool.space/api'
const TESTNET4_BASE_URL = 'https://mempool.space/testnet4/api'

export class MempoolClient {
  protected baseURL: string
  protected client: AxiosInstance

  constructor(network: BitcoinNetwork = 'testnet4') {
    this.baseURL = network === 'mainnet' ? MAINNET_BASE_URL : TESTNET4_BASE_URL
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    )
  }

  // Switch network dynamically
  switchNetwork(network: BitcoinNetwork) {
    this.baseURL = network === 'mainnet' ? MAINNET_BASE_URL : TESTNET4_BASE_URL
    this.client.defaults.baseURL = this.baseURL
  }

  protected handleError(error: AxiosError): never {
    if (error.response) {
      // Server responded with error
      const message = typeof error.response.data === 'string'
        ? error.response.data
        : 'API Error'
      throw new Error(`${message} (Status: ${error.response.status})`)
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network error: No response from server')
    } else {
      throw new Error(`Request error: ${error.message}`)
    }
  }
}
