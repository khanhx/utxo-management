import { create } from 'zustand'
import { UTXO } from '@/types'

interface UTXOState {
  utxos: UTXO[]
  selectedUTXOs: string[] // Array of "txid:vout" identifiers
  isLoading: boolean
  error: string | null
  lastFetched: number | null

  // Actions
  setUTXOs: (utxos: UTXO[]) => void
  addCustomUTXO: (utxo: UTXO) => void
  removeUTXO: (txid: string, vout: number) => void
  selectUTXO: (txid: string, vout: number) => void
  deselectUTXO: (txid: string, vout: number) => void
  selectAll: () => void
  clearSelection: () => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useUTXOStore = create<UTXOState>((set) => ({
  utxos: [],
  selectedUTXOs: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  setUTXOs: (utxos) =>
    set({
      utxos,
      lastFetched: Date.now(),
      error: null,
      isLoading: false,
    }),

  addCustomUTXO: (utxo) =>
    set((state) => ({
      utxos: [...state.utxos, utxo],
    })),

  removeUTXO: (txid, vout) =>
    set((state) => ({
      utxos: state.utxos.filter((u) => !(u.txid === txid && u.vout === vout)),
      selectedUTXOs: state.selectedUTXOs.filter((id) => id !== `${txid}:${vout}`),
    })),

  selectUTXO: (txid, vout) =>
    set((state) => {
      const id = `${txid}:${vout}`
      if (state.selectedUTXOs.includes(id)) return state
      return {
        selectedUTXOs: [...state.selectedUTXOs, id],
      }
    }),

  deselectUTXO: (txid, vout) =>
    set((state) => ({
      selectedUTXOs: state.selectedUTXOs.filter((id) => id !== `${txid}:${vout}`),
    })),

  selectAll: () =>
    set((state) => ({
      selectedUTXOs: state.utxos.map((u) => `${u.txid}:${u.vout}`),
    })),

  clearSelection: () => set({ selectedUTXOs: [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () =>
    set({
      utxos: [],
      selectedUTXOs: [],
      isLoading: false,
      error: null,
      lastFetched: null,
    }),
}))
