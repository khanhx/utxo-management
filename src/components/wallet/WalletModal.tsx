'use client'

import React, { useEffect, useState } from 'react'
import { X, ExternalLink, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useWalletStore } from '@/store/wallet-store'
import { getWalletManager } from '@/lib/wallets/wallet-manager'
import { WalletProvider, WalletInfo } from '@/types'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [wallets, setWallets] = useState<WalletInfo[]>([])
  const { setConnected, setError, setConnecting, error, network } = useWalletStore()

  useEffect(() => {
    if (isOpen) {
      const walletManager = getWalletManager()
      setWallets(walletManager.getAvailableWallets())
    }
  }, [isOpen])

  const handleConnect = async (walletProvider: WalletProvider) => {
    try {
      setConnecting(true)
      setError(null)

      const walletManager = getWalletManager()
      const address = await walletManager.connect(walletProvider)
      const publicKey = await walletManager.getPublicKey()

      setConnected(walletProvider, address, publicKey || '')
      onClose()
    } catch (error: any) {
      console.error('Connection error:', error)
      setError(error.message || 'Failed to connect wallet')
    } finally {
      setConnecting(false)
    }
  }

  if (!isOpen) return null

  const installedWallets = wallets.filter(w => w.installed)
  const notInstalledWallets = wallets.filter(w => !w.installed)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {network === 'mainnet' && (
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-300">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Warning: You are on MAINNET. Real Bitcoin will be used.</span>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-300">Available Wallets</h3>
            {installedWallets.length === 0 ? (
              <p className="text-sm text-gray-400">No wallets installed</p>
            ) : (
              <div className="space-y-2">
                {installedWallets.map((wallet) => (
                  <Button
                    key={wallet.name}
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-3 bg-white/5 hover:bg-white/10 border-white/10 hover:border-[#F59E0B]/50 transition-all"
                    onClick={() => handleConnect(wallet.name)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-8 w-8 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
                        <span className="text-xs font-semibold">
                          {wallet.displayName.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-white">{wallet.displayName}</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {notInstalledWallets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Not Installed</h3>
              <div className="space-y-2">
                {notInstalledWallets.map((wallet) => (
                  <div
                    key={wallet.name}
                    className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-400">
                          {wallet.displayName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-300">{wallet.displayName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(getWalletInstallUrl(wallet.name), '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function getWalletInstallUrl(wallet: WalletProvider): string {
  const urls: Record<WalletProvider, string> = {
    unisat: 'https://unisat.io',
    phantom: 'https://phantom.app',
    okx: 'https://www.okx.com/web3',
    metamask: 'https://metamask.io',
    bitget: 'https://web3.bitget.com',
  }
  return urls[wallet] || '#'
}
