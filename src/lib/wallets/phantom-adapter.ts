import { BaseWalletAdapter } from './base-adapter'
import { WalletProvider, BitcoinNetwork } from '@/types'

declare global {
  interface Window {
    phantom?: {
      bitcoin?: any
    }
  }
}

export class PhantomAdapter extends BaseWalletAdapter {
  name: WalletProvider = 'phantom'

  isInstalled(): boolean {
    return typeof window !== 'undefined' &&
           typeof window.phantom !== 'undefined' &&
           typeof window.phantom.bitcoin !== 'undefined'
  }

  protected getProvider(): any {
    return window.phantom?.bitcoin
  }

  protected async requestAccounts(): Promise<string> {
    const response = await this.provider.connect()
    return response.address || response.publicKey
  }

  async getPublicKey(): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    const account = await this.provider.getAccount()
    return account.publicKey
  }

  async signPsbt(psbtHex: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    const result = await this.provider.signPsbt(psbtHex)
    return result.signedPsbtHex || result
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    const result = await this.provider.signMessage(message)
    return result.signature
  }

  async pushTransaction(txHex: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    // Phantom may not support direct transaction broadcasting
    // Fall back to using API
    throw new Error('Use API to broadcast transaction')
  }

  async switchNetwork(network: BitcoinNetwork): Promise<void> {
    // Phantom handles network switching internally
    this.currentNetwork = network
  }
}
