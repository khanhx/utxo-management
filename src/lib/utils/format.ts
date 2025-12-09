/**
 * Format satoshis to BTC with 8 decimal places
 */
export function formatBTC(satoshis: number): string {
  return (satoshis / 100_000_000).toFixed(8)
}

/**
 * Format satoshis for display
 */
export function formatSatoshis(satoshis: number): string {
  return satoshis.toLocaleString() + ' sats'
}

/**
 * Format fee for display
 */
export function formatFee(satoshis: number): string {
  const btc = satoshis / 100_000_000
  return `${btc.toFixed(8)} BTC (${satoshis.toLocaleString()} sats)`
}

/**
 * Truncate transaction ID for display
 */
export function truncateTxid(txid: string, length: number = 8): string {
  if (txid.length <= length * 2) return txid
  return `${txid.slice(0, length)}...${txid.slice(-length)}`
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, length: number = 6): string {
  if (address.length <= length * 2) return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
