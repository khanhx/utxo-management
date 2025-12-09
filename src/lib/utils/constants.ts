export const SATOSHIS_PER_BTC = 100_000_000

export const MIN_RELAY_FEE = 1 // sat/vB
export const DUST_LIMIT = 546 // satoshis

export const RBF_SEQUENCE = 0xfffffffd
export const DEFAULT_SEQUENCE = 0xffffffff

export const WALLET_DISPLAY_NAMES: Record<string, string> = {
  unisat: 'Unisat',
  phantom: 'Phantom',
  okx: 'OKX Wallet',
  metamask: 'MetaMask',
  bitget: 'Bitget Wallet',
}

export const NETWORK_NAMES: Record<string, string> = {
  mainnet: 'Bitcoin Mainnet',
  testnet4: 'Bitcoin Testnet4',
}

export const FEE_PRIORITY_LABELS: Record<string, string> = {
  fastest: 'Fastest (High Priority)',
  fast: 'Fast (~30 min)',
  medium: 'Medium (~1 hour)',
  slow: 'Economy (Low Priority)',
}

export const TX_SIZE_ESTIMATES = {
  p2pkh_input: 148,
  p2wpkh_input: 68,
  p2sh_input: 91,
  output: 34,
  base: 10,
}
