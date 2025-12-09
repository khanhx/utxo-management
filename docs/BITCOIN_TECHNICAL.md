# Bitcoin Technical Documentation

Technical reference for Bitcoin concepts, transaction structures, and protocols used in the UTXO Management Tool.

## Table of Contents

1. [Bitcoin Fundamentals](#bitcoin-fundamentals)
2. [UTXO Model](#utxo-model)
3. [Bitcoin Transactions](#bitcoin-transactions)
4. [Address Types](#address-types)
5. [Replace-By-Fee (RBF)](#replace-by-fee-rbf)
6. [Fee Estimation](#fee-estimation)
7. [PSBT (Partially Signed Bitcoin Transactions)](#psbt)
8. [Testnet4 vs Mainnet](#testnet4-vs-mainnet)
9. [Security Best Practices](#security-best-practices)

---

## Bitcoin Fundamentals

### What is Bitcoin?

Bitcoin is a decentralized digital currency system based on:
- **Blockchain**: Distributed ledger of all transactions
- **Proof-of-Work**: Mining secures the network
- **Consensus**: Network agrees on transaction history
- **Cryptography**: Digital signatures prove ownership

### Key Concepts

**Satoshi**
- Smallest Bitcoin unit
- 1 BTC = 100,000,000 satoshis
- Named after Bitcoin's creator

**Block**
- Container of transactions
- ~10 minute block time
- Contains reference to previous block
- Maximum size: 4 MB (weight units)

**Confirmation**
- Transaction included in a block
- Each new block adds one confirmation
- 6 confirmations typically considered secure
- More confirmations = more security

**Mempool**
- Pool of unconfirmed transactions
- Miners select from mempool
- Higher fee = higher priority
- Transactions can remain pending

---

## UTXO Model

### What is a UTXO?

**Unspent Transaction Output (UTXO)** is Bitcoin's accounting model:
- Each UTXO represents spendable Bitcoin
- Similar to cash bills in physical wallet
- Must be spent entirely in a transaction
- Change returns as new UTXO

### UTXO Structure

```
UTXO {
  txid: "abc123..."          // Transaction ID (64 hex chars)
  vout: 0                     // Output index in transaction
  value: 100000               // Amount in satoshis
  scriptPubKey: "76a914..."  // Locking script
  confirmations: 6            // Number of confirmations
}
```

### UTXO Lifecycle

```
1. Creation: Transaction creates output → New UTXO
2. Unspent: UTXO sits in address
3. Selection: User selects UTXO for spending
4. Spent: UTXO consumed as transaction input
5. Destroyed: UTXO no longer exists (value transferred)
```

### Why UTXO Management Matters

**Privacy**
- Linking multiple UTXOs can reveal relationships
- Coin control helps maintain privacy
- Separate UTXOs for different purposes

**Fee Optimization**
- Many small UTXOs = larger transactions = higher fees
- UTXO consolidation reduces future fees
- Strategic UTXO selection saves money

**Dust Management**
- Very small UTXOs (< 546 sats) called "dust"
- Uneconomical to spend due to fees
- Consolidate or avoid creating dust

---

## Bitcoin Transactions

### Transaction Structure

```
Transaction {
  version: 2                    // Transaction version
  inputs: [                     // One or more inputs
    {
      txid: "abc123...",       // Previous transaction
      vout: 0,                  // Output index
      scriptSig: "...",         // Unlocking script
      sequence: 0xfffffffd      // For RBF/timelocks
    }
  ],
  outputs: [                    // One or more outputs
    {
      value: 50000,             // Amount in satoshis
      scriptPubKey: "..."       // Locking script
    }
  ],
  locktime: 0                   // Transaction locktime
}
```

### Transaction Inputs

**Purpose**: Prove you can spend UTXOs

Components:
- **txid**: Transaction containing the UTXO
- **vout**: Which output in that transaction
- **scriptSig/witness**: Proof of ownership (signature)
- **sequence**: RBF signaling and timelocks

### Transaction Outputs

**Purpose**: Send Bitcoin to addresses

Components:
- **value**: Amount in satoshis
- **scriptPubKey**: Conditions to spend (locking script)

Types of outputs:
- **Recipient output**: Send to another address
- **Change output**: Return leftover to yourself
- **OP_RETURN**: Data storage (0 value)

### Transaction Fees

Fee calculation:
```
Fee = Total Inputs - Total Outputs

Example:
Inputs:  100,000 sats
Outputs:  60,000 sats (recipient)
          35,000 sats (change)
Fee:       5,000 sats
```

Fee rate:
```
Fee Rate = Fee / Transaction Size (vBytes)

Example:
Fee: 5,000 sats
Size: 250 vBytes
Fee Rate: 20 sat/vB
```

### Transaction Lifecycle

```
1. Build: Create transaction with inputs/outputs
2. Sign: Wallet signs with private key
3. Broadcast: Send to Bitcoin network
4. Mempool: Waits for mining
5. Confirmation: Included in block
6. Settlement: 6+ confirmations (recommended)
```

---

## Address Types

### P2PKH (Pay-to-Public-Key-Hash)

**Format**: Starts with "1"
```
Example: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

**Features**:
- Original Bitcoin address type
- Base58Check encoding
- Larger transaction size
- Higher fees compared to SegWit

**Structure**:
- Version byte (0x00 for mainnet)
- 20-byte hash of public key
- 4-byte checksum

### P2SH (Pay-to-Script-Hash)

**Format**: Starts with "3"
```
Example: 3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy
```

**Features**:
- Can contain complex scripts
- Multisig addresses use P2SH
- SegWit can be wrapped in P2SH
- Slightly higher fees than P2PKH

**Use Cases**:
- Multisignature wallets
- Timelock contracts
- Complex spending conditions

### P2WPKH (Pay-to-Witness-Public-Key-Hash) - Native SegWit

**Format**: Starts with "bc1q" (mainnet) or "tb1q" (testnet)
```
Example: bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
```

**Features**:
- Segregated Witness (SegWit)
- Smaller transaction size
- Lower fees (~40% savings)
- Bech32 encoding
- Error detection

**Advantages**:
- Most efficient for single-sig
- Better for fee minimization
- Native SegWit support

### P2TR (Pay-to-Taproot)

**Format**: Starts with "bc1p" (mainnet) or "tb1p" (testnet)
```
Example: bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297
```

**Features**:
- Taproot upgrade (2021)
- Schnorr signatures
- Enhanced privacy
- More complex scripting

**Note**: Not yet fully implemented in this tool (planned for future).

### Testnet Address Formats

- P2PKH: Starts with "m" or "n"
- P2SH: Starts with "2"
- P2WPKH: Starts with "tb1q"
- P2TR: Starts with "tb1p"

---

## Replace-By-Fee (RBF)

### What is RBF?

**Replace-By-Fee** allows replacing an unconfirmed transaction with a new version that pays a higher fee.

**BIP 125 Standard**: Bitcoin Improvement Proposal defining RBF rules.

### RBF Signaling

**Sequence Number**:
```
RBF Enabled:  sequence < 0xfffffffe (4294967294)
RBF Disabled: sequence = 0xffffffff (4294967295)

Common RBF sequence: 0xfffffffd (4294967293)
```

A transaction signals RBF if ANY input has sequence < 0xfffffffe.

### BIP 125 Rules

Replacement transaction must:

1. **Higher Fee**: Pay more total fee than original
2. **Fee Rate**: Pay for its own relay cost (~1 sat/vB increase minimum)
3. **No New Unconfirmed Inputs**: Can't add new unconfirmed UTXOs
4. **Replace All**: Replaces original and any conflicts

### Minimum Fee Increase

```
Minimum New Fee = Original Fee + (Replacement Size × Relay Fee Rate)

Example:
Original Fee: 5,000 sats
Replacement Size: 250 vBytes
Relay Fee Rate: 1 sat/vB
Minimum New Fee: 5,000 + 250 = 5,250 sats
```

### Output Adjustment

When increasing fee, reduce change output:

```
Original Transaction:
  Input:  100,000 sats
  Output: 60,000 sats (recipient)
  Output: 35,000 sats (change)
  Fee:     5,000 sats

Replacement (2x fee):
  Input:  100,000 sats (same)
  Output: 60,000 sats (recipient, same)
  Output: 30,000 sats (change, reduced)
  Fee:    10,000 sats (doubled)
```

### RBF Limitations

**Cannot Replace If**:
- Transaction already confirmed
- Original didn't signal RBF
- Insufficient change to cover fee increase
- Replacement fee doesn't meet BIP 125 rules

**Best Practices**:
- Always enable RBF for non-urgent transactions
- Monitor fee rates before broadcasting
- Start with conservative fee, bump if needed
- Don't over-bump (wastes money)

---

## Fee Estimation

### Fee Rate vs Total Fee

**Fee Rate**: Cost per virtual byte (sat/vB)
```
Determines confirmation speed
Higher rate = faster confirmation
```

**Total Fee**: Absolute cost (satoshis)
```
Total Fee = Transaction Size (vBytes) × Fee Rate (sat/vB)
```

### Transaction Size Estimation

**P2WPKH (Native SegWit)**:
```
Base Size:
  Version: 4 bytes
  Input Count: 1 byte
  Output Count: 1 byte
  Locktime: 4 bytes
  = 10 bytes

Per Input:
  Previous TX: 32 bytes
  Previous Index: 4 bytes
  Script Length: 1 byte
  Sequence: 4 bytes
  Witness: ~107 bytes (weight calculation)
  = ~68 vBytes per input

Per Output:
  Value: 8 bytes
  Script Length: 1 byte
  Script: 22-34 bytes
  = ~31 vBytes per output

Example Transaction (1 input, 2 outputs):
10 + 68 + (31 × 2) = 140 vBytes
```

**P2PKH (Legacy)**:
```
Per Input: ~148 vBytes
Per Output: ~34 vBytes

Example Transaction (1 input, 2 outputs):
10 + 148 + (34 × 2) = 226 vBytes
```

### Fee Priorities

**Mempool.space API Fee Estimates**:

- **Fastest Fee**: Next block (~10 min)
- **Half Hour Fee**: Within 30 minutes
- **Hour Fee**: Within 1 hour
- **Economy Fee**: Low priority (hours to days)
- **Minimum Fee**: Minimum relay fee (~1 sat/vB)

**Choosing Fee Rate**:
```
Urgent:     Use Fastest Fee (50-100+ sat/vB in high congestion)
Normal:     Use Half Hour or Hour Fee (10-30 sat/vB)
Economical: Use Economy Fee (1-5 sat/vB)
Patient:    Use Minimum Fee (1 sat/vB)
```

### Dust Limit

**Definition**: Minimum economical output size
```
Dust Limit: 546 satoshis

Outputs below this are:
- Uneconomical to spend (fee > value)
- May not relay on network
- Should be avoided or consolidated
```

**Calculating If Output is Dust**:
```
Output Value: 500 sats
Cost to Spend: ~68 vBytes × 10 sat/vB = 680 sats
Result: Output costs more to spend than it's worth (dust)
```

---

## PSBT (Partially Signed Bitcoin Transactions)

### What is PSBT?

**PSBT (BIP 174)**: Standard format for unsigned or partially signed transactions.

**Purpose**:
- Separate transaction construction from signing
- Enable multi-party signing (multisig)
- Hardware wallet compatibility
- Better security (untrusted coordinators)

### PSBT Workflow

```
1. Creator: Build unsigned transaction → PSBT
2. Updater: Add UTXO information → Updated PSBT
3. Signer: Sign with private key → Signed PSBT
4. Combiner: Merge multiple signatures → Combined PSBT
5. Finalizer: Finalize transaction → Final TX
6. Extractor: Extract final transaction → Broadcast
```

### PSBT in This Application

```typescript
// 1. Create PSBT
const psbt = transactionBuilder.createPSBT(
  inputs,
  outputs,
  feeRate,
  enableRBF
)

// 2. Send to wallet for signing
const signedPsbt = await wallet.signPsbt(psbt)

// 3. Finalize PSBT
const finalTx = transactionBuilder.finalizePSBT(signedPsbt)

// 4. Broadcast
const txid = await api.broadcastTransaction(finalTx)
```

### PSBT Format

**Structure**:
```
PSBT {
  Global:
    - Unsigned transaction
    - Version
  Inputs: [
    - UTXO information
    - Derivation paths
    - Signatures (after signing)
  ],
  Outputs: [
    - Derivation paths (for change)
  ]
}
```

**Encoding**: Base64 or Hex

---

## Testnet4 vs Mainnet

### Mainnet (Production)

**Characteristics**:
- Real Bitcoin (BTC)
- Real monetary value
- Irreversible transactions
- Must be careful
- Current network

**Network Parameters**:
- Address prefix: 1, 3, bc1
- P2PKH version: 0x00
- P2SH version: 0x05
- Bech32 HRP: "bc"

### Testnet4 (Testing)

**Characteristics**:
- Test Bitcoin (no value)
- Free from faucets
- Safe for experiments
- Resets occasionally
- For development

**Network Parameters**:
- Address prefix: m, n, 2, tb1
- P2PKH version: 0x6F
- P2SH version: 0xC4
- Bech32 HRP: "tb"

**Why Testnet4 (not Testnet3)**:
- Fresh start (no historical issues)
- Better protected from 51% attacks
- More reliable for testing
- Active development support

### Getting Testnet Coins

**Faucets**:
1. [Mempool.space Testnet4 Faucet](https://mempool.space/testnet4/faucet)
2. Enter your testnet address
3. Receive 0.001 - 0.01 tBTC
4. Wait for confirmation

**Mining**:
- Testnet has lower difficulty
- CPU mining possible
- Good for learning

### Network Differences

| Feature | Mainnet | Testnet4 |
|---------|---------|----------|
| Value | Real BTC | No value |
| Addresses | 1, 3, bc1 | m, n, 2, tb1 |
| Block Time | ~10 min | ~10 min |
| Difficulty | Very high | Low |
| Reset | Never | Occasionally |
| Faucets | No | Yes |
| Use Case | Production | Testing |

---

## Security Best Practices

### Transaction Security

**Always Verify**:
1. Recipient address (character by character)
2. Send amount (exact value)
3. Fee (reasonable, not excessive)
4. Network (mainnet vs testnet)

**Before Signing**:
- Review transaction in wallet
- Check all outputs
- Verify fee is acceptable
- Ensure you have enough confirmations on inputs

### Private Key Security

**Never**:
- Share private keys
- Enter private keys in web forms
- Store private keys in plain text
- Screenshot private keys
- Email private keys

**Always**:
- Use hardware wallets for large amounts
- Keep seed phrases offline
- Test with small amounts first
- Use multi-signature for large holdings

### UTXO Management Security

**Privacy**:
- Avoid linking UTXOs from different sources
- Use coin control to maintain privacy
- Consider CoinJoin for enhanced privacy
- Be aware of amount fingerprinting

**Dust Attacks**:
- Small dust UTXOs sent to your address
- Goal: Track you when you spend them
- Solution: Don't spend dust, consolidate carefully

### Application Security

**This Tool**:
- No private key handling ✓
- Client-side only ✓
- Open source code ✓
- Input validation ✓

**User Responsibilities**:
- Verify application URL (avoid phishing)
- Keep wallet extension updated
- Review all transactions in wallet
- Start with testnet
- Use small amounts on mainnet initially

### Network Security

**Mempool Monitoring**:
- Check fee rates before broadcasting
- Monitor transaction status
- Be aware of network congestion
- Use RBF for important transactions

**Double-Spend Protection**:
- Wait for confirmations (6+ recommended)
- More confirmations for larger amounts
- Be cautious with 0-conf transactions

---

## Bitcoin Resources

### Official Documentation
- [Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/)
- [Bitcoin Core Documentation](https://bitcoin.org/en/developer-documentation)
- [Bitcoin Wiki](https://en.bitcoin.it/wiki/Main_Page)

### BIPs (Bitcoin Improvement Proposals)
- [BIP 125 (RBF)](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki)
- [BIP 141 (SegWit)](https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki)
- [BIP 174 (PSBT)](https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki)
- [BIP 341 (Taproot)](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki)

### Libraries
- [@scure/btc-signer](https://github.com/paulmillr/scure-btc-signer) - Modern Bitcoin library
- [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) - Bitcoin JS library

### Block Explorers
- [Mempool.space](https://mempool.space) - Mainnet
- [Mempool.space Testnet4](https://mempool.space/testnet4) - Testnet4

### Learning Resources
- [Mastering Bitcoin](https://github.com/bitcoinbook/bitcoinbook) - Book by Andreas Antonopoulos
- [Learn Me a Bitcoin](https://learnmeabitcoin.com/) - Visual learning
- [Bitcoin Optech](https://bitcoinops.org/) - Technical newsletter

---

## Glossary

**BIP**: Bitcoin Improvement Proposal - formal design documents
**Block Height**: Number of blocks in chain
**Confirmation**: Inclusion of transaction in a block
**Dust**: Very small UTXO uneconomical to spend
**Mempool**: Pool of unconfirmed transactions
**Mining**: Process of creating new blocks
**P2PKH**: Pay-to-Public-Key-Hash address type
**P2SH**: Pay-to-Script-Hash address type
**P2WPKH**: Pay-to-Witness-Public-Key-Hash (SegWit) address type
**PSBT**: Partially Signed Bitcoin Transaction
**RBF**: Replace-By-Fee mechanism
**Satoshi**: Smallest Bitcoin unit (0.00000001 BTC)
**SegWit**: Segregated Witness upgrade
**TXID**: Transaction identifier (hash)
**UTXO**: Unspent Transaction Output
**vByte**: Virtual byte (SegWit size measurement)

---

For practical usage, see:
- [User Guide](./USER_GUIDE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Testnet4 Guide](./TESTNET4_GUIDE.md)
