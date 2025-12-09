'use client'

import React, { useState } from 'react'
import { Wallet, LogOut } from 'lucide-react'
import { useWalletStore } from '@/store/wallet-store'
import { Button } from '@/components/ui/button'
import { WalletModal } from './WalletModal'
import { getWalletManager } from '@/lib/wallets/wallet-manager'
import { truncateAddress } from '@/lib/utils/format'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'

export function WalletConnectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isConnected, address, isConnecting, setDisconnected } = useWalletStore()
  const { copy } = useCopyToClipboard()

  const handleDisconnect = async () => {
    try {
      const walletManager = getWalletManager()
      await walletManager.disconnect()
      setDisconnected()
    } catch (error) {
      console.error('Error disconnecting:', error)
    }
  }

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (address) {
      copy(address, 'Address')
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg text-sm cursor-pointer hover:bg-[#10B981]/20 transition-colors"
          onClick={handleCopyAddress}
          title="Click to copy address"
        >
          <div className="h-2 w-2 bg-[#10B981] rounded-full animate-pulse" />
          <span className="font-mono text-[#10B981]">{truncateAddress(address)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDisconnect}
          title="Disconnect Wallet"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        disabled={isConnecting}
        className="gap-2"
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
