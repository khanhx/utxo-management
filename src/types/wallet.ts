export type WalletProvider = 'unisat' | 'phantom' | 'okx' | 'metamask' | 'bitget'
export type BitcoinNetwork = 'mainnet' | 'testnet4'

export interface WalletAdapter {
  name: WalletProvider
  connect(): Promise<string>
  disconnect(): Promise<void>
  getAddress(): Promise<string>
  getPublicKey(): Promise<string>
  signPsbt(psbtHex: string): Promise<string>
  signMessage(message: string): Promise<string>
  pushTransaction(txHex: string): Promise<string>
  switchNetwork(network: BitcoinNetwork): Promise<void>
  isInstalled(): boolean
}

export interface WalletInfo {
  name: WalletProvider
  displayName: string
  icon: string
  installed: boolean
}
