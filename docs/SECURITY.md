# Security Documentation

Comprehensive security guide for the Bitcoin UTXO Management Tool.

## Security Model

### Core Principles

1. **No Private Key Handling**
   - All private keys remain in wallet extensions
   - Application never requests or stores private keys
   - Zero-knowledge of user credentials

2. **Client-Side Only**
   - All operations in browser
   - No backend server storing sensitive data
   - Blockchain data from public APIs only

3. **Defense in Depth**
   - Input validation
   - Output sanitization
   - XSS prevention
   - CSRF protection

---

## Wallet Security

### Private Key Protection

**What We Never Do**:
- Request private keys
- Store private keys
- Transmit private keys
- Log private keys
- Cache private keys

**What Users Must Do**:
- Keep seed phrases offline
- Use strong wallet passwords
- Enable wallet security features
- Use hardware wallets for large amounts

### Signing Flow

```
1. Application builds transaction (no keys)
2. Send PSBT to wallet extension
3. Wallet prompts user for approval
4. User reviews and signs in wallet
5. Wallet returns signed transaction
6. Application broadcasts signed tx
```

At no point does the application access private keys.

---

## Application Security

### Input Validation

**Address Validation**:
```typescript
function isValidBitcoinAddress(address: string, network: BitcoinNetwork): boolean {
  // Validate format
  // Check network prefix
  // Verify checksum
  // Prevent injection attacks
}
```

**Transaction ID Validation**:
- Must be 64 hexadecimal characters
- No special characters
- Regex: `/^[a-fA-F0-9]{64}$/`

**Amount Validation**:
- Positive integers only
- Maximum: 2.1 million BTC (in satoshis)
- Minimum: Above dust limit (546 sats)
- No decimal manipulation

**Script Validation**:
- Hex string format
- Reasonable length limits
- No code execution

### XSS Prevention

**React Built-in Protection**:
- JSX escapes values by default
- Safe from most XSS attacks

**Never Use**:
- `dangerouslySetInnerHTML`
- Direct DOM manipulation with user input
- `eval()` or similar functions

**Input Sanitization**:
```typescript
function sanitizeInput(input: string): string {
  return input.replace(/[<>"'&]/g, '')
}
```

### CSRF Protection

**Not Applicable**:
- No session cookies
- No authenticated state on server
- Client-side only application

**Wallet-Level Protection**:
- User must approve each transaction
- No automatic signing

---

## Transaction Security

### Transaction Review

**Before Signing**:
1. Preview all transaction details
2. Verify recipient address
3. Confirm send amount
4. Check fee amount
5. Ensure correct network

**Wallet Confirmation**:
- User MUST review in wallet popup
- Double-check all details
- Never approve blindly

### Dust Limit Protection

```typescript
const DUST_LIMIT = 546 // satoshis

function isDust(value: number): boolean {
  return value < DUST_LIMIT
}

// Prevent creating dust outputs
if (isDust(outputValue)) {
  throw new Error('Output below dust limit')
}
```

### Fee Sanity Checks

```typescript
// Warn if fee exceeds reasonable amount
const MAX_REASONABLE_FEE_PERCENT = 0.10 // 10%
const feePercent = fee / totalInput

if (feePercent > MAX_REASONABLE_FEE_PERCENT) {
  warn('Fee seems unusually high')
}

// Warn if fee rate extremely high
const HIGH_FEE_RATE = 500 // sat/vB
if (feeRate > HIGH_FEE_RATE) {
  warn('Fee rate is very high')
}
```

### Double-Spend Prevention

**User Responsibility**:
- Don't select already-spent UTXOs
- Wait for confirmations before assuming payment
- Monitor transaction status

**Application Helps**:
- Filter out pending/unconfirmed UTXOs
- Show confirmation count
- Warn about unconfirmed inputs

---

## Network Security

### API Security

**HTTPS Only**:
- All API calls over HTTPS
- No sensitive data in URLs
- TLS 1.2+ required

**API Key Management**:
- No API keys required for mempool.space
- If using other APIs, store keys securely
- Never commit keys to git

**Rate Limiting**:
- Respect API rate limits
- Implement client-side throttling
- Handle 429 responses gracefully

### Man-in-the-Middle (MITM) Protection

**Defenses**:
- HTTPS with valid certificates
- Certificate pinning (for dedicated APIs)
- No mixed content (HTTP + HTTPS)

**User Responsibilities**:
- Verify HTTPS lock icon
- Check certificate validity
- Don't bypass SSL warnings

---

## Data Privacy

### Local Storage

**What We Store**:
- Network preference (mainnet/testnet)
- UI preferences (theme, etc.)

**What We Never Store**:
- Private keys
- Seed phrases
- Passwords
- Signed transactions
- Wallet connection state

### Session Storage

**Temporary Data**:
- Current wallet address (cleared on disconnect)
- Selected UTXOs (cleared on transaction complete)
- Transaction building state (cleared on page reload)

**Automatic Cleanup**:
- Clear on wallet disconnect
- Clear on network switch
- Clear on page close

### Cookies

**Not Used**:
- No authentication cookies
- No tracking cookies
- No third-party cookies

### Analytics

**If Enabled**:
- No personal information collected
- No wallet addresses tracked
- Anonymous usage statistics only
- Opt-out available

---

## Operational Security

### Deployment Security

**Production Checklist**:
- [ ] Environment variables not in code
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CSP (Content Security Policy) enabled
- [ ] Dependencies up to date
- [ ] No known vulnerabilities

**CI/CD Security**:
- Secrets managed securely
- No secrets in logs
- Automated security scans
- Dependency vulnerability checks

### Monitoring

**Error Tracking**:
- Monitor for unusual errors
- Alert on security-related errors
- Log analysis for attack patterns

**What Not to Log**:
- User addresses (unless anonymized)
- Transaction details
- Wallet information
- API keys or secrets

---

## User Security Best Practices

### Wallet Security

1. **Backup Seed Phrase**:
   - Write on paper, not digitally
   - Store in safe location
   - Test recovery process
   - Never share with anyone

2. **Strong Passwords**:
   - Unique password for wallet
   - 12+ characters
   - Mix of letters, numbers, symbols
   - Use password manager

3. **2FA/MFA**:
   - Enable if wallet supports it
   - Backup 2FA codes
   - Don't use SMS 2FA (SIM swap risk)

4. **Hardware Wallets**:
   - Use for large amounts
   - Verify addresses on device
   - Keep firmware updated

### Transaction Security

1. **Start with Testnet**:
   - Practice on testnet4 first
   - Understand all features
   - Test signing process

2. **Small Amounts First**:
   - Use small amounts on mainnet initially
   - Verify everything works
   - Gradually increase amounts

3. **Verify Recipients**:
   - Double-check address character by character
   - Use QR codes when possible
   - Confirm amount is correct

4. **Check Fees**:
   - Ensure fee is reasonable
   - Compare with current rates
   - Don't overpay unnecessarily

5. **Monitor Confirmations**:
   - Wait for confirmations before assuming final
   - 1 confirmation minimum
   - 6 confirmations recommended for large amounts

### Privacy

1. **Coin Control**:
   - Don't merge UTXOs from different sources
   - Use separate addresses for different purposes
   - Consider privacy implications

2. **Network Security**:
   - Use VPN when possible
   - Avoid public WiFi for large transactions
   - Use Tor for enhanced privacy (advanced)

3. **Physical Security**:
   - Lock computer when away
   - Don't leave wallet unlocked
   - Secure backup locations

---

## Common Attack Vectors

### Phishing

**Attack**: Fake website mimicking UTXO tool
**Defense**:
- Verify URL before connecting wallet
- Bookmark legitimate site
- Check HTTPS certificate
- Look for typos in domain

### Clipboard Hijacking

**Attack**: Malware changes copied addresses
**Defense**:
- Always verify pasted addresses
- Check first and last characters
- Use QR codes when possible

### Malicious Browser Extensions

**Attack**: Fake wallet extensions
**Defense**:
- Download from official sources only
- Verify extension publisher
- Check reviews and ratings
- Keep extensions updated

### Dust Attacks

**Attack**: Small amounts sent to track you
**Defense**:
- Don't spend dust UTXOs
- Be aware of privacy implications
- Use coin control

### Transaction Malleability

**Attack**: Modify transaction before confirmation
**Defense**:
- SegWit transactions immune
- Use native SegWit addresses (bc1)
- Wait for confirmations

---

## Incident Response

### If Wallet Compromised

1. **Immediate Actions**:
   - Transfer funds to new secure wallet
   - Disconnect all devices
   - Change all passwords
   - Scan for malware

2. **Investigation**:
   - Review transaction history
   - Check for unauthorized transactions
   - Identify compromise vector

3. **Recovery**:
   - Create new wallet with new seed
   - Transfer remaining funds
   - Enhance security measures

### If Bug Discovered

**Report Responsibly**:
1. Email security contact (if available)
2. Provide detailed description
3. Include steps to reproduce
4. Give reasonable time to fix before public disclosure

---

## Security Audits

### Internal Audits

**Regular Reviews**:
- Code review for security issues
- Dependency vulnerability scans
- Static analysis tools
- Manual testing

### Third-Party Audits

**Recommended**:
- Professional security audit before mainnet launch
- Penetration testing
- Smart contract audit (if applicable)
- Bug bounty program

---

## Compliance and Legal

### Disclaimer

This tool is provided "as is" without warranty. Users are responsible for:
- Securing their own wallets
- Verifying all transactions
- Understanding Bitcoin risks
- Complying with local laws

### Terms of Service

- No financial advice provided
- Users assume all risks
- Irreversible transactions
- Test before mainnet use

---

## Security Resources

### Tools

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency checking
- [Snyk](https://snyk.io) - Security scanning
- [OWASP](https://owasp.org) - Security guidelines

### Learning

- [Bitcoin Security Guide](https://bitcoin.org/en/secure-your-wallet)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)

---

## Reporting Security Issues

**Contact**: [To be added]

**Response Time**: Within 48 hours

**Bounty Program**: [To be determined]

---

For more information:
- [User Guide](./USER_GUIDE.md)
- [Wallet Integration](./WALLET_INTEGRATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
