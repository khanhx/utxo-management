# Testnet4 Guide

Complete guide for testing the Bitcoin UTXO Management Tool on testnet4.

## What is Testnet4?

**Bitcoin Testnet4** is a testing network for Bitcoin:
- Test Bitcoin has no monetary value
- Free to obtain from faucets
- Safe environment for learning
- Reset occasionally (fresh start from testnet3)
- Same technical features as mainnet

**Why Testnet4?**
- Learn without risking real Bitcoin
- Test all features safely
- Practice wallet operations
- Develop and debug applications

---

## Getting Started

### Step 1: Configure Wallet for Testnet4

#### Unisat Wallet

1. Open Unisat extension
2. Click Settings (⚙️)
3. Select "Network"
4. Choose "Testnet" or "Bitcoin Testnet4"
5. Wallet switches to testnet4
6. Note your testnet4 address (starts with `tb1` or `m` or `n`)

#### Phantom Wallet

1. Open Phantom extension
2. Navigate to settings
3. Select Bitcoin network settings
4. Switch to testnet
5. View your testnet4 Bitcoin address

#### OKX Wallet

1. Open OKX Wallet
2. Go to settings
3. Find network selector
4. Choose Bitcoin Testnet
5. Get your testnet4 address

### Step 2: Get Testnet4 Bitcoin

#### Mempool.space Faucet (Recommended)

1. Visit [mempool.space/testnet4/faucet](https://mempool.space/testnet4/faucet)
2. Enter your testnet4 address
3. Complete CAPTCHA
4. Receive 0.001 - 0.01 tBTC
5. Wait for confirmation (~10 minutes)

#### Alternative Faucets

- [bitcoinfaucet.uo1.net/send.php](https://bitcoinfaucet.uo1.net/send.php)
- Community faucets (search "bitcoin testnet4 faucet")

**Faucet Limits**:
- Usually once per day per address
- Limited amount per request
- Be considerate (don't drain faucets)

### Step 3: Connect to UTXO Tool

1. Open UTXO Management Tool
2. Switch network to "Testnet4" (top-right)
3. Click "Connect Wallet"
4. Select your wallet
5. Approve connection
6. Your testnet4 address appears
7. UTXOs automatically load

---

## Testing Scenarios

### Basic UTXO Management

**View UTXOs**:
1. After receiving testnet4 coins
2. Wait for 1 confirmation
3. UTXO appears in list
4. Check amount and confirmations

**Add Custom UTXO**:
1. Click "Add Custom UTXO"
2. Enter test transaction details
3. Add to list
4. Verify appears correctly

**Select UTXOs**:
1. Click checkboxes to select
2. View total selected amount
3. Clear selection
4. Select different combination

### Transaction Building

**Simple Transaction**:
1. Select 1 UTXO (with enough balance)
2. Click "Build Transaction"
3. Add output:
   - Address: Another testnet4 address
   - Amount: 10,000 sats
4. Choose fee rate (use "Economy")
5. Preview transaction
6. Verify all details correct

**Multi-Output Transaction**:
1. Select UTXO
2. Add multiple outputs
3. Different amounts to each
4. Ensure inputs > outputs + fee
5. Build and review

**Test Fee Rates**:
- Try "Fastest" fee
- Try "Economy" fee
- Try custom fee rate
- Compare transaction times

### Transaction Signing and Broadcasting

**Sign Transaction**:
1. Build transaction
2. Click "Sign Transaction"
3. Wallet popup appears
4. **Review carefully**:
   - Recipient address
   - Amount (in BTC and sats)
   - Fee
   - Network (testnet!)
5. Approve
6. Transaction signed

**Broadcast Transaction**:
1. After signing
2. Click "Broadcast to Network"
3. Transaction sent
4. TXID displayed
5. View on block explorer

**Monitor Transaction**:
1. Copy TXID
2. Paste in [mempool.space/testnet4](https://mempool.space/testnet4)
3. Watch for confirmations
4. Usually confirms in 10-60 minutes

### Replace-By-Fee (RBF) Testing

**Create RBF Transaction**:
1. Build transaction with "Enable RBF" checked
2. Use low fee rate (Economy)
3. Sign and broadcast
4. Transaction remains unconfirmed (by design)

**Replace with Higher Fee**:
1. Find pending transaction
2. Click "Replace Transaction"
3. Choose higher fee rate
4. Review fee increase
5. Sign replacement
6. Broadcast
7. Monitor for faster confirmation

**Test Multiple Replacements**:
1. Start with very low fee
2. Replace once with modest increase
3. Replace again with higher fee
4. Watch which confirms

---

## Test Cases

### Comprehensive Testing Checklist

#### Wallet Operations
- [ ] Connect Unisat wallet
- [ ] Connect Phantom wallet
- [ ] Connect OKX wallet
- [ ] Switch wallets
- [ ] Disconnect and reconnect
- [ ] Switch accounts in wallet

#### UTXO Management
- [ ] View UTXOs after receiving
- [ ] Refresh UTXO list
- [ ] Add custom UTXO
- [ ] Select single UTXO
- [ ] Select multiple UTXOs
- [ ] Clear selection
- [ ] Filter UTXOs

#### Transaction Building
- [ ] Build 1-input, 1-output transaction
- [ ] Build multi-input transaction
- [ ] Build multi-output transaction
- [ ] Test different fee rates
- [ ] Enable/disable RBF
- [ ] Preview transaction details
- [ ] Cancel transaction build

#### Signing and Broadcasting
- [ ] Sign transaction in wallet
- [ ] Reject signing (test cancel)
- [ ] Broadcast signed transaction
- [ ] Monitor transaction status
- [ ] View on block explorer

#### RBF Testing
- [ ] Create RBF-enabled transaction
- [ ] Replace with higher fee
- [ ] Replace multiple times
- [ ] Try replacing confirmed tx (should fail)
- [ ] Try replacing non-RBF tx (should fail)

#### Network Switching
- [ ] Switch from mainnet to testnet4
- [ ] Switch from testnet4 to mainnet
- [ ] Verify API endpoints update
- [ ] Reconnect wallet after switch
- [ ] Verify address validation changes

#### Error Handling
- [ ] Insufficient funds error
- [ ] Invalid address error
- [ ] Dust output error
- [ ] Network mismatch error
- [ ] Wallet rejection
- [ ] API timeout handling

---

## Common Testing Issues

### No Testnet4 Coins

**Problem**: Can't get testnet4 Bitcoin
**Solutions**:
- Try different faucets
- Wait for daily limit reset
- Ask in Bitcoin communities
- Mine testnet4 blocks (advanced)

### Transaction Not Confirming

**Problem**: Transaction stuck for hours
**Solutions**:
- Check fee rate (may be too low)
- Use RBF to increase fee
- Wait longer (testnet4 variable block times)
- Check mempool.space for network status

### Wrong Network

**Problem**: Wallet and app on different networks
**Solutions**:
- Switch app network first
- Then switch wallet network
- Ensure addresses match format (tb1 vs bc1)
- Reconnect wallet

### Faucet Not Working

**Problem**: Faucet doesn't send coins
**Solutions**:
- Try different faucet
- Check address is correct testnet4 format
- Wait a few minutes
- Check transaction on explorer

---

## Best Practices for Testing

### 1. Document Everything

- Note what you tested
- Record any issues found
- Screenshot errors
- Keep test transaction IDs

### 2. Test Edge Cases

- Very small amounts (near dust limit)
- Very large amounts (multiple UTXOs)
- High fee rates
- Low fee rates
- Many outputs

### 3. Test Error Scenarios

- Insufficient funds
- Invalid addresses
- Network mismatches
- Wallet rejections
- API failures

### 4. Vary Testing Conditions

- Different browsers
- Different wallets
- Different devices
- Different times of day

### 5. Monitor Resources

- Check console for errors (F12)
- Monitor network requests
- Watch memory usage
- Note performance issues

---

## After Testing

### Before Using Mainnet

Ensure you can successfully:
- [ ] Connect wallet
- [ ] View UTXOs
- [ ] Build transaction
- [ ] Sign transaction
- [ ] Broadcast transaction
- [ ] Monitor confirmations
- [ ] Use RBF if needed

### Start Small on Mainnet

When ready for mainnet:
1. Switch to mainnet
2. Use VERY small amounts first
3. Test with $5-10 worth
4. Verify everything works
5. Gradually increase amounts

### Keep Testing

- Regularly test new features on testnet4
- Test before important mainnet transactions
- Use testnet4 to learn new techniques
- Help others learn with testnet4

---

## Testnet4 Resources

### Faucets

- [Mempool.space Testnet4 Faucet](https://mempool.space/testnet4/faucet)
- [Bitcoin Testnet Faucet](https://bitcoinfaucet.uo1.net/send.php)
- Search for more community faucets

### Block Explorers

- [Mempool.space Testnet4](https://mempool.space/testnet4)
- [Blockstream Testnet Explorer](https://blockstream.info/testnet/)

### Technical Info

- [Bitcoin Testnet4 Wiki](https://en.bitcoin.it/wiki/Testnet)
- [Testnet4 Announcement](https://github.com/bitcoin/bitcoin/pull/29775)

---

## FAQ

**Q: Will my testnet4 coins work on mainnet?**
A: No. Testnet4 and mainnet are separate networks.

**Q: Do testnet4 coins have value?**
A: No. They have no monetary value.

**Q: Can I lose real money on testnet4?**
A: No. Only test coins are used.

**Q: How often does testnet4 reset?**
A: Rarely. Testnet4 is the newest testnet (2024).

**Q: Why did my testnet4 coins disappear?**
A: If testnet resets (rare), all coins are lost. Keep small amounts.

**Q: Can I mine testnet4?**
A: Yes, difficulty is low enough for CPU mining.

---

For more information:
- [User Guide](./USER_GUIDE.md)
- [Wallet Integration](./WALLET_INTEGRATION.md)
- [Bitcoin Technical Details](./BITCOIN_TECHNICAL.md)
