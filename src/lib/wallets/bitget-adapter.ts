import { BaseWalletAdapter } from './base-adapter'
import { WalletProvider, BitcoinNetwork } from '@/types'

declare global {
  interface Window {
    bitkeep?: {
      unisat?: any
    }
  }
}

export class BitgetAdapter extends BaseWalletAdapter {
  name: WalletProvider = 'bitget'

  isInstalled(): boolean {
    return typeof window !== 'undefined' &&
           typeof window.bitkeep !== 'undefined' &&
           typeof window.bitkeep.unisat !== 'undefined'
  }

  protected getProvider(): any {
    return window.bitkeep?.unisat
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
  }
}
