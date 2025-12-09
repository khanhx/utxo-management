'use client'

import { UTXOList } from '@/components/utxo/UTXOList'
import { TransactionBuilder } from '@/components/transaction/TransactionBuilder'
import { DonationBanner } from '@/components/ui/donation-banner'
import { useWalletStore } from '@/store/wallet-store'
import { Wallet, Eye, Send, Zap } from 'lucide-react'

export default function Home() {
  const { isConnected } = useWalletStore()

  return (
    <>
      {/* Fixed Donation Panel */}
      <DonationBanner />

      <div className="space-y-12">
        <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent animate-gradient">
          Bitcoin UTXO Manager
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Manage your unspent transaction outputs, build custom transactions,
          and replace pending transactions with <span className="text-[#8B5CF6] font-semibold">Replace-By-Fee (RBF)</span>
        </p>
      </div>

      {!isConnected && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="glass-card p-10 rounded-3xl text-center space-y-6 glow-primary transition-all duration-300 hover:glow-accent">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Get Started</h2>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Connect your Bitcoin wallet to start managing UTXOs and building transactions with full control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-4 group hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#F59E0B]/30">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] group-hover:bg-[#F59E0B] group-hover:text-white transition-all duration-300">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Connect Wallet</h3>
              <p className="text-sm text-gray-400">
                Support for Unisat, Phantom, OKX, MetaMask, and Bitget wallets
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 group hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#8B5CF6]/30">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all duration-300">
                <Eye className="h-6 w-6" />
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">View UTXOs</h3>
              <p className="text-sm text-gray-400">
                See all your unspent transaction outputs in real-time
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 group hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#10B981]/30">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#10B981]/20 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-all duration-300">
                <Send className="h-6 w-6" />
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Build & Send</h3>
              <p className="text-sm text-gray-400">
                Create transactions with full control and RBF support
              </p>
            </div>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <UTXOList />
          </div>

          <div className="space-y-6">
            <TransactionBuilder />
          </div>
        </div>
      )}
      </div>
    </>
  )
}
