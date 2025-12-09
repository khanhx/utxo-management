# Bitcoin UTXO Management Tool - Developer Guide

Comprehensive guide for developers who want to understand, modify, or contribute to the Bitcoin UTXO Management Tool.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Development Setup](#development-setup)
6. [Key Concepts](#key-concepts)
7. [Component Guide](#component-guide)
8. [State Management](#state-management)
9. [Wallet Adapter System](#wallet-adapter-system)
10. [API Integration](#api-integration)
11. [Bitcoin Transaction Building](#bitcoin-transaction-building)
12. [Testing Strategy](#testing-strategy)
13. [Adding New Features](#adding-new-features)
14. [Contributing Guidelines](#contributing-guidelines)

---

## Project Overview

### Purpose

This application provides advanced Bitcoin UTXO management capabilities through a web interface. It allows users to:
- Connect multiple Bitcoin wallet types
- View and manage unspent transaction outputs
- Build custom transactions with precise input selection
- Replace pending transactions with RBF
- Switch between mainnet and testnet4

### Design Philosophy

**Security First**
- No private key handling
- All signing happens in wallet extensions
- Client-side only operations
- Input validation and sanitization

**Modularity**
- Clear separation of concerns
- Reusable components
- Abstract wallet implementations
- Type-safe interfaces

**Developer Experience**
- TypeScript strict mode
- Comprehensive type definitions
- Clear code organization
- Extensive inline documentation

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Next.js Application                 │
│                     (Frontend)                       │
├──────────────────────┬──────────────────────────────┤
│   React Components   │    State Management          │
│   - Wallet UI        │    - Zustand Stores          │
│   - UTXO Display     │    - Wallet State            │
│   - Transaction UI   │    - UTXO State              │
│   - RBF Interface    │    - Transaction State       │
└──────────────────────┴──────────────────────────────┘
           │                        │
           ▼                        ▼
┌──────────────────────┐  ┌────────────────────────┐
│   Wallet Adapters    │  │   Bitcoin Libraries    │
│   - Base Adapter     │  │   - @scure/btc-signer  │
│   - Unisat          │  │   - bitcoinjs-lib      │
│   - Phantom         │  │   - Transaction Logic  │
│   - OKX             │  │   - RBF Logic          │
│   - MetaMask        │  │   - Fee Estimation     │
│   - Bitget          │  │                        │
└──────────────────────┘  └────────────────────────┘
           │                        │
           ▼                        ▼
┌──────────────────────────────────────────────────┐
│              External Services                    │
│   - Wallet Extensions (Browser)                  │
│   - Mempool.space API (Blockchain Data)          │
└──────────────────────────────────────────────────┘
```

### Data Flow

```
User Action
    ↓
React Component
    ↓
Zustand Store (State Update)
    ↓
Service/Library Function
    ↓
    ├→ Wallet Adapter → Wallet Extension
    ├→ Bitcoin Library → Transaction Building
    └→ API Client → Mempool.space API
         ↓
    Response/Result
         ↓
    Store Update
         ↓
    Component Re-render
         ↓
    UI Update
```

---

## Technology Stack

### Core Framework
- **Next.js 16.0.7** - React framework with App Router and Turbopack
- **React 19.2.1** - UI library with latest features
- **TypeScript 5.9.3** - Type safety and developer experience

### UI Framework
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Lucide React 0.556.0** - Icon library
- **CVA (Class Variance Authority)** - Component variant management

### State Management
- **Zustand 5.0.9** - Lightweight state management

### Bitcoin Libraries
- **@scure/btc-signer 2.0.1** - Modern Bitcoin transaction library
- **bitcoinjs-lib 7.0.0** - Fallback Bitcoin library

### HTTP Client
- **Axios 1.13.2** - API communication

### Development Tools
- **ESLint 9.39.1** - Code linting
- **Prettier 3.7.4** - Code formatting

### Why These Choices?

**Next.js 16 + React 19**
- Latest features and optimizations
- App Router for better code organization
- Turbopack for faster development builds
- Built-in TypeScript support

**@scure/btc-signer**
- Smaller bundle size (39KB vs 95KB for bitcoinjs-lib)
- Audited codebase
- Modern API design
- No network code (better security)
- Taproot and Schnorr support

**Zustand**
- Minimal boilerplate
- TypeScript-friendly
- No Context Provider hell
- Perfect for our use case

**Tailwind CSS 4**
- Rapid development
- Small production bundle
- Easy customization
- Responsive by default

---

## Project Structure

```
utxo-management/
├── .claude/                      # Claude AI configuration
│   └── skills/                   # AI skills
├── .claude_sessions/             # Session persistence
│   ├── planner-researcher/
│   ├── tester/
│   ├── code-reviewer/
│   ├── docs-manager/
│   └── shared_context.md
├── plans/                        # Implementation plans
│   └── 20251208182500_bitcoin_utxo_tool_plan.md
├── docs/                         # Documentation (this directory)
│   ├── USER_GUIDE.md
│   ├── DEVELOPER_GUIDE.md
│   ├── BITCOIN_TECHNICAL.md
│   ├── API_REFERENCE.md
│   ├── WALLET_INTEGRATION.md
│   ├── DEPLOYMENT.md
│   ├── ROADMAP.md
│   ├── SECURITY.md
│   └── TESTNET4_GUIDE.md
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout component
│   │   ├── page.tsx             # Home page (UTXO manager)
│   │   ├── globals.css          # Global styles
│   │   └── favicon.ico
│   ├── components/               # React components
│   │   ├── layout/              # Layout components
│   │   │   ├── Navbar.tsx       # Top navigation bar
│   │   │   └── Footer.tsx       # Footer component
│   │   ├── wallet/              # Wallet connection
│   │   │   ├── WalletConnectButton.tsx
│   │   │   ├── WalletModal.tsx
│   │   │   └── NetworkSwitcher.tsx
│   │   ├── utxo/                # UTXO management
│   │   │   ├── UTXOList.tsx     # Main UTXO list
│   │   │   ├── UTXOCard.tsx     # Individual UTXO display
│   │   │   ├── AddUTXOForm.tsx  # Manual UTXO addition
│   │   │   └── PendingBadge.tsx # Status indicator
│   │   ├── transaction/         # Transaction building
│   │   │   ├── TransactionBuilder.tsx
│   │   │   ├── OutputForm.tsx
│   │   │   ├── FeeSelector.tsx
│   │   │   └── TransactionPreview.tsx
│   │   ├── rbf/                 # RBF functionality
│   │   │   ├── RBFModal.tsx     # RBF interface
│   │   │   └── FeeEstimator.tsx # Fee calculations
│   │   └── ui/                  # Base UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── lib/                      # Core libraries
│   │   ├── wallets/             # Wallet adapter system
│   │   │   ├── types.ts         # Wallet type definitions
│   │   │   ├── base-adapter.ts  # Abstract base adapter
│   │   │   ├── unisat-adapter.ts
│   │   │   ├── phantom-adapter.ts
│   │   │   ├── okx-adapter.ts
│   │   │   ├── metamask-adapter.ts
│   │   │   ├── bitget-adapter.ts
│   │   │   └── wallet-manager.ts # Wallet orchestration
│   │   ├── bitcoin/             # Bitcoin logic
│   │   │   ├── transaction.ts   # Transaction building
│   │   │   ├── rbf.ts          # RBF implementation
│   │   │   ├── address.ts      # Address utilities
│   │   │   └── fee-estimator.ts # Fee calculations
│   │   ├── api/                 # API clients
│   │   │   ├── mempool.ts      # Mempool.space client
│   │   │   ├── types.ts        # API type definitions
│   │   │   └── client.ts       # Base HTTP client
│   │   └── utils/               # Utility functions
│   │       ├── format.ts       # Formatting helpers
│   │       ├── validation.ts   # Input validation
│   │       └── constants.ts    # App constants
│   ├── store/                    # Zustand state stores
│   │   ├── wallet-store.ts      # Wallet connection state
│   │   ├── utxo-store.ts        # UTXO management state
│   │   └── transaction-store.ts # Transaction building state
│   ├── hooks/                    # Custom React hooks
│   │   ├── useWallet.ts         # Wallet operations
│   │   ├── useUTXOs.ts          # UTXO fetching
│   │   ├── useTransaction.ts    # Transaction building
│   │   └── useRBF.ts            # RBF operations
│   └── types/                    # TypeScript definitions
│       ├── wallet.ts            # Wallet types
│       ├── utxo.ts              # UTXO types
│       ├── transaction.ts       # Transaction types
│       └── api.ts               # API response types
├── public/                       # Static assets
│   └── (images, fonts, etc.)
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment (git-ignored)
├── .gitignore                    # Git ignore rules
├── .eslintrc.json               # ESLint configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # Project readme
```

### File Naming Conventions

- **Components**: PascalCase (`WalletConnectButton.tsx`)
- **Hooks**: camelCase with "use" prefix (`useWallet.ts`)
- **Utilities**: camelCase (`validation.ts`)
- **Types**: PascalCase for interfaces/types (`wallet.ts`)
- **Stores**: kebab-case with "-store" suffix (`wallet-store.ts`)

---

## Development Setup

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm)
- **Git**: For version control
- **Modern Browser**: Chrome, Brave, Firefox, or Edge
- **Wallet Extension**: At least one supported wallet for testing

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd utxo-management

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create `.env.local` file:

```bash
# Mempool.space API URLs (usually no change needed)
NEXT_PUBLIC_MEMPOOL_API_URL=https://mempool.space/api
NEXT_PUBLIC_TESTNET_MEMPOOL_API_URL=https://mempool.space/testnet4/api

# Enable testnet4 (set to 'true' for development)
NEXT_PUBLIC_ENABLE_TESTNET=true

# Optional: Custom API endpoints
# NEXT_PUBLIC_CUSTOM_MAINNET_API=https://your-api.com
# NEXT_PUBLIC_CUSTOM_TESTNET_API=https://your-testnet-api.com
```

### Available Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint (Note: currently broken, needs config fix)
npm run format       # Format code with Prettier

# Type checking
npx tsc --noEmit     # Check TypeScript types without compilation
```

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   - Opens at `http://localhost:3000`
   - Hot module replacement enabled
   - TypeScript checking in real-time

2. **Make Changes**
   - Edit files in `src/`
   - Changes reflect immediately
   - Check browser console for errors

3. **Test Changes**
   - Connect wallet extension
   - Test on testnet4 first
   - Verify all functionality

4. **Format and Lint**
   ```bash
   npm run format
   # npm run lint (after fixing ESLint config)
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

### IDE Setup

**Recommended: Visual Studio Code**

Install extensions:
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **TypeScript** - Already built-in

**VS Code Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Key Concepts

### Wallet Adapter Pattern

The application uses an adapter pattern to abstract different wallet implementations:

```typescript
// Base interface all wallets must implement
interface WalletAdapter {
  name: WalletProvider
  connect(): Promise<string>
  disconnect(): Promise<void>
  getAddress(): Promise<string>
  getPublicKey(): Promise<string>
  signPsbt(psbtHex: string): Promise<string>
  signMessage(message: string): Promise<string>
  pushTransaction(txHex: string): Promise<string>
  switchNetwork(network: BitcoinNetwork): Promise<void>
  isInstalled(): boolean
}
```

**Benefits:**
- Easy to add new wallets
- Consistent interface across wallets
- Testable and mockable
- Type-safe wallet operations

### UTXO Model

UTXOs are the fundamental unit in Bitcoin:

```typescript
interface UTXO {
  txid: string           // Transaction ID
  vout: number           // Output index
  value: number          // Amount in satoshis
  status: UTXOStatus     // Confirmation status
  scriptPubKey?: string  // Locking script
  address?: string       // Receiving address
}

interface UTXOStatus {
  confirmed: boolean
  block_height?: number
  block_hash?: string
  block_time?: number
}
```

### Transaction Building Flow

```
1. User selects UTXOs (inputs)
2. User specifies outputs (addresses + amounts)
3. Application calculates fee
4. Create PSBT (Partially Signed Bitcoin Transaction)
5. Send PSBT to wallet for signing
6. Wallet returns signed transaction
7. Broadcast signed transaction to network
8. Track transaction status
```

### State Management Pattern

Zustand stores follow this pattern:

```typescript
interface StoreState {
  // State
  data: Data[]
  isLoading: boolean
  error: string | null

  // Actions
  setData: (data: Data[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useStore = create<StoreState>((set) => ({
  // Initial state
  data: [],
  isLoading: false,
  error: null,

  // Action implementations
  setData: (data) => set({ data }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
```

---

## Component Guide

### Core Components

#### Navbar Component
**Location:** `src/components/layout/Navbar.tsx`

Responsibilities:
- Display application title and logo
- Show wallet connection status
- Network switcher integration
- User address display
- Wallet disconnect functionality

Key features:
- Responsive design
- Real-time wallet status updates
- Network indicator

#### WalletConnectButton Component
**Location:** `src/components/wallet/WalletConnectButton.tsx`

Responsibilities:
- Initiate wallet connection
- Display connection status
- Handle wallet errors
- Show available wallets

Props:
```typescript
interface WalletConnectButtonProps {
  className?: string
  onConnect?: (address: string) => void
  onDisconnect?: () => void
}
```

#### UTXOList Component
**Location:** `src/components/utxo/UTXOList.tsx`

Responsibilities:
- Display all UTXOs for connected address
- UTXO selection interface
- Filtering and sorting
- Refresh functionality

State management:
- Uses `useUTXOStore` for UTXO data
- Manages selection state locally
- Fetches from Mempool API

#### TransactionBuilder Component
**Location:** `src/components/transaction/TransactionBuilder.tsx`

Responsibilities:
- Build Bitcoin transactions
- Add/remove outputs
- Fee rate selection
- Transaction preview
- Sign and broadcast

**Note:** Current implementation uses placeholder logic. Needs @scure/btc-signer integration for production.

#### RBFModal Component
**Location:** `src/components/rbf/RBFModal.tsx`

Responsibilities:
- Replace-By-Fee interface
- Fee bump calculation
- Output adjustment
- BIP 125 compliance checking

Key features:
- Original transaction display
- Minimum fee calculation
- Change output adjustment
- Validation before replacement

### UI Components

Base UI components in `src/components/ui/`:
- `button.tsx` - Button variants
- `card.tsx` - Card container
- `dialog.tsx` - Modal dialogs
- `input.tsx` - Form inputs
- `select.tsx` - Dropdown selects
- And more...

These are customizable shadcn/ui-style components built with Radix UI primitives and Tailwind CSS.

---

## State Management

### Wallet Store
**File:** `src/store/wallet-store.ts`

Manages wallet connection state:

```typescript
interface WalletState {
  // Connection
  isConnected: boolean
  connectedWallet: WalletProvider | null
  address: string | null
  publicKey: string | null

  // Network
  network: BitcoinNetwork

  // UI
  isConnecting: boolean
  error: string | null

  // Actions
  setConnected: (wallet, address, publicKey) => void
  setDisconnected: () => void
  setNetwork: (network) => void
  setError: (error) => void
  setConnecting: (isConnecting) => void
}
```

**Persistence:**
- Network preference persisted to localStorage
- Connection state NOT persisted (security)
- Reconnection required on page reload

### UTXO Store
**File:** `src/store/utxo-store.ts`

Manages UTXO data and selection:

```typescript
interface UTXOState {
  utxos: UTXO[]
  selectedUTXOs: string[]  // Format: "txid:vout"
  isLoading: boolean
  error: string | null
  lastFetched: number | null

  // Actions
  setUTXOs: (utxos) => void
  addCustomUTXO: (utxo) => void
  removeUTXO: (txid, vout) => void
  selectUTXO: (txid, vout) => void
  deselectUTXO: (txid, vout) => void
  clearSelection: () => void
}
```

**Key operations:**
- Fetch UTXOs from API
- Manual UTXO addition
- UTXO selection for transactions
- Auto-refresh every 30 seconds

### Transaction Store
**File:** `src/store/transaction-store.ts`

Manages transaction building state:

```typescript
interface TransactionState {
  // Transaction data
  inputs: UTXO[]
  outputs: TransactionOutput[]
  feeRate: number
  enableRBF: boolean

  // UI state
  isBuilding: boolean
  isSigning: boolean
  isBroadcasting: boolean
  error: string | null

  // Result
  signedTx: string | null
  broadcastTxid: string | null

  // Actions
  setInputs: (inputs) => void
  addOutput: (output) => void
  removeOutput: (index) => void
  setFeeRate: (feeRate) => void
  setEnableRBF: (enable) => void
  reset: () => void
}
```

---

## Wallet Adapter System

### Base Adapter

**File:** `src/lib/wallets/base-adapter.ts`

Abstract class that all wallet adapters extend:

```typescript
export abstract class BaseWalletAdapter implements WalletAdapter {
  abstract name: WalletProvider
  protected provider: any
  protected currentAddress: string | null = null
  protected currentNetwork: BitcoinNetwork = 'mainnet'

  abstract isInstalled(): boolean
  protected abstract getProvider(): any

  // Common implementation
  async connect(): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error(`${this.name} wallet is not installed`)
    }
    // Connect logic...
  }

  // Abstract methods each wallet must implement
  abstract getPublicKey(): Promise<string>
  abstract signPsbt(psbtHex: string): Promise<string>
  abstract signMessage(message: string): Promise<string>
  abstract pushTransaction(txHex: string): Promise<string>
  abstract switchNetwork(network: BitcoinNetwork): Promise<void>
}
```

### Adding a New Wallet

1. **Create adapter file**
   ```typescript
   // src/lib/wallets/newwallet-adapter.ts
   import { BaseWalletAdapter } from './base-adapter'

   export class NewWalletAdapter extends BaseWalletAdapter {
     name: WalletProvider = 'newwallet'

     isInstalled(): boolean {
       return typeof window !== 'undefined' &&
              typeof window.newwallet !== 'undefined'
     }

     protected getProvider(): any {
       return window.newwallet
     }

     // Implement all abstract methods...
   }
   ```

2. **Add to wallet manager**
   ```typescript
   // src/lib/wallets/wallet-manager.ts
   import { NewWalletAdapter } from './newwallet-adapter'

   export class WalletManager {
     private adapters: Map<WalletProvider, WalletAdapter>

     constructor() {
       this.adapters = new Map([
         ['unisat', new UnisatAdapter()],
         ['phantom', new PhantomAdapter()],
         // ... existing wallets
         ['newwallet', new NewWalletAdapter()], // Add here
       ])
     }
   }
   ```

3. **Update types**
   ```typescript
   // src/types/wallet.ts
   export type WalletProvider =
     | 'unisat'
     | 'phantom'
     | 'okx'
     | 'metamask'
     | 'bitget'
     | 'newwallet'  // Add here
   ```

4. **Add to wallet modal**
   Update `src/components/wallet/WalletModal.tsx` to include new wallet option.

---

## API Integration

### Mempool.space Client

**File:** `src/lib/api/mempool.ts`

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
    })
  }

  // Get UTXOs for address
  async getAddressUTXOs(address: string): Promise<UTXO[]> {
    const response = await this.client.get(`/address/${address}/utxo`)
    return response.data
  }

  // Get transaction details
  async getTransaction(txid: string): Promise<Transaction> {
    const response = await this.client.get(`/tx/${txid}`)
    return response.data
  }

  // Broadcast transaction
  async broadcastTransaction(txHex: string): Promise<string> {
    const response = await this.client.post('/tx', txHex, {
      headers: { 'Content-Type': 'text/plain' }
    })
    return response.data  // Returns txid
  }

  // Get recommended fees
  async getRecommendedFees(): Promise<FeeEstimates> {
    const response = await this.client.get('/fees/recommended')
    return response.data
  }
}
```

### Error Handling

All API calls include error handling:

```typescript
try {
  const utxos = await api.getAddressUTXOs(address)
  return utxos
} catch (error) {
  if (error.response?.status === 404) {
    // Address not found or no UTXOs
    return []
  } else if (error.response?.status === 429) {
    // Rate limited
    throw new Error('Too many requests. Please wait.')
  } else {
    // Other errors
    console.error('API Error:', error)
    throw new Error('Failed to fetch UTXOs')
  }
}
```

---

## Bitcoin Transaction Building

### Current Implementation (Placeholder)

**File:** `src/lib/bitcoin/transaction.ts`

The current implementation uses simplified placeholder logic:

```typescript
export class TransactionBuilder {
  // Creates a mock PSBT (not real Bitcoin serialization)
  createPSBT(
    inputs: UTXO[],
    outputs: TransactionOutput[],
    feeRate: number,
    enableRBF: boolean = true
  ): string {
    // Current: JSON serialization (placeholder)
    const tx = {
      inputs,
      outputs,
      feeRate,
      rbf: enableRBF
    }
    return 'psbt_' + Buffer.from(JSON.stringify(tx)).toString('hex')
  }
}
```

### Production Implementation (Needed)

Integration with @scure/btc-signer:

```typescript
import * as btc from '@scure/btc-signer'

export class TransactionBuilder {
  private network: btc.Network

  constructor(isTestnet: boolean = false) {
    this.network = isTestnet ? btc.TEST_NETWORK : btc.NETWORK
  }

  createPSBT(
    inputs: UTXO[],
    outputs: TransactionOutput[],
    feeRate: number,
    enableRBF: boolean = true
  ): string {
    const tx = new btc.Transaction()

    // Add inputs
    inputs.forEach((utxo) => {
      tx.addInput({
        txid: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: Buffer.from(utxo.scriptPubKey, 'hex'),
          amount: BigInt(utxo.value)
        },
        sequence: enableRBF ? 0xfffffffd : 0xffffffff
      })
    })

    // Add outputs
    outputs.forEach((output) => {
      tx.addOutputAddress(
        output.address,
        BigInt(output.value),
        this.network
      )
    })

    // Return PSBT hex
    return tx.toPSBT(0).toString('hex')
  }

  finalizePSBT(psbtHex: string): string {
    const psbt = btc.Transaction.fromPSBT(Buffer.from(psbtHex, 'hex'))
    psbt.finalize()
    return psbt.extract().hex
  }
}
```

**TODO:** Replace placeholder with above implementation.

---

## Testing Strategy

### Test Structure (Planned)

```
tests/
├── unit/
│   ├── utils/
│   │   ├── validation.test.ts
│   │   └── format.test.ts
│   ├── bitcoin/
│   │   ├── transaction.test.ts
│   │   ├── rbf.test.ts
│   │   └── fee-estimator.test.ts
│   └── wallets/
│       ├── base-adapter.test.ts
│       └── wallet-manager.test.ts
├── integration/
│   ├── wallet-connection.test.ts
│   ├── utxo-management.test.ts
│   └── transaction-flow.test.ts
└── e2e/
    ├── complete-transaction.test.ts
    └── rbf-workflow.test.ts
```

### Unit Testing Example

```typescript
// tests/unit/utils/validation.test.ts
import { describe, it, expect } from 'vitest'
import { Validator } from '@/lib/utils/validation'

describe('Address Validation', () => {
  describe('Mainnet addresses', () => {
    it('should validate P2PKH addresses', () => {
      expect(Validator.isValidBitcoinAddress(
        '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        'mainnet'
      )).toBe(true)
    })

    it('should validate Bech32 addresses', () => {
      expect(Validator.isValidBitcoinAddress(
        'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        'mainnet'
      )).toBe(true)
    })

    it('should reject testnet addresses on mainnet', () => {
      expect(Validator.isValidBitcoinAddress(
        'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
        'mainnet'
      )).toBe(false)
    })
  })
})
```

### Integration Testing Example

```typescript
// tests/integration/wallet-connection.test.ts
import { describe, it, expect, vi } from 'vitest'
import { WalletManager } from '@/lib/wallets/wallet-manager'

describe('Wallet Connection Flow', () => {
  it('should connect Unisat wallet', async () => {
    // Mock window.unisat
    global.window.unisat = {
      requestAccounts: vi.fn().mockResolvedValue(['tb1q...']),
      getPublicKey: vi.fn().mockResolvedValue('02abc...')
    }

    const manager = new WalletManager()
    const address = await manager.connect('unisat')

    expect(address).toBe('tb1q...')
    expect(manager.isConnected()).toBe(true)
  })
})
```

### E2E Testing (Playwright)

```typescript
// tests/e2e/complete-transaction.test.ts
import { test, expect } from '@playwright/test'

test('complete transaction flow', async ({ page }) => {
  // Navigate to app
  await page.goto('http://localhost:3000')

  // Switch to testnet
  await page.click('[data-testid="network-switcher"]')
  await page.click('text=Testnet4')

  // Connect wallet (requires wallet extension mock)
  await page.click('text=Connect Wallet')
  await page.click('text=Unisat')

  // Wait for UTXOs to load
  await expect(page.locator('[data-testid="utxo-card"]')).toBeVisible()

  // Select UTXO
  await page.click('[data-testid="utxo-checkbox"]')

  // Build transaction
  await page.click('text=Build Transaction')
  await page.fill('[data-testid="output-address"]', 'tb1q...')
  await page.fill('[data-testid="output-amount"]', '10000')

  // Sign and broadcast
  await page.click('text=Sign Transaction')
  // Handle wallet popup...
  await page.click('text=Broadcast')

  // Verify success
  await expect(page.locator('text=Transaction broadcast')).toBeVisible()
})
```

**Note:** Currently no tests are implemented. This is a critical gap that needs addressing.

---

## Adding New Features

### Feature Development Checklist

1. **Planning**
   - Define requirements
   - Design architecture
   - Update types if needed
   - Consider security implications

2. **Implementation**
   - Create necessary files
   - Implement core logic
   - Add to relevant components
   - Update stores if needed

3. **UI Integration**
   - Create/update components
   - Add to navigation
   - Ensure responsive design
   - Add loading/error states

4. **Testing**
   - Write unit tests
   - Add integration tests
   - Manual testing on testnet4
   - Cross-browser testing

5. **Documentation**
   - Update user guide
   - Update developer guide
   - Add inline code comments
   - Update README if major feature

### Example: Adding UTXO Consolidation

1. **Create service**
   ```typescript
   // src/lib/bitcoin/consolidation.ts
   export class UTXOConsolidator {
     selectUTXOsForConsolidation(
       utxos: UTXO[],
       threshold: number
     ): UTXO[] {
       // Select UTXOs below threshold
       return utxos.filter(u => u.value < threshold)
     }

     calculateOptimalConsolidation(
       utxos: UTXO[],
       currentFeeRate: number
     ): ConsolidationPlan {
       // Calculate if consolidation saves money
     }
   }
   ```

2. **Add to transaction store**
   ```typescript
   // src/store/transaction-store.ts
   interface TransactionState {
     // ... existing state
     consolidationMode: boolean

     setConsolidationMode: (enabled: boolean) => void
   }
   ```

3. **Create UI component**
   ```typescript
   // src/components/utxo/ConsolidationModal.tsx
   export function ConsolidationModal() {
     // Consolidation interface
   }
   ```

4. **Add to UTXO list**
   Update `UTXOList.tsx` to include consolidation button

5. **Test thoroughly**
   - Unit test consolidation logic
   - Integration test with transaction building
   - Manual test on testnet4

---

## Contributing Guidelines

### Code Style

**TypeScript**
- Use TypeScript strict mode
- Define interfaces for all data structures
- Avoid `any` types without justification
- Use meaningful variable names

**React**
- Functional components only
- Use hooks appropriately
- Destructure props
- Keep components focused (single responsibility)

**Formatting**
- Use Prettier for formatting
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required

### Git Workflow

**Branch Naming**
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation
- `refactor/what-changed` - Code refactoring

**Commit Messages**
Follow conventional commits:
```
feat: add UTXO consolidation feature
fix: correct fee calculation for P2WPKH
docs: update developer guide with testing section
refactor: extract wallet connection logic
```

**Pull Request Process**
1. Create feature branch from `main`
2. Implement changes
3. Write/update tests
4. Update documentation
5. Run linting and formatting
6. Create pull request
7. Address review feedback
8. Merge when approved

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] TypeScript types are correct
- [ ] No security issues (especially wallet/transaction handling)
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No breaking changes (or documented)
- [ ] Tested on testnet4
- [ ] Performance is acceptable

---

## Performance Optimization

### Current Optimizations

**Bundle Size**
- Next.js automatic code splitting
- Tree-shaking unused code
- @scure/btc-signer (small bundle)
- Zustand (minimal overhead)

**React Performance**
- Functional components
- Proper use of keys in lists
- Avoid unnecessary re-renders

### Future Optimizations

**Recommended:**
- Add `useMemo` for expensive calculations
- Add `useCallback` for event handlers
- Virtualize long UTXO lists
- Debounce API calls
- Cache API responses
- Implement service worker for offline support

---

## Security Considerations

### Security Principles

1. **Never Handle Private Keys**
   - All signing in wallet extensions
   - No private key variables
   - No seed phrase handling

2. **Input Validation**
   - Validate all user inputs
   - Sanitize before processing
   - Network-aware address validation

3. **XSS Prevention**
   - Never use `dangerouslySetInnerHTML`
   - Sanitize user-provided data
   - React's built-in XSS protection

4. **State Security**
   - Don't persist sensitive data
   - Clear state on disconnect
   - No sensitive data in localStorage

5. **Transaction Security**
   - Always show transaction preview
   - Verify addresses
   - Check for sufficient funds
   - Dust limit protection

### Security Checklist for PRs

- [ ] No private key handling
- [ ] Input validation added
- [ ] XSS prevention considered
- [ ] Sensitive data not persisted
- [ ] Transaction preview required
- [ ] Error messages don't leak sensitive info

---

## Troubleshooting Development Issues

### Build Errors

**TypeScript Errors**
```bash
# Check types without building
npx tsc --noEmit

# Common fixes
npm install @types/node @types/react @types/react-dom
```

**Module Not Found**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**ESLint Config Error**
Current issue: ESLint v9 incompatible with `.eslintrc.json`

Solution: Either migrate to `eslint.config.js` or downgrade to ESLint v8

### Runtime Errors

**Wallet Not Detected**
- Ensure wallet extension installed
- Check browser compatibility
- Refresh page after installing wallet

**API Errors**
- Check internet connection
- Verify Mempool.space is accessible
- Check rate limiting (wait if 429 error)

**State Not Updating**
- Check Zustand store actions
- Verify component is subscribed to store
- Check for console errors

---

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

### Bitcoin Development
- [@scure/btc-signer](https://github.com/paulmillr/scure-btc-signer)
- [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)
- [Bitcoin Developer Documentation](https://developer.bitcoin.org)
- [BIP 125 (RBF)](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki)

### Tools
- [Mempool.space API](https://mempool.space/docs/api)
- [Bitcoin Testnet4 Faucet](https://mempool.space/testnet4/faucet)
- [Bitcoin Block Explorer](https://mempool.space)

---

## Getting Help

### Support Channels
- GitHub Issues: Bug reports and feature requests
- Documentation: Check all docs in `/docs` directory
- Community: [Links to Discord/Telegram/Forum]

### Reporting Bugs

Include:
1. Environment (OS, Node version, browser)
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Console logs
6. Screenshots if UI issue

### Contributing

See full contributing guidelines in [CONTRIBUTING.md] (to be created).

Pull requests welcome! Start with good first issues labeled `good-first-issue`.

---

**Happy Coding!**

For more information, see:
- [User Guide](./USER_GUIDE.md)
- [Bitcoin Technical Details](./BITCOIN_TECHNICAL.md)
- [API Reference](./API_REFERENCE.md)
- [Deployment Guide](./DEPLOYMENT.md)
