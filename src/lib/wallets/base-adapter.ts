import { WalletAdapter, WalletProvider, BitcoinNetwork } from '@/types'

export abstract class BaseWalletAdapter implements WalletAdapter {
  abstract name: WalletProvider
  protected provider: any
  protected currentAddress: string | null = null
  protected currentNetwork: BitcoinNetwork = 'testnet4'

  abstract isInstalled(): boolean
  protected abstract getProvider(): any

  async connect(): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error(`${this.name} wallet is not installed`)
    }

    try {
      this.provider = this.getProvider()
      const address = await this.requestAccounts()
      this.currentAddress = address
      this.setupEventListeners()
      return this.currentAddress
    } catch (error: any) {
      throw new Error(`Failed to connect to ${this.name}: ${error.message}`)
    }
  }

  protected abstract requestAccounts(): Promise<string>

  async disconnect(): Promise<void> {
    this.currentAddress = null
  }

  async getAddress(): Promise<string> {
    if (!this.currentAddress) {
      throw new Error('Wallet not connected')
    }
    return this.currentAddress
  }

  abstract getPublicKey(): Promise<string>
  abstract signPsbt(psbtHex: string): Promise<string>
  abstract signMessage(message: string): Promise<string>
  abstract pushTransaction(txHex: string): Promise<string>
  abstract switchNetwork(network: BitcoinNetwork): Promise<void>

  protected setupEventListeners() {
    // Override in subclasses to handle wallet events
  }
}
