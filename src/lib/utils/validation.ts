import { BitcoinNetwork } from '@/types'

/**
 * Validate Bitcoin address format
 */
export function isValidBitcoinAddress(address: string, network: BitcoinNetwork = 'mainnet'): boolean {
  try {
    // Basic validation for different address types
    if (network === 'mainnet') {
      // Legacy P2PKH (starts with 1)
      if (/^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) return true
      // P2SH (starts with 3)
      if (/^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) return true
      // Bech32 (starts with bc1)
      if (/^bc1[a-z0-9]{39,87}$/.test(address)) return true
    } else {
      // Testnet Legacy (starts with m or n)
      if (/^[mn][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) return true
      // Testnet P2SH (starts with 2)
      if (/^2[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) return true
      // Testnet Bech32 (starts with tb1)
      if (/^tb1[a-z0-9]{39,87}$/.test(address)) return true
    }
    return false
  } catch {
    return false
  }
}

/**
 * Validate transaction ID format
 */
export function isValidTxid(txid: string): boolean {
  return /^[a-fA-F0-9]{64}$/.test(txid)
}

/**
 * Validate amount in satoshis
 */
export function isValidAmount(amount: number): boolean {
  return amount > 0 && amount <= 21_000_000 * 100_000_000 && Number.isInteger(amount)
}

/**
 * Validate output index
 */
export function isValidVout(vout: number): boolean {
  return Number.isInteger(vout) && vout >= 0
}

/**
 * Validate hex string
 */
export function isValidHex(hex: string): boolean {
  return /^[a-fA-F0-9]+$/.test(hex) && hex.length % 2 === 0
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[<>"'&]/g, '').trim()
}

/**
 * Validate script pubkey
 */
export function isValidScriptPubKey(script: string): boolean {
  return isValidHex(script) && script.length > 0
}
