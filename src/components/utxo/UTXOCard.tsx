'use client'

import React, { useState } from 'react'
import { ExternalLink, Trash2, Zap } from 'lucide-react'
import { UTXO } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { useUTXOStore } from '@/store/utxo-store'
import { useWalletStore } from '@/store/wallet-store'
import { formatBTC, formatSatoshis, truncateTxid } from '@/lib/utils/format'
import { RBFModal } from '@/components/rbf/RBFModal'

interface UTXOCardProps {
  utxo: UTXO
}

export function UTXOCard({ utxo }: UTXOCardProps) {
  const { network } = useWalletStore()
  const { selectedUTXOs, selectUTXO, deselectUTXO, removeUTXO } = useUTXOStore()
  const [showRBFModal, setShowRBFModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)

  const isSelected = selectedUTXOs.includes(`${utxo.txid}:${utxo.vout}`)
  const isPending = !utxo.status.confirmed

  const handleSelect = () => {
    if (isSelected) {
      deselectUTXO(utxo.txid, utxo.vout)
    } else {
      selectUTXO(utxo.txid, utxo.vout)
    }
  }

  const handleRemove = () => {
    setShowRemoveModal(true)
  }

  const confirmRemove = () => {
    removeUTXO(utxo.txid, utxo.vout)
  }

  const getTxExplorerUrl = () => {
    const baseUrl = network === 'mainnet'
      ? 'https://mempool.space'
      : 'https://mempool.space/testnet4'
    return `${baseUrl}/tx/${utxo.txid}`
  }

  return (
    <>
      <Card
        className={`p-4 transition-all cursor-pointer ${
          isSelected
            ? 'border-[#F59E0B] bg-[#F59E0B]/10 glow-primary'
            : isPending
            ? 'border-yellow-500/50 bg-yellow-500/5'
            : 'hover:border-white/20'
        }`}
        onClick={handleSelect}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-medium">
                  {truncateTxid(utxo.txid)}:{utxo.vout}
                </span>
                {isPending && <Badge variant="warning">Pending</Badge>}
                {isSelected && <Badge variant="default">Selected</Badge>}
              </div>
              <p className="text-xs text-gray-400">
                {utxo.status.block_height
                  ? `Block ${utxo.status.block_height}`
                  : 'Unconfirmed'}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {isPending && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowRBFModal(true)
                  }}
                  title="Replace with higher fee (RBF)"
                >
                  <Zap className="h-4 w-4 text-yellow-600" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(getTxExplorerUrl(), '_blank')
                }}
                title="View in explorer"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                title="Remove"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{formatBTC(utxo.value)}</p>
              <p className="text-sm text-gray-400">BTC</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-[#F59E0B]">{formatSatoshis(utxo.value)}</p>
            </div>
          </div>

          {utxo.scriptPubKey && (
            <div className="text-xs">
              <p className="text-gray-400">Script</p>
              <p className="font-mono text-gray-300 truncate">{utxo.scriptPubKey}</p>
            </div>
          )}
        </div>
      </Card>

      {showRBFModal && (
        <RBFModal
          txid={utxo.txid}
          isOpen={showRBFModal}
          onClose={() => setShowRBFModal(false)}
        />
      )}

      <ConfirmationModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={confirmRemove}
        title="Remove UTXO?"
        message={`Are you sure you want to remove this UTXO from your list?\n\nTransaction: ${truncateTxid(utxo.txid)}:${utxo.vout}\nAmount: ${formatSatoshis(utxo.value)}\n\nThis will only remove it from the UI, not from the blockchain.`}
        variant="danger"
        confirmText="Remove UTXO"
        cancelText="Cancel"
      />
    </>
  )
}
