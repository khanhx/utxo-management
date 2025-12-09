# Bitcoin UTXO Manager - Usage Guide

## Getting Started

### 1. Installation and Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:3000`

### 2. Connect Your Wallet

**Supported Wallets:**
- Unisat Wallet
- Phantom Wallet
- OKX Wallet
- MetaMask (Bitcoin Snaps)
- Bitget Wallet

**Steps:**
1. Click the "Connect Wallet" button in the top-right corner
2. Select your installed wallet from the modal
3. Approve the connection in your wallet extension
4. Your address will appear in the navbar once connected

**Note:** Start with **Testnet4** (default) for testing. Switch to mainnet only when you're ready to use real Bitcoin.

### 3. Switch Networks

- Click the network switcher button in the navbar
- Choose between:
  - **Testnet4** (recommended for testing)
  - **Mainnet** (real Bitcoin)
- A warning will appear when switching to mainnet

## Features

### UTXO Management

#### Viewing UTXOs

Once your wallet is connected, your UTXOs will automatically load:
- **Confirmed UTXOs**: UTXOs with blockchain confirmations (green)
- **Pending UTXOs**: Unconfirmed transactions (yellow)

Each UTXO card shows:
- Transaction ID and output index (txid:vout)
- Value in BTC and satoshis
- Confirmation status
- Block height (if confirmed)
- Script pubkey (if available)

#### Adding Custom UTXOs

If you want to manually add a UTXO:

1. Click "Add Custom" in the UTXO section
2. Fill in the form:
   - **Transaction ID**: 64-character hex string
   - **Output Index (vout)**: Output position (0, 1, 2, etc.)
   - **Value**: Amount in satoshis
   - **Script PubKey** (optional): Hex-encoded script
3. Click "Add UTXO"

**Use Cases:**
- Testing transaction building
- Working with UTXOs from custom scripts
- Managing UTXOs from air-gapped transactions

#### Selecting UTXOs

- Click on any UTXO card to select/deselect it
- Selected UTXOs will be highlighted in orange
- Multiple UTXOs can be selected for transactions

#### UTXO Actions

- **View in Explorer**: Click the external link icon
- **Remove**: Click the trash icon (for custom UTXOs)
- **Replace with RBF**: Click the lightning bolt icon (for pending UTXOs)

### Building Transactions

#### Creating a Transaction

1. **Select Input UTXOs**
   - Click on UTXOs in the list to select them
   - Total input value is shown at the top

2. **Add Outputs**
   - Enter recipient Bitcoin address
   - Enter amount in satoshis
   - Click "Add Output" for multiple recipients

3. **Set Fee Rate**
   - Enter fee rate in sat/vB
   - Recommended: 5-20 sat/vB for testnet, check mempool.space for mainnet

4. **Enable RBF (optional)**
   - Check "Enable RBF" to allow fee replacement later
   - Recommended for all transactions

5. **Build Transaction**
   - Click "Build Transaction"
   - Review the transaction details
   - Check that fee is reasonable

6. **Sign and Broadcast**
   - Click "Sign & Broadcast"
   - Approve the transaction in your wallet
   - Transaction will be broadcast to the network

#### Transaction Validation

The tool automatically validates:
- Address format (mainnet/testnet)
- Sufficient funds (inputs >= outputs + fees)
- Output amounts (above dust limit)
- Fee reasonableness

### Replace-By-Fee (RBF)

If you have a pending transaction stuck in the mempool, you can replace it with a higher fee:

#### Steps:

1. **Identify Pending UTXO**
   - Look for UTXOs marked as "Pending" (yellow badge)
   - These are unconfirmed transactions

2. **Open RBF Modal**
   - Click the lightning bolt icon on the pending UTXO
   - The RBF modal will open

3. **Review Current Transaction**
   - Current fee and fee rate are displayed
   - Transaction size and status shown

4. **Set New Fee Rate**
   - Enter a higher fee rate (must be higher than current)
   - Or click "Use Recommended" for fastest confirmation
   - New fee and increase are calculated automatically

5. **Replace Transaction**
   - Click "Replace Transaction"
   - Confirm the action
   - Sign in your wallet
   - New transaction is broadcast

#### RBF Requirements

- Original transaction must signal RBF (sequence < 0xfffffffe)
- New fee rate must be higher than original
- New transaction uses the same inputs

## Best Practices

### Security

1. **Never share your private keys**
   - This tool never asks for private keys
   - All signing happens in your wallet extension

2. **Start with Testnet**
   - Test all features on testnet4 first
   - Get testnet coins from faucets

3. **Verify Addresses**
   - Double-check recipient addresses
   - Use address validation features

4. **Check Fees**
   - Review fee before signing
   - Compare with current mempool rates

### Transaction Management

1. **Use RBF for Important Transactions**
   - Enable RBF to allow fee bumps
   - Useful when fees are volatile

2. **Consolidate UTXOs**
   - Combine small UTXOs when fees are low
   - Reduces future transaction costs

3. **Monitor Confirmations**
   - Use the explorer link to track transactions
   - Wait for 1-6 confirmations depending on value

### Network Usage

1. **Testnet4 for Development**
   - Safe testing environment
   - Free testnet coins from faucets

2. **Mainnet for Production**
   - Only use with real Bitcoin
   - Double-check all transaction details
   - Start with small amounts

## Troubleshooting

### Wallet Won't Connect

- Ensure wallet extension is installed
- Try refreshing the page
- Check wallet is unlocked
- Verify network matches (mainnet/testnet)

### UTXOs Not Loading

- Check internet connection
- Verify wallet address is correct
- Try clicking the refresh button
- Check mempool.space API status

### Transaction Build Fails

- Ensure sufficient funds (inputs > outputs + fee)
- Verify all addresses are valid for current network
- Check output amounts are above dust limit (546 sats)
- Try reducing output amounts or increasing inputs

### RBF Not Working

- Verify original transaction signals RBF
- Ensure transaction is still unconfirmed
- New fee rate must be higher than original
- Check you're on the correct network

## Advanced Features

### Custom UTXO Management

Add UTXOs from:
- Partially signed transactions (PSBTs)
- Multi-signature wallets
- Custom Bitcoin scripts
- Air-gapped transactions

### Transaction Analysis

Before signing, review:
- Total input value
- Total output value
- Transaction fee
- Fee rate (sat/vB)
- Number of inputs/outputs
- Estimated confirmation time

### Network Switching

Switch networks for:
- Testing on testnet4
- Development and debugging
- Production on mainnet
- Different Bitcoin networks

## Support

### Get Testnet Coins

- [Mempool.space Testnet4 Faucet](https://mempool.space/testnet4/faucet)

### Resources

- [Bitcoin Developer Docs](https://developer.bitcoin.org)
- [BIP 125 (RBF Specification)](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki)
- [Mempool.space](https://mempool.space)

### Need Help?

- Check the implementation plan: `/plans/20251208182500_bitcoin_utxo_tool_plan.md`
- Review session files: `/.claude_sessions/`
- Open an issue on GitHub

---

**Remember**: Always test on testnet4 first. This tool provides powerful Bitcoin transaction capabilities - use responsibly!
