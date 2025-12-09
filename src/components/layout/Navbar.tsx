'use client'

import React, { useState } from 'react'
import { Wallet, Bitcoin, Sun, Moon } from 'lucide-react'
import { useWalletStore } from '@/store/wallet-store'
import { useThemeStore } from '@/store/theme-store'
import { Button } from '@/components/ui/button'
import { NetworkSwitcher } from '@/components/wallet/NetworkSwitcher'
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton'
import { truncateAddress } from '@/lib/utils/format'

export function Navbar() {
  const { address, network } = useWalletStore()
  const { theme, toggleTheme } = useThemeStore()

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 glass rounded-2xl shadow-2xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <Bitcoin className="h-7 w-7 text-[#F59E0B] transition-all duration-300 group-hover:rotate-180 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#F59E0B] opacity-0 blur-xl group-hover:opacity-30 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] bg-clip-text text-transparent">
              UTXO Manager
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <div className={`h-2 w-2 rounded-full ${network === 'mainnet' ? 'bg-[#F59E0B]' : 'bg-[#8B5CF6]'} animate-pulse`} />
            <span className="text-sm text-gray-300">
              Bitcoin {network === 'mainnet' ? 'Mainnet' : 'Testnet4'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-[#F59E0B]" />
            ) : (
              <Moon className="h-5 w-5 text-[#8B5CF6]" />
            )}
          </Button>
          <NetworkSwitcher />
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  )
}
