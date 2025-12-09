import { create } from 'zustand'
import { Transaction } from '@/types'

interface TransactionState {
  currentPsbt: string | null
  currentTransaction: Transaction | null
  isBuilding: boolean
  isSigning: boolean
  isBroadcasting: boolean
  error: string | null
  lastBroadcastTxid: string | null

  // Actions
  setPsbt: (psbt: string) => void
  setTransaction: (transaction: Transaction | null) => void
  setBuilding: (isBuilding: boolean) => void
  setSigning: (isSigning: boolean) => void
  setBroadcasting: (isBroadcasting: boolean) => void
  setError: (error: string | null) => void
  setLastBroadcastTxid: (txid: string) => void
  reset: () => void
}

export const useTransactionStore = create<TransactionState>((set) => ({
  currentPsbt: null,
  currentTransaction: null,
  isBuilding: false,
  isSigning: false,
  isBroadcasting: false,
  error: null,
  lastBroadcastTxid: null,

  setPsbt: (psbt) => set({ currentPsbt: psbt }),

  setTransaction: (transaction) => set({ currentTransaction: transaction }),

  setBuilding: (isBuilding) => set({ isBuilding }),

  setSigning: (isSigning) => set({ isSigning }),

  setBroadcasting: (isBroadcasting) => set({ isBroadcasting }),

  setError: (error) =>
    set({
      error,
      isBuilding: false,
      isSigning: false,
      isBroadcasting: false,
    }),

  setLastBroadcastTxid: (txid) => set({ lastBroadcastTxid: txid }),

  reset: () =>
    set({
      currentPsbt: null,
      currentTransaction: null,
      isBuilding: false,
      isSigning: false,
      isBroadcasting: false,
      error: null,
    }),
}))
