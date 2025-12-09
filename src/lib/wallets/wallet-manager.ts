import { WalletAdapter, WalletProvider, WalletInfo } from '@/types'
import { UnisatAdapter } from './unisat-adapter'
import { PhantomAdapter } from './phantom-adapter'
import { OKXAdapter } from './okx-adapter'
import { MetaMaskAdapter } from './metamask-adapter'
import { BitgetAdapter } from './bitget-adapter'
import { WALLET_DISPLAY_NAMES } from '@/lib/utils/constants'

export class WalletManager {
  private adapters: Map<WalletProvider, WalletAdapter>
  private currentAdapter: WalletAdapter | null = null

  constructor() {
    this.adapters = new Map<WalletProvider, WalletAdapter>()
    this.adapters.set('unisat', new UnisatAdapter())
    this.adapters.set('phantom', new PhantomAdapter())
    this.adapters.set('okx', new OKXAdapter())
    this.adapters.set('metamask', new MetaMaskAdapter())
    this.adapters.set('bitget', new BitgetAdapter())
  }

  getAvailableWallets(): WalletInfo[] {
    return Array.from(this.adapters.entries()).map(([provider, adapter]) => ({
      name: provider,
      displayName: WALLET_DISPLAY_NAMES[provider] || provider,
      icon: `/wallets/${provider}.png`,
      installed: adapter.isInstalled(),
    }))
  }

  getInstalledWallets(): WalletProvider[] {
    return Array.from(this.adapters.entries())
      .filter(([_, adapter]) => adapter.isInstalled())
      .map(([provider, _]) => provider)
  }

  async connect(provider: WalletProvider): Promise<string> {
    const adapter = this.adapters.get(provider)
    if (!adapter) {
      throw new Error(`Wallet provider ${provider} not supported`)
    }

    if (!adapter.isInstalled()) {
      throw new Error(`${WALLET_DISPLAY_NAMES[provider] || provider} wallet is not installed. Please install the extension first.`)
    }

    try {
      const address = await adapter.connect()
      this.currentAdapter = adapter
      return address
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      throw new Error(error.message || 'Failed to connect wallet')
    }
  }

  async disconnect(): Promise<void> {
    if (this.currentAdapter) {
      await this.currentAdapter.disconnect()
      this.currentAdapter = null
    }
  }

  getCurrentAdapter(): WalletAdapter | null {
    return this.currentAdapter
  }

  isConnected(): boolean {
    return this.currentAdapter !== null
  }

  async getAddress(): Promise<string | null> {
    if (!this.currentAdapter) return null
    try {
      return await this.currentAdapter.getAddress()
    } catch {
      return null
    }
  }

  async getPublicKey(): Promise<string | null> {
    if (!this.currentAdapter) return null
    try {
      return await this.currentAdapter.getPublicKey()
    } catch {
      return null
    }
  }

  async signPsbt(psbtHex: string): Promise<string> {
    if (!this.currentAdapter) {
      throw new Error('No wallet connected')
    }
    return await this.currentAdapter.signPsbt(psbtHex)
  }

  async signMessage(message: string): Promise<string> {
    if (!this.currentAdapter) {
      throw new Error('No wallet connected')
    }
    return await this.currentAdapter.signMessage(message)
  }

  async pushTransaction(txHex: string): Promise<string> {
    if (!this.currentAdapter) {
      throw new Error('No wallet connected')
    }
    return await this.currentAdapter.pushTransaction(txHex)
  }
}

// Singleton instance
let walletManager: WalletManager | null = null

export function getWalletManager(): WalletManager {
  if (!walletManager) {
    walletManager = new WalletManager()
  }
  return walletManager
}
