# API Reference - Mempool.space Integration

Documentation for the Mempool.space API integration used in the Bitcoin UTXO Management Tool.

## Overview

This application uses the [Mempool.space](https://mempool.space) public API to interact with the Bitcoin blockchain without running a full node.

**API Characteristics**:
- RESTful HTTP API
- No authentication required
- Rate-limited but generous for development
- Returns JSON responses
- Supports both mainnet and testnet4

## Base URLs

### Mainnet
```
https://mempool.space/api
```

### Testnet4
```
https://mempool.space/testnet4/api
```

**Dynamic Switching**: The application automatically switches API base URLs when the user changes networks.

---

## API Client Implementation

### Configuration

**File**: `src/lib/api/mempool.ts`

```typescript
export class MempoolAPI {
  private baseURL: string
  private client: AxiosInstance

  constructor(network: BitcoinNetwork) {
    this.baseURL = network === 'mainnet'
      ? 'https://mempool.space/api'
      : 'https://mempool.space/testnet4/api'

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  switchNetwork(network: BitcoinNetwork) {
    this.baseURL = network === 'mainnet'
      ? 'https://mempool.space/api'
      : 'https://mempool.space/testnet4/api'
    this.client.defaults.baseURL = this.baseURL
  }
}
```

---

## Endpoints

### 1. Get Address UTXOs

Fetches all unspent transaction outputs for a Bitcoin address.

**Endpoint**:
```
GET /address/{address}/utxo
```

**Parameters**:
- `address` (path, required): Bitcoin address (mainnet: 1/3/bc1, testnet: m/n/2/tb1)

**Response**: Array of UTXO objects
```json
[
  {
    "txid": "abc123...",
    "vout": 0,
    "status": {
      "confirmed": true,
      "block_height": 800000,
      "block_hash": "def456...",
      "block_time": 1670000000
    },
    "value": 100000
  }
]
```

**Implementation**:
```typescript
async getAddressUTXOs(address: string): Promise<UTXO[]> {
  const response = await this.client.get(`/address/${address}/utxo`)
  return response.data
}
```

**Usage Example**:
```typescript
const api = new MempoolAPI('mainnet')
const utxos = await api.getAddressUTXOs('bc1q...')
console.log(`Found ${utxos.length} UTXOs`)
```

**Error Handling**:
- 404: Address not found or no UTXOs
- 400: Invalid address format
- 429: Rate limit exceeded
- 500: Server error

---

### 2. Get Address Transactions

Fetches transaction history for an address.

**Endpoint**:
```
GET /address/{address}/txs
```

**Parameters**:
- `address` (path, required): Bitcoin address

**Response**: Array of transaction objects
```json
[
  {
    "txid": "abc123...",
    "version": 2,
    "locktime": 0,
    "vin": [...],
    "vout": [...],
    "size": 225,
    "weight": 900,
    "fee": 5000,
    "status": {
      "confirmed": true,
      "block_height": 800000,
      "block_hash": "def456...",
      "block_time": 1670000000
    }
  }
]
```

**Implementation**:
```typescript
async getAddressTransactions(address: string): Promise<Transaction[]> {
  const response = await this.client.get(`/address/${address}/txs`)
  return response.data
}
```

---

### 3. Get Transaction Details

Fetches complete transaction information.

**Endpoint**:
```
GET /tx/{txid}
```

**Parameters**:
- `txid` (path, required): Transaction ID (64 hex characters)

**Response**: Transaction object
```json
{
  "txid": "abc123...",
  "version": 2,
  "locktime": 0,
  "vin": [
    {
      "txid": "prev123...",
      "vout": 0,
      "prevout": {
        "scriptpubkey": "...",
        "scriptpubkey_asm": "...",
        "scriptpubkey_type": "v0_p2wpkh",
        "scriptpubkey_address": "bc1q...",
        "value": 100000
      },
      "scriptsig": "...",
      "witness": ["..."],
      "is_coinbase": false,
      "sequence": 4294967293
    }
  ],
  "vout": [
    {
      "scriptpubkey": "...",
      "scriptpubkey_asm": "...",
      "scriptpubkey_type": "v0_p2wpkh",
      "scriptpubkey_address": "bc1q...",
      "value": 50000
    }
  ],
  "size": 225,
  "weight": 900,
  "fee": 5000,
  "status": {
    "confirmed": true,
    "block_height": 800000,
    "block_hash": "def456...",
    "block_time": 1670000000
  }
}
```

**Implementation**:
```typescript
async getTransaction(txid: string): Promise<Transaction> {
  const response = await this.client.get(`/tx/${txid}`)
  return response.data
}
```

**Usage Example**:
```typescript
const tx = await api.getTransaction('abc123...')
console.log(`Transaction fee: ${tx.fee} sats`)
console.log(`Confirmations: ${tx.status.confirmed ? 'Confirmed' : 'Pending'}`)
```

---

### 4. Get Transaction Status

Fetches only transaction confirmation status (lighter than full transaction).

**Endpoint**:
```
GET /tx/{txid}/status
```

**Parameters**:
- `txid` (path, required): Transaction ID

**Response**: Status object
```json
{
  "confirmed": true,
  "block_height": 800000,
  "block_hash": "def456...",
  "block_time": 1670000000
}
```

**Implementation**:
```typescript
async getTransactionStatus(txid: string): Promise<TransactionStatus> {
  const response = await this.client.get(`/tx/${txid}/status`)
  return response.data
}
```

**Usage**: Lightweight polling for transaction confirmations

---

### 5. Get Raw Transaction Hex

Fetches raw transaction in hexadecimal format.

**Endpoint**:
```
GET /tx/{txid}/hex
```

**Parameters**:
- `txid` (path, required): Transaction ID

**Response**: String (hex-encoded transaction)
```
"02000000..."
```

**Implementation**:
```typescript
async getRawTransaction(txid: string): Promise<string> {
  const response = await this.client.get(`/tx/${txid}/hex`)
  return response.data
}
```

**Usage**: Decode transactions, verify signatures

---

### 6. Broadcast Transaction

Submits a signed transaction to the Bitcoin network.

**Endpoint**:
```
POST /tx
```

**Request Body**: Raw transaction hex (plain text)
```
Content-Type: text/plain

02000000000101...
```

**Response**: Transaction ID (string)
```
"abc123def456..."
```

**Implementation**:
```typescript
async broadcastTransaction(txHex: string): Promise<string> {
  const response = await this.client.post('/tx', txHex, {
    headers: { 'Content-Type': 'text/plain' }
  })
  return response.data  // Returns txid
}
```

**Usage Example**:
```typescript
const signedTx = '02000000...'
const txid = await api.broadcastTransaction(signedTx)
console.log(`Transaction broadcast: ${txid}`)
```

**Error Responses**:
- 400: Invalid transaction format
- 400: Transaction validation failed (double-spend, insufficient fee, etc.)
- 429: Rate limit exceeded
- 500: Server error

**Common Rejection Reasons**:
- Double-spend (UTXO already spent)
- Fee too low (below minimum relay fee)
- Invalid signature
- Output below dust limit
- Transaction too large
- Locktime not reached

---

### 7. Get Recommended Fees

Fetches current network fee recommendations.

**Endpoint**:
```
GET /fees/recommended
```

**Response**: Fee estimates object
```json
{
  "fastestFee": 50,
  "halfHourFee": 30,
  "hourFee": 20,
  "economyFee": 10,
  "minimumFee": 1
}
```

**Units**: sat/vB (satoshis per virtual byte)

**Implementation**:
```typescript
async getRecommendedFees(): Promise<FeeEstimates> {
  const response = await this.client.get('/fees/recommended')
  return response.data
}
```

**Usage Example**:
```typescript
const fees = await api.getRecommendedFees()
console.log(`Fast confirmation: ${fees.fastestFee} sat/vB`)
console.log(`Economy: ${fees.economyFee} sat/vB`)
```

**Fee Priorities**:
- `fastestFee`: Next block (~10 minutes)
- `halfHourFee`: Within 3 blocks (~30 minutes)
- `hourFee`: Within 6 blocks (~1 hour)
- `economyFee`: Low priority (several hours)
- `minimumFee`: Minimum relay fee (~1 sat/vB)

---

### 8. Get Current Block Height

Fetches the current blockchain height.

**Endpoint**:
```
GET /blocks/tip/height
```

**Response**: Number (block height)
```
800000
```

**Implementation**:
```typescript
async getCurrentBlockHeight(): Promise<number> {
  const response = await this.client.get('/blocks/tip/height')
  return response.data
}
```

**Usage**: Calculate confirmations, check sync status

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "status": 400
}
```

### HTTP Status Codes

| Code | Meaning | Handling |
|------|---------|----------|
| 200 | Success | Return data |
| 400 | Bad Request | Validate input |
| 404 | Not Found | Handle gracefully |
| 429 | Rate Limited | Wait and retry |
| 500 | Server Error | Retry with backoff |
| 503 | Service Unavailable | Show maintenance message |

### Error Handling Implementation

```typescript
private handleError(error: any): never {
  if (error.response) {
    // Server responded with error
    const status = error.response.status
    const message = error.response.data?.error || error.message

    if (status === 429) {
      throw new Error('Rate limit exceeded. Please wait and try again.')
    } else if (status === 404) {
      throw new Error('Resource not found')
    } else if (status >= 500) {
      throw new Error('Service temporarily unavailable')
    } else {
      throw new Error(`API Error: ${message}`)
    }
  } else if (error.request) {
    // Request made but no response
    throw new Error('Network error: No response from server')
  } else {
    // Something else went wrong
    throw new Error(`Request error: ${error.message}`)
  }
}
```

---

## Rate Limiting

### Limits

**Mempool.space Public API**:
- No official rate limit published
- Reasonable use expected
- Implement client-side throttling

**Recommended Practices**:
- Cache responses when possible
- Implement exponential backoff
- Batch requests when possible
- Use WebSocket for real-time data (if available)

### Rate Limiting Implementation

```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = []
  private processing: boolean = false
  private requestsPerSecond: number = 10
  private minDelay: number = 1000 / this.requestsPerSecond

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return

    this.processing = true
    const fn = this.queue.shift()!

    await fn()
    await this.delay(this.minDelay)

    this.processing = false
    this.processQueue()
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
```

---

## Caching Strategy

### Cache Implementation

```typescript
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>()

  set<T>(key: string, data: T, ttl: number = 60000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear() {
    this.cache.clear()
  }
}
```

### Cache Usage

```typescript
async getAddressUTXOsWithCache(address: string): Promise<UTXO[]> {
  const cacheKey = `utxos:${address}`
  const cached = this.cache.get<UTXO[]>(cacheKey)

  if (cached) {
    return cached
  }

  const utxos = await this.getAddressUTXOs(address)
  this.cache.set(cacheKey, utxos, 30000) // 30 second TTL

  return utxos
}
```

---

## WebSocket API (Future)

Mempool.space also provides WebSocket API for real-time updates:

**Connection**:
```
wss://mempool.space/api/v1/ws
```

**Subscriptions**:
- New blocks
- New transactions
- Address transactions
- Mempool updates

**Future Enhancement**: Implement WebSocket for real-time UTXO and transaction updates.

---

## API Best Practices

### Request Optimization

1. **Batch Requests**: Group related requests when possible
2. **Cache Aggressively**: Cache immutable data (confirmed transactions)
3. **Minimize Polling**: Use webhooks or WebSocket when available
4. **Error Handling**: Implement retry with exponential backoff
5. **Timeout**: Set reasonable timeouts (30 seconds)

### Security Considerations

1. **HTTPS Only**: Always use secure connections
2. **Validate Responses**: Check response structure and data
3. **Sanitize Input**: Validate addresses and txids before requests
4. **Rate Limiting**: Implement client-side rate limiting
5. **Error Messages**: Don't expose sensitive information

### Performance Tips

1. **Connection Pooling**: Reuse HTTP connections
2. **Parallel Requests**: Fetch independent data concurrently
3. **Compression**: Enable gzip compression (usually automatic)
4. **CDN**: Mempool.space uses CDN for global performance
5. **Fallback**: Implement fallback to alternative APIs if needed

---

## Alternative APIs (Fallback Options)

### Blockstream API

**Base URL**: `https://blockstream.info/api` (mainnet)
**Base URL**: `https://blockstream.info/testnet/api` (testnet)

Similar endpoints, can be used as fallback.

### Blockchain.info API

**Base URL**: `https://blockchain.info`

Different endpoint structure, requires adaptation.

### Self-Hosted Node

For production applications, consider running your own Bitcoin node with API (Bitcoin Core + Electrum server).

---

## Testing

### Test Environment

Use testnet4 API for development and testing:
```
https://mempool.space/testnet4/api
```

### Example Tests

```typescript
// Test UTXO fetching
const testAddress = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx'
const utxos = await api.getAddressUTXOs(testAddress)
console.assert(Array.isArray(utxos), 'Should return array')

// Test fee estimation
const fees = await api.getRecommendedFees()
console.assert(fees.fastestFee > 0, 'Should have positive fee')

// Test block height
const height = await api.getCurrentBlockHeight()
console.assert(typeof height === 'number', 'Should be number')
```

---

## Resources

- [Mempool.space API Documentation](https://mempool.space/docs/api)
- [Mempool.space GitHub](https://github.com/mempool/mempool)
- [Bitcoin Developer Guide](https://developer.bitcoin.org)

---

For more information, see:
- [User Guide](./USER_GUIDE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Bitcoin Technical Details](./BITCOIN_TECHNICAL.md)
