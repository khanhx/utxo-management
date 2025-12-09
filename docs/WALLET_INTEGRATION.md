# Wallet Integration Guide

Complete guide for integrating and using Bitcoin wallet extensions with the UTXO Management Tool.

## Supported Wallets

1. **Unisat Wallet** - Fully supported
2. **Phantom Wallet** - Fully supported
3. **OKX Wallet** - Fully supported
4. **MetaMask** - Limited (requires Bitcoin Snaps)
5. **Bitget Wallet** - Fully supported

---

## Unisat Wallet

### Installation

1. Visit [unisat.io](https://unisat.io)
2. Click "Download" for your browser
3. Install Chrome/Brave extension
4. Create new wallet or import existing
5. Set password and backup seed phrase

### Testnet4 Setup

1. Open Unisat extension
2. Click Settings (⚙️ icon)
3. Select "Network"
4. Choose "Testnet" or "Bitcoin Testnet4"
5. Confirm network switch

### Connecting to UTXO Tool

1. Navigate to UTXO Management Tool
2. Switch to Testnet4 (recommended for first time)
3. Click "Connect Wallet"
4. Select "Unisat"
5. Approve connection in popup
6. Your address appears in navbar

### Features

- Native Bitcoin support
- PSBT signing
- RBF transactions
- Network switching
- Ordinals/Inscriptions support

### Troubleshooting

**Issue**: Wallet not detected
- **Solution**: Ensure extension installed and enabled
- Refresh page after installation
- Check browser extension permissions

**Issue**: Connection rejected
- **Solution**: Click "Connect Wallet" again
- Ensure wallet is unlocked
- Check correct network selected

---

## Phantom Wallet

### Installation

1. Visit [phantom.app](https://phantom.app)
2. Download for Chrome, Brave, or Firefox
3. Install browser extension
4. Create new wallet or import
5. Secure with password
6. Backup recovery phrase

### Bitcoin Setup

1. Open Phantom extension
2. Ensure Bitcoin is enabled
3. View Bitcoin address in wallet
4. Fund with testnet4 Bitcoin for testing

### Connecting

1. Click "Connect Wallet" in UTXO tool
2. Select "Phantom"
3. Approve connection request
4. Bitcoin address connected

### Features

- Multi-chain support (Bitcoin, Solana, Ethereum)
- Clean user interface
- PSBT signing
- Hardware wallet integration

---

## OKX Wallet

### Installation

1. Visit [okx.com/web3](https://www.okx.com/web3)
2. Download browser extension
3. Install for your browser
4. Create or import wallet
5. Set up security

### Bitcoin Configuration

1. Open OKX Wallet
2. Navigate to Bitcoin
3. Ensure Bitcoin network active
4. Get testnet4 Bitcoin for testing

### Connecting

1. Switch UTXO tool to desired network
2. Click "Connect Wallet"
3. Choose "OKX Wallet"
4. Approve in OKX popup
5. Connected successfully

### Features

- Exchange-backed wallet
- Multi-chain support
- Built-in swap functionality
- NFT support

---

## MetaMask (Limited Support)

### Current Status

MetaMask Bitcoin support requires **Bitcoin Snaps**:
- Still in development
- Limited functionality
- May not support all features

### Installation

1. Install [MetaMask](https://metamask.io)
2. Install Bitcoin Snaps when available
3. Configure Bitcoin in MetaMask

### Limitations

- Requires Snaps for Bitcoin
- May not support PSBT fully
- Recommend using dedicated Bitcoin wallet

### Recommendation

For best experience, use Unisat, Phantom, or OKX for Bitcoin-specific features.

---

## Bitget Wallet

### Installation

1. Visit [web3.bitget.com](https://web3.bitget.com)
2. Download extension
3. Install for your browser
4. Create wallet
5. Secure and backup

### Setup

1. Open Bitget Wallet
2. Enable Bitcoin network
3. Get testnet4 coins for testing

### Connecting

1. Click "Connect Wallet"
2. Select "Bitget Wallet"
3. Approve connection
4. Start using

### Features

- Multi-chain wallet
- Swap functionality
- Staking support
- DeFi integration

---

## Common Wallet Operations

### Switching Accounts

Most wallets allow multiple Bitcoin addresses:

1. Open wallet extension
2. Click account selector
3. Choose different address
4. UTXO tool auto-detects change
5. UTXOs refresh for new address

### Network Switching

To switch between mainnet and testnet:

1. **In UTXO Tool**:
   - Click network switcher (top-right)
   - Select "Mainnet" or "Testnet4"
   - Page reloads

2. **In Wallet**:
   - Open wallet settings
   - Select network
   - Choose matching network
   - Reconnect to UTXO tool

**Important**: Always ensure wallet and app are on same network!

### Signing Transactions

When signing a transaction:

1. Build transaction in UTXO tool
2. Click "Sign Transaction"
3. Wallet popup appears
4. **Review carefully**:
   - Recipient address
   - Amount sending
   - Fee amount
   - Network (mainnet/testnet)
5. Approve if correct
6. Transaction signed and ready to broadcast

### Disconnecting

To disconnect wallet:

1. Click your address in navbar
2. Select "Disconnect"
3. Wallet disconnected
4. UTXOs and state cleared

Or disconnect from wallet extension itself.

---

## Security Best Practices

### Wallet Security

1. **Backup Seed Phrase**:
   - Write on paper (never digital)
   - Store in safe location
   - Never share with anyone
   - Test recovery process

2. **Password Security**:
   - Use strong unique password
   - Enable 2FA if available
   - Don't reuse passwords

3. **Hardware Wallets**:
   - Use for large amounts
   - Connect hardware wallet to software wallet
   - Ultimate security

### Connection Security

1. **Verify URL**: Always check application URL
2. **HTTPS Only**: Ensure secure connection
3. **Review Permissions**: Check what app requests
4. **Disconnect When Done**: Don't stay connected unnecessarily

### Transaction Security

1. **Test First**: Use testnet4 before mainnet
2. **Small Amounts**: Start with small mainnet amounts
3. **Double-Check**: Verify all transaction details
4. **Review in Wallet**: Always check wallet popup carefully

---

## Troubleshooting

### General Issues

**Wallet not connecting**:
- Ensure wallet installed and unlocked
- Refresh page
- Try different wallet
- Check browser console for errors

**Wrong network**:
- Verify app and wallet on same network
- Switch network in app first
- Then switch in wallet
- Reconnect

**Address not showing**:
- Check wallet has Bitcoin address
- Some wallets need Bitcoin enabled
- Try disconnecting and reconnecting

### Wallet-Specific Issues

**Unisat**:
- Ensure latest version installed
- Check network setting in wallet
- Try restarting browser

**Phantom**:
- Verify Bitcoin enabled in Phantom
- Check multi-chain settings
- Update to latest version

**OKX**:
- Ensure Bitcoin network active
- Check OKX extension permissions
- Try re-installing extension

**MetaMask**:
- Bitcoin Snaps required
- May have limited functionality
- Consider alternative wallet

**Bitget**:
- Enable Bitcoin in settings
- Check browser compatibility
- Update extension

---

## Testing Checklist

Before using on mainnet:

- [ ] Install wallet extension
- [ ] Configure for testnet4
- [ ] Get testnet4 coins from faucet
- [ ] Connect wallet to UTXO tool
- [ ] View UTXOs successfully
- [ ] Build test transaction
- [ ] Sign transaction in wallet
- [ ] Broadcast successfully
- [ ] Monitor transaction status
- [ ] Try RBF if applicable
- [ ] Disconnect wallet

Only after successful testnet4 testing, proceed to mainnet with small amounts.

---

## Resources

### Wallet Downloads

- [Unisat Wallet](https://unisat.io)
- [Phantom Wallet](https://phantom.app)
- [OKX Wallet](https://www.okx.com/web3)
- [MetaMask](https://metamask.io)
- [Bitget Wallet](https://web3.bitget.com)

### Documentation

- [Unisat Docs](https://docs.unisat.io)
- [Phantom Docs](https://docs.phantom.app)
- [OKX Web3 Docs](https://www.okx.com/web3/build)

### Support

- Check wallet-specific support channels
- Community forums
- Official documentation
- GitHub issues (for technical problems)

---

For more information:
- [User Guide](./USER_GUIDE.md)
- [Testnet4 Guide](./TESTNET4_GUIDE.md)
- [Security Guide](./SECURITY.md)
