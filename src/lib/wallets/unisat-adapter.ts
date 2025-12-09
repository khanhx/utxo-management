import { BaseWalletAdapter } from './base-adapter'
import { WalletProvider, BitcoinNetwork } from '@/types'

declare global {
  interface Window {
    unisat?: any
  }
}

export class UnisatAdapter extends BaseWalletAdapter {
  name: WalletProvider = 'unisat'

  isInstalled(): boolean {
    return typeof window !== 'undefined' && typeof window.unisat !== 'undefined'
  }

  protected getProvider(): any {
    return window.unisat
  }

  protected async requestAccounts(): Promise<string> {
    const accounts = await this.provider.requestAccounts()
    return accounts[0]
  }

  async getPublicKey(): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    return await this.provider.getPublicKey()
  }

  async signPsbt(psbtHex: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    return await this.provider.signPsbt(psbtHex)
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    return await this.provider.signMessage(message)
  }

  async pushTransaction(txHex: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized')
    return await this.provider.pushTx(txHex)
  }

  async switchNetwork(network: BitcoinNetwork): Promise<void> {
    if (!this.provider) throw new Error('Provider not initialized')
    const chain = network === 'mainnet' ? 'BITCOIN_MAINNET' : 'BITCOIN_TESTNET'
    await this.provider.switchChain(chain)
    this.currentNetwork = network
  }

  protected setupEventListeners() {
    if (!this.provider) return

    this.provider.on('accountsChanged', (accounts: string[]) => {
      this.currentAddress = accounts[0] || null
      window.dispatchEvent(
        new CustomEvent('walletAccountChanged', {
          detail: { address: this.currentAddress },
        })
      )
    })

    this.provider.on('networkChanged', (network: string) => {
      window.dispatchEvent(
        new CustomEvent('walletNetworkChanged', {
          detail: { network },
        })
      )
    })
  }
}
