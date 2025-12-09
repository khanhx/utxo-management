# Bitcoin UTXO Management Tool - User Guide

Welcome to the Bitcoin UTXO Management Tool! This comprehensive guide will help you understand and use all features of the application.

## Table of Contents

1. [Introduction](#introduction)
2. [Features Overview](#features-overview)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Getting Started](#getting-started)
6. [Wallet Connection](#wallet-connection)
7. [UTXO Management](#utxo-management)
8. [Building Transactions](#building-transactions)
9. [Replace-By-Fee (RBF)](#replace-by-fee-rbf)
10. [Network Switching](#network-switching)
11. [Troubleshooting](#troubleshooting)
12. [FAQ](#faq)

---

## Introduction

The Bitcoin UTXO Management Tool is a web-based application that gives you fine-grained control over your Bitcoin unspent transaction outputs (UTXOs). Unlike most Bitcoin wallets that abstract away UTXO management, this tool lets you see, select, and control exactly which UTXOs you use in transactions.

**Key Benefits:**
- Precise control over UTXO selection for privacy
- Replace-By-Fee (RBF) support for speeding up pending transactions
- Multi-wallet compatibility
- Network switching between mainnet and testnet4
- Advanced transaction building capabilities

**Security First:**
All private key operations happen in your wallet extension. This application never handles or stores private keys, ensuring your Bitcoin remains secure.

---

## Features Overview

### Multi-Wallet Support
Connect with any of these Bitcoin wallet extensions:
- **Unisat Wallet** - Popular Bitcoin wallet with Ordinals support
- **Phantom Wallet** - Multi-chain wallet with Bitcoin support
- **OKX Wallet** - Exchange-backed wallet with Bitcoin functionality
- **MetaMask** - Requires Bitcoin Snaps for Bitcoin support
- **Bitget Wallet** - Multi-chain wallet with Bitcoin support

### UTXO Management
- View all UTXOs for your connected address
- See confirmation status (confirmed vs pending)
- Add custom UTXOs manually
- Select specific UTXOs for transactions
- Filter and sort your UTXO list

### Transaction Building
- Build custom Bitcoin transactions
- Select specific UTXOs as inputs
- Add multiple outputs
- Choose from recommended fee rates
- Preview transactions before signing
- Verify transaction details

### Replace-By-Fee (RBF)
- Speed up pending transactions
- Increase fees on unconfirmed transactions
- BIP 125 compliant implementation
- Automatic fee calculation
- Output adjustment for fee bumps

### Network Switching
- Seamless mainnet/testnet4 switching
- Test features safely on testnet4
- Network-aware address validation
- Separate UTXO tracking per network

---

## Prerequisites

Before using the UTXO Management Tool, ensure you have:

1. **A Modern Web Browser**
   - Chrome, Brave, Firefox, or Edge
   - JavaScript enabled
   - Browser extensions supported

2. **Bitcoin Wallet Extension**
   Install at least one supported wallet:
   - [Unisat Wallet](https://unisat.io)
   - [Phantom Wallet](https://phantom.app)
   - [OKX Wallet](https://www.okx.com/web3)
   - [MetaMask](https://metamask.io) + Bitcoin Snaps
   - [Bitget Wallet](https://web3.bitget.com)

3. **Bitcoin for Testing (Testnet4)**
   - Get free testnet Bitcoin from [Testnet4 Faucet](https://mempool.space/testnet4/faucet)
   - Configure your wallet for testnet4 network
   - See [TESTNET4_GUIDE.md](./TESTNET4_GUIDE.md) for detailed setup

4. **Basic Bitcoin Knowledge**
   - Understanding of UTXOs
   - Transaction basics (inputs, outputs, fees)
   - Address types (P2PKH, P2WPKH, Bech32)

---

## Installation

### Option 1: Use Hosted Version
Visit the deployed application at: [Coming Soon]

### Option 2: Run Locally

```bash
# Clone the repository
git clone <repository-url>
cd utxo-management

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Getting Started

### Step 1: Open the Application
Navigate to the application URL in your web browser.

### Step 2: Switch to Testnet4 (Recommended for First-Time Users)
1. Look for the network switcher in the top-right corner
2. Click on "Mainnet" to open the dropdown
3. Select "Testnet4"
4. The page will reload with testnet4 configuration

**Why start with testnet4?**
- Free testnet Bitcoin available
- No risk to real funds
- Test all features safely
- Learn how everything works

### Step 3: Connect Your Wallet
1. Click "Connect Wallet" button in the navbar
2. Select your wallet from the modal
3. Approve the connection in your wallet extension
4. Your address will appear in the navbar

### Step 4: Load Your UTXOs
Once connected, the application automatically fetches your UTXOs from the blockchain via the Mempool.space API.

---

## Wallet Connection

### Connecting a Wallet

#### Unisat Wallet
1. Ensure Unisat extension is installed and unlocked
2. Click "Connect Wallet"
3. Select "Unisat"
4. Approve the connection request in Unisat popup
5. Your active Unisat address will be connected

**Testnet4 Setup:**
- Open Unisat extension
- Go to Settings
- Switch network to "Testnet" or "Bitcoin Testnet4"
- Reconnect in the UTXO tool

#### Phantom Wallet
1. Install Phantom extension
2. Create or import a Bitcoin address
3. Click "Connect Wallet" in UTXO tool
4. Select "Phantom"
5. Approve connection in Phantom popup

#### OKX Wallet
1. Install OKX Wallet extension
2. Ensure Bitcoin is enabled in wallet settings
3. Click "Connect Wallet"
4. Select "OKX Wallet"
5. Approve the connection

#### MetaMask (Bitcoin Snaps)
**Note:** MetaMask Bitcoin support requires Snaps. This feature may have limited functionality.

1. Install MetaMask extension
2. Ensure Snaps are enabled
3. Install Bitcoin Snaps if prompted
4. Connect via "MetaMask" option

#### Bitget Wallet
1. Install Bitget Wallet extension
2. Enable Bitcoin in wallet settings
3. Click "Connect Wallet"
4. Select "Bitget Wallet"
5. Approve the connection

### Disconnecting a Wallet
1. Click on your address in the navbar
2. Select "Disconnect"
3. Your wallet will be disconnected
4. UTXOs and state will be cleared

### Switching Accounts
If you switch accounts in your wallet extension:
- The application will automatically detect the change
- UTXOs will refresh for the new address
- Any pending transaction will be cleared

### Switching Networks
If you switch networks (mainnet/testnet) in your wallet:
- Switch the network in the UTXO tool first
- Then switch in your wallet extension
- Reconnect your wallet
- UTXOs will load for the new network

---

## UTXO Management

### Viewing Your UTXOs

After connecting your wallet, the UTXO list displays all unspent outputs:

**UTXO Card Information:**
- **Transaction ID (TXID)**: Unique identifier for the transaction
- **Output Index (vout)**: Position in the transaction outputs (0, 1, 2, etc.)
- **Amount**: Value in satoshis and BTC
- **Status**: Confirmed (with confirmations) or Pending
- **Address**: Receiving address (if available)

**Status Indicators:**
- Green checkmark: Confirmed (6+ confirmations)
- Yellow clock: Pending (0-5 confirmations)
- Gray: Unconfirmed in mempool

### Adding Custom UTXOs

Sometimes you may want to manually add a UTXO:

1. Click "Add Custom UTXO" button
2. Enter the following information:
   - **Transaction ID**: 64-character hex string
   - **Output Index**: Number (usually 0, 1, 2, etc.)
   - **Amount**: Value in satoshis
   - **Address** (optional): Receiving address
3. Click "Add UTXO"

**When to Add Custom UTXOs:**
- Testing with specific UTXOs
- After creating a transaction that's not yet in the mempool
- Working with UTXOs from a different source

**Validation:**
- Transaction ID must be 64 hex characters
- Output index must be a non-negative integer
- Amount must be positive (in satoshis)

### Selecting UTXOs

To use UTXOs in a transaction:

1. Browse your UTXO list
2. Click the checkbox next to each UTXO you want to use
3. Selected UTXOs show a blue highlight
4. Total input amount displays at the bottom
5. Use "Clear Selection" to deselect all

**Selection Tips:**
- Select UTXOs with enough confirmations (6+ recommended)
- Consider fee impact of multiple small UTXOs
- Use coin control for better privacy

### Filtering and Sorting

**Filter Options:**
- **Confirmed Only**: Hide pending UTXOs
- **Minimum Amount**: Filter by satoshi value
- **Address**: Filter by receiving address

**Sort Options:**
- **Amount**: Descending (largest first) or ascending
- **Confirmations**: Most confirmed first
- **Recent**: Newest transactions first

### Refreshing UTXOs

To manually refresh your UTXO list:
1. Click the refresh icon next to "My UTXOs"
2. Application fetches latest data from blockchain
3. New UTXOs appear
4. Spent UTXOs are removed

**Auto-Refresh:**
The application automatically refreshes UTXOs every 30 seconds when the page is active.

---

## Building Transactions

### Creating a Simple Transaction

**Note:** The current implementation uses placeholder transaction building logic. Full @scure/btc-signer integration is planned for production.

1. **Select Input UTXOs**
   - Navigate to UTXO list
   - Select one or more UTXOs to spend
   - Verify total input amount is sufficient

2. **Click "Build Transaction"**
   - Opens the transaction builder interface
   - Selected UTXOs appear as inputs

3. **Add Output(s)**
   - Click "Add Output"
   - Enter recipient address
   - Enter amount in satoshis or BTC
   - Add multiple outputs if needed

4. **Choose Fee Rate**
   - Select from recommended fee rates:
     - **Fastest**: Next block (~10 minutes)
     - **Fast**: Within 30 minutes
     - **Medium**: Within 1 hour
     - **Economy**: Low priority
   - Or enter custom fee rate (sat/vB)

5. **Enable RBF (Optional)**
   - Toggle "Enable Replace-By-Fee"
   - Allows replacing transaction if unconfirmed
   - Recommended for non-urgent transactions

6. **Preview Transaction**
   - Review all transaction details:
     - Input UTXOs and total
     - Output addresses and amounts
     - Fee amount and rate
     - Transaction size (vBytes)
   - Verify everything is correct

7. **Sign Transaction**
   - Click "Sign Transaction"
   - Wallet extension prompts for approval
   - Review transaction in wallet carefully
   - Approve to sign

8. **Broadcast Transaction**
   - Signed transaction ready to broadcast
   - Click "Broadcast to Network"
   - Transaction sent to Bitcoin network
   - TXID displayed on success
   - View on block explorer

### Transaction Building Tips

**Calculate Proper Fees:**
- Higher fee rate = faster confirmation
- Fee = (transaction size in vBytes) × (fee rate in sat/vB)
- Typical P2WPKH transaction: ~140 vBytes
- Multiple inputs increase size significantly

**Avoid Dust Outputs:**
- Minimum output: 546 satoshis
- Smaller outputs may be uneconomical
- Application warns about dust

**Double Check Addresses:**
- Bitcoin transactions are irreversible
- Verify recipient address carefully
- Use testnet4 for testing first

**Consider Privacy:**
- Using multiple UTXOs may link addresses
- Consider coin control for better privacy
- Separate change output preserves anonymity

### Change Outputs

When you spend UTXOs, any amount not sent to outputs or fees goes to a change address:

**How Change Works:**
```
Input: 100,000 sats
Output 1: 60,000 sats (to recipient)
Fee: 5,000 sats
Change: 35,000 sats (back to you)
```

The transaction builder automatically:
- Calculates required change amount
- Creates change output to your address
- Ensures change is above dust limit (546 sats)
- Warns if change is uneconomical

### Transaction Limits

**Size Limits:**
- Standard transaction: < 100 KB
- Large transactions may not relay
- More inputs/outputs = larger size

**Value Limits:**
- Minimum output: 546 satoshis (dust limit)
- Maximum: Limited by UTXO availability
- Consider fee impact on small transactions

---

## Replace-By-Fee (RBF)

### What is RBF?

Replace-By-Fee (RBF) allows you to replace an unconfirmed transaction with a new version that pays a higher fee. This is useful when:
- Your transaction is taking too long to confirm
- You initially set the fee too low
- Network congestion increased after broadcasting
- You need faster confirmation

**BIP 125 Standard:**
This tool implements RBF according to BIP 125 Bitcoin Improvement Proposal.

### Detecting RBF Transactions

Transactions that support RBF are marked with:
- "RBF Enabled" badge
- Green indicator in transaction list
- "Replace Transaction" button available

**Technical Detail:**
RBF transactions have at least one input with sequence number < 0xfffffffe (4294967294).

### Replacing a Transaction

1. **Find Pending Transaction**
   - Look in "Recent Transactions" section
   - Or check "Pending" filter in UTXO list
   - Only unconfirmed transactions can be replaced

2. **Click "Replace Transaction"**
   - Opens RBF modal
   - Shows original transaction details
   - Displays current fee information

3. **Choose New Fee Rate**
   - Application suggests minimum fee increase
   - Select from recommended fee bumps:
     - +50%: Modest increase
     - +100%: Double fee
     - +200%: Aggressive bump
   - Or enter custom fee rate

4. **Review Fee Increase**
   - Original fee displayed
   - New fee calculated
   - Fee increase shown
   - Output adjustment preview (if needed)

5. **Preview Replacement**
   - Same inputs as original
   - Possibly adjusted outputs
   - Higher fee paid
   - Verify details carefully

6. **Sign and Broadcast**
   - Click "Replace Transaction"
   - Wallet prompts for signature
   - Approve replacement
   - New transaction broadcast
   - Original transaction replaced in mempool

### RBF Requirements

**Minimum Fee Increase:**
- New fee must be higher than original
- Must pay for its own relay cost (~1 sat/vB minimum increase)
- Application enforces BIP 125 rules

**Output Adjustment:**
When fee increases, the change output is reduced:
```
Original:
  Input: 100,000 sats
  Output 1: 60,000 sats
  Output 2 (change): 35,000 sats
  Fee: 5,000 sats

Replacement (2x fee):
  Input: 100,000 sats (same)
  Output 1: 60,000 sats (same)
  Output 2 (change): 30,000 sats (reduced)
  Fee: 10,000 sats (increased)
```

**Limitations:**
- Can only replace unconfirmed transactions
- Once confirmed, RBF is not possible
- Change output must cover fee increase
- Cannot replace if change < fee increase

### RBF Best Practices

**When to Use RBF:**
- Transaction pending for hours
- Network fees increased since broadcast
- Need confirmation urgently
- Initially used economy fee

**Fee Bump Strategy:**
- Start with modest increase (50%)
- Monitor for confirmation
- Bump again if needed
- Avoid excessive fees

**Monitoring Replacements:**
- Check transaction status after 10-20 minutes
- Use block explorer to track
- May need multiple replacements
- Consider market fee rates

---

## Network Switching

### Understanding Networks

**Bitcoin Mainnet:**
- Real Bitcoin (BTC)
- Real monetary value
- Irreversible transactions
- Production environment
- Use with caution

**Bitcoin Testnet4:**
- Test Bitcoin (no value)
- Free from faucets
- Safe for experiments
- Reset periodically
- Perfect for learning

### Switching Networks

**In the Application:**
1. Click network indicator (top-right)
2. Select "Mainnet" or "Testnet4"
3. Page reloads with new network config
4. API endpoints update automatically
5. Reconnect your wallet

**In Your Wallet Extension:**
1. Open wallet settings
2. Find network selection
3. Choose matching network (mainnet/testnet)
4. Reconnect to UTXO tool

**Important:**
Always ensure your wallet and the UTXO tool are on the same network!

### Network-Specific Features

**Address Validation:**
- Mainnet addresses: 1, 3, bc1
- Testnet4 addresses: m, n, 2, tb1
- Application validates address format per network
- Prevents sending testnet coins to mainnet addresses

**API Endpoints:**
- Mainnet: mempool.space/api
- Testnet4: mempool.space/testnet4/api
- Automatic switching when network changes

**UTXO Separation:**
- UTXOs tracked separately per network
- Switching networks clears UTXO list
- Reconnect wallet to load network-specific UTXOs

### First-Time Users

**Recommended Workflow:**
1. Start with testnet4
2. Get free testnet Bitcoin
3. Practice all features
4. Build confidence
5. Switch to mainnet when ready

**Testnet4 Resources:**
- [Testnet4 Faucet](https://mempool.space/testnet4/faucet)
- [Testnet4 Block Explorer](https://mempool.space/testnet4)
- See [TESTNET4_GUIDE.md](./TESTNET4_GUIDE.md)

---

## Troubleshooting

### Wallet Connection Issues

**Problem: Wallet Not Detected**
- **Solution**: Ensure wallet extension is installed and enabled
- Refresh browser page
- Check browser extension permissions
- Try different browser

**Problem: Connection Rejected**
- **Solution**: User may have declined in wallet
- Click "Connect Wallet" again
- Approve connection in wallet popup
- Check wallet is unlocked

**Problem: Wrong Network**
- **Solution**: Wallet and app on different networks
- Switch network in UTXO tool first
- Then switch in wallet extension
- Reconnect wallet

**Problem: Address Not Showing**
- **Solution**: Wallet connected but address missing
- Disconnect and reconnect
- Check wallet has Bitcoin addresses
- Some wallets need Bitcoin explicitly enabled

### UTXO Loading Issues

**Problem: UTXOs Not Loading**
- **Solution**: API connection issue
- Check internet connection
- Refresh page
- Wait a moment and try again
- Mempool.space may be experiencing issues

**Problem: UTXOs Showing as Pending Forever**
- **Solution**: Transaction not confirmed yet
- Check transaction on block explorer
- May need to wait for confirmations
- Consider RBF if stuck

**Problem: UTXO Missing**
- **Solution**: Recently spent or not confirmed
- Check if UTXO was spent in another wallet
- Confirm transaction is confirmed
- Refresh UTXO list

### Transaction Building Issues

**Problem: "Insufficient Funds" Error**
- **Solution**: Selected UTXOs < (outputs + fee)
- Select additional UTXOs
- Reduce output amounts
- Lower fee rate if appropriate

**Problem: "Output Below Dust Limit"**
- **Solution**: Output < 546 satoshis
- Increase output amount
- Remove very small outputs
- Dust outputs not economical

**Problem: "Invalid Address" Error**
- **Solution**: Address format incorrect
- Check address network (mainnet vs testnet)
- Verify address copied completely
- Remove extra spaces

**Problem: Transaction Won't Sign**
- **Solution**: Wallet not responding
- Check wallet is unlocked
- Ensure wallet supports signing
- Try refreshing page

### RBF Issues

**Problem: "Transaction Not RBF Enabled"**
- **Solution**: Original transaction didn't signal RBF
- Cannot replace non-RBF transactions
- Wait for confirmation or CPFP (Child-Pays-For-Parent)

**Problem: "Insufficient Change for Fee Increase"**
- **Solution**: Change output too small
- Cannot increase fee further
- Original transaction may need to confirm
- Consider CPFP alternative

**Problem: Replacement Not Confirming**
- **Solution**: Fee increase insufficient
- Replace again with higher fee
- Check current network fee rates
- May need significant bump

### Network Issues

**Problem: API Rate Limiting**
- **Solution**: Too many requests to Mempool.space
- Wait a few minutes
- Reduce refresh frequency
- Contact support if persistent

**Problem: Transaction Broadcast Failed**
- **Solution**: Network rejected transaction
- Check transaction validity
- Verify fee is adequate
- Check for double-spend issues

**Problem: Slow Performance**
- **Solution**: Network congestion or browser issue
- Try different browser
- Clear browser cache
- Check system resources

---

## FAQ

### General Questions

**Q: Is this tool safe to use?**
A: Yes. All private key operations happen in your wallet extension. This application never handles or stores private keys. Always verify transactions in your wallet before approving.

**Q: Is there a fee to use this tool?**
A: No. The tool is free to use. You only pay Bitcoin network transaction fees.

**Q: Can I use this on mobile?**
A: The interface is responsive, but wallet extension support varies by mobile browser. Desktop browsers provide the best experience.

**Q: Do I need to create an account?**
A: No. Simply connect your wallet extension. No registration or account required.

### UTXO Questions

**Q: What is a UTXO?**
A: UTXO stands for Unspent Transaction Output. It's a piece of Bitcoin you can spend. Think of it like a bill in your physical wallet.

**Q: Why would I want to manage UTXOs?**
A: UTXO management provides:
- Better privacy through coin control
- Fee optimization (avoid many small UTXOs)
- Precise control over which coins to spend
- UTXO consolidation strategies

**Q: Can I delete a UTXO?**
A: You can't delete a UTXO from the blockchain, but you can remove custom UTXOs you added manually. Blockchain UTXOs remain until spent.

**Q: Why do some UTXOs show as pending?**
A: Pending means the transaction creating that UTXO is unconfirmed. Wait for confirmations before spending.

### Transaction Questions

**Q: How long does a transaction take?**
A: Depends on fee rate:
- High fee: 10-30 minutes (next block)
- Medium fee: 1-3 hours
- Low fee: Several hours to days

**Q: What happens if I set the fee too low?**
A: Transaction may take a long time to confirm. Use RBF to increase the fee if the transaction is RBF-enabled.

**Q: Can I cancel a Bitcoin transaction?**
A: No direct cancellation, but if RBF-enabled and unconfirmed, you can replace it (potentially sending funds back to yourself with higher fee).

**Q: What is the dust limit?**
A: 546 satoshis. Outputs below this are considered "dust" and may not relay or are uneconomical due to fees.

**Q: Why is transaction size important?**
A: Transaction size (in vBytes) × fee rate = total fee. Larger transactions (more inputs/outputs) cost more.

### RBF Questions

**Q: What is RBF?**
A: Replace-By-Fee allows replacing an unconfirmed transaction with a higher-fee version to speed up confirmation.

**Q: Do all transactions support RBF?**
A: Only if enabled when creating the transaction (sequence number < 0xfffffffe). This tool enables RBF by default.

**Q: How much should I increase the fee?**
A: Minimum: BIP 125 rules (~1 sat/vB increase). Recommended: 50-100% increase for meaningful speed up.

**Q: Can I RBF multiple times?**
A: Yes, you can replace a replacement transaction as long as it remains unconfirmed.

**Q: What happens to the old transaction?**
A: Miners and nodes drop the old transaction from mempools when they receive the replacement.

### Network Questions

**Q: Should I use mainnet or testnet4?**
A: Start with testnet4 to learn. Use mainnet only when comfortable and with small amounts initially.

**Q: Where can I get testnet Bitcoin?**
A: Use testnet4 faucets:
- [Mempool.space Testnet4 Faucet](https://mempool.space/testnet4/faucet)
- Other community faucets

**Q: Does testnet Bitcoin have value?**
A: No. Testnet Bitcoin has no monetary value and is for testing only.

**Q: Can I send testnet coins to mainnet?**
A: No. Different networks with different address formats. Application validates addresses per network.

### Technical Questions

**Q: What wallet extensions are supported?**
A: Unisat, Phantom, OKX, MetaMask (with Bitcoin Snaps), and Bitget. See [WALLET_INTEGRATION.md](./WALLET_INTEGRATION.md) for details.

**Q: What Bitcoin address types are supported?**
A: P2PKH (1...), P2SH (3...), P2WPKH (bc1...), and testnet equivalents. Taproot (P2TR) planned for future.

**Q: Where does the application get blockchain data?**
A: From Mempool.space public API. No blockchain node required.

**Q: Is the code open source?**
A: [Information about license and repository]

**Q: Can I run this locally?**
A: Yes. See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for setup instructions.

---

## Getting Help

### Support Resources

- **Documentation**: [Full docs](./README.md)
- **Technical Guide**: [Bitcoin Technical Details](./BITCOIN_TECHNICAL.md)
- **Developer Guide**: [For developers](./DEVELOPER_GUIDE.md)
- **GitHub Issues**: [Report bugs or request features]
- **Community**: [Discord/Telegram/Forum links]

### Reporting Issues

When reporting issues, include:
1. Browser and version
2. Wallet extension and version
3. Network (mainnet/testnet4)
4. Steps to reproduce
5. Screenshots if applicable
6. Console errors (F12 Developer Tools)

### Feature Requests

Have an idea? We'd love to hear it!
- Open a GitHub issue
- Describe the feature
- Explain the use case
- Vote on existing requests

---

## Security Best Practices

1. **Always verify transactions** in your wallet before signing
2. **Start with testnet4** to learn safely
3. **Use small amounts** on mainnet initially
4. **Double-check addresses** before sending
5. **Keep wallet extensions updated**
6. **Never share private keys or seed phrases**
7. **Use hardware wallets** for large amounts
8. **Verify application URL** to avoid phishing

---

## Next Steps

Now that you understand the basics:

1. **Practice on Testnet4**
   - Get free testnet coins
   - Build some transactions
   - Try RBF functionality
   - Experiment with UTXO selection

2. **Learn More**
   - Read [BITCOIN_TECHNICAL.md](./BITCOIN_TECHNICAL.md) for deeper understanding
   - Study [transaction examples](./BITCOIN_TECHNICAL.md#transaction-examples)
   - Explore Bitcoin privacy techniques

3. **Advanced Usage**
   - UTXO consolidation strategies
   - Privacy-preserving coin control
   - Batch transactions
   - Optimal fee strategies

4. **Stay Updated**
   - Check [ROADMAP.md](./ROADMAP.md) for upcoming features
   - Follow development progress
   - Join community discussions

---

**Happy Bitcoin UTXO Management!**

For more information, see:
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Bitcoin Technical Details](./BITCOIN_TECHNICAL.md)
- [Wallet Integration Guide](./WALLET_INTEGRATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
