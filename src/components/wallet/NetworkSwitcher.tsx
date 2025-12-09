'use client'

import React, { useState } from 'react'
import { useWalletStore } from '@/store/wallet-store'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { Globe } from 'lucide-react'
import { getMempoolAPI } from '@/lib/api/mempool'

export function NetworkSwitcher() {
  const { network, setNetwork, isConnected } = useWalletStore()
  const [showMainnetWarning, setShowMainnetWarning] = useState(false)

  const handleNetworkSwitch = () => {
    const newNetwork = network === 'mainnet' ? 'testnet4' : 'mainnet'

    // Show warning for mainnet
    if (newNetwork === 'mainnet') {
      setShowMainnetWarning(true)
    } else {
      setNetwork(newNetwork)
      getMempoolAPI(newNetwork)
    }
  }

  const confirmMainnetSwitch = () => {
    setNetwork('mainnet')
    getMempoolAPI('mainnet')
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNetworkSwitch}
        className="gap-2"
        title={`Switch to ${network === 'mainnet' ? 'Testnet4' : 'Mainnet'}`}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">
          {network === 'mainnet' ? 'Mainnet' : 'Testnet4'}
        </span>
      </Button>

      <ConfirmationModal
        isOpen={showMainnetWarning}
        onClose={() => setShowMainnetWarning(false)}
        onConfirm={confirmMainnetSwitch}
        title="Switch to Mainnet?"
        message={`WARNING: You are switching to MAINNET. Real Bitcoin will be used.

Ensure you understand the risks:
• Real funds will be involved
• Transaction fees are real costs
• Mistakes cannot be undone

Continue with caution.`}
        variant="danger"
        confirmText="Switch to Mainnet"
        cancelText="Stay on Testnet"
      />
    </>
  )
}
