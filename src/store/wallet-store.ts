import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WalletProvider, BitcoinNetwork } from '@/types'

interface WalletState {
  // Connection state
  isConnected: boolean
  connectedWallet: WalletProvider | null
  address: string | null
  publicKey: string | null

  // Network
  network: BitcoinNetwork

  // UI state
  isConnecting: boolean
  error: string | null

  // Actions
  setConnected: (wallet: WalletProvider, address: string, publicKey: string) => void
  setDisconnected: () => void
  setNetwork: (network: BitcoinNetwork) => void
  setError: (error: string | null) => void
  setConnecting: (isConnecting: boolean) => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      // Initial state
      isConnected: false,
      connectedWallet: null,
      address: null,
      publicKey: null,
      network: 'testnet4',
      isConnecting: false,
      error: null,

      // Actions
      setConnected: (wallet, address, publicKey) =>
        set({
          isConnected: true,
          connectedWallet: wallet,
          address,
          publicKey,
          error: null,
          isConnecting: false,
        }),

      setDisconnected: () =>
        set({
          isConnected: false,
          connectedWallet: null,
          address: null,
          publicKey: null,
          isConnecting: false,
        }),

      setNetwork: (network) => set({ network }),

      setError: (error) => set({ error, isConnecting: false }),

      setConnecting: (isConnecting) => set({ isConnecting }),
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        network: state.network,
      }),
    }
  )
)
