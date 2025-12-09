import { BaseWalletAdapter } from './base-adapter'
import { WalletProvider, BitcoinNetwork } from '@/types'

declare global {
  interface Window {
    okxwallet?: {
      bitcoin?: any
    }
  }
}

export class OKXAdapter extends BaseWalletAdapter {
  name: WalletProvider = 'okx'

  isInstalled(): boolean {
    return typeof window !== 'undefined' &&
           typeof window.okxwallet !== 'undefined' &&
           typeof window.okxwallet.bitcoin !== 'undefined'
  }

  protected getProvider(): any {
    return window.okxwallet?.bitcoin
  }

  protected async requestAccounts(): Promise<string> {
    const result = await this.provider.connect()
    return result.address || result.publicKey
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
