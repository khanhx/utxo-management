import { BaseWalletAdapter } from './base-adapter'
import { WalletProvider, BitcoinNetwork } from '@/types'

declare global {
  interface Window {
    ethereum?: any
  }
}

export class MetaMaskAdapter extends BaseWalletAdapter {
  name: WalletProvider = 'metamask'

  isInstalled(): boolean {
    return typeof window !== 'undefined' &&
           typeof window.ethereum !== 'undefined' &&
           window.ethereum.isMetaMask === true
  }

  protected getProvider(): any {
    return window.ethereum
  }

  protected async requestAccounts(): Promise<string> {
    // Note: MetaMask Bitcoin support requires Snaps
    // This is a simplified implementation
    const accounts = await this.provider.request({
      method: 'eth_requestAccounts'
    })
    // This would need to be adapted for Bitcoin Snaps
    return accounts[0]
  }

  async getPublicKey(): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    // Bitcoin Snaps implementation would go here
    throw new Error('MetaMask Bitcoin support requires Snaps - not yet fully implemented')
  }

  async signPsbt(psbtHex: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    throw new Error('MetaMask Bitcoin support requires Snaps - not yet fully implemented')
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    throw new Error('MetaMask Bitcoin support requires Snaps - not yet fully implemented')
  }

  async pushTransaction(txHex: string): Promise<string> {
    throw new Error('MetaMask Bitcoin support requires Snaps - not yet fully implemented')
  }

  async switchNetwork(network: BitcoinNetwork): Promise<void> {
    this.currentNetwork = network
  }
}
