'use client'

import React, { useState, useEffect } from 'react'
import { X, Zap, TrendingUp, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { useWalletStore } from '@/store/wallet-store'
import { getMempoolAPI } from '@/lib/api/mempool'
import { RBFHandler } from '@/lib/bitcoin/rbf'
import { formatSatoshis } from '@/lib/utils/format'
import { Transaction } from '@/types'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'
import { useToast } from '@/components/ui/toast'
import { getWalletManager } from '@/lib/wallets/wallet-manager'
import { useTransactionStore } from '@/store/transaction-store'

interface RBFModalProps {
  txid: string
  isOpen: boolean
  onClose: () => void
}

export function RBFModal({ txid, isOpen, onClose }: RBFModalProps) {
  const { network } = useWalletStore()
  const { copy } = useCopyToClipboard()
  const { showToast } = useToast()
  const { setLastBroadcastTxid } = useTransactionStore()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newFeeRate, setNewFeeRate] = useState('')
  const [recommendedFee, setRecommendedFee] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchTransaction()
    }
  }, [isOpen, txid])

  const fetchTransaction = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const api = getMempoolAPI(network)
      const tx = await api.getTransaction(txid)
      setTransaction(tx)

      // Get recommended fee
      const rbfHandler = new RBFHandler(network, api)
      const feeBump = await rbfHandler.getRecommendedFeeBump(txid)

      // Calculate vsize and minimum fee required by BIP 125
      const vsize = Math.ceil(tx.weight / 4)
      const currentRate = parseFloat((tx.fee / vsize).toFixed(1))

      // Calculate BIP 125 minimum required fee
      const minFee = rbfHandler.calculateMinimumReplacementFee(tx.fee, tx.size, vsize)
      const minRequiredFeeRate = parseFloat((minFee / vsize).toFixed(1))

      // Use the highest of: mempool recommended, current + 1, or BIP 125 minimum
      const recommendedRate = Math.max(
        feeBump.recommendedFeeRate,
        currentRate + 1,
        minRequiredFeeRate
      )

      setRecommendedFee(recommendedRate)
      setNewFeeRate(recommendedRate.toString())

      // Check if transaction is confirmed
      if (tx.status.confirmed) {
        setError('Cannot replace confirmed transaction')
        return
      }

      // Show informational warning if RBF is not signaled
      if (!rbfHandler.isRBFEnabled(tx)) {
        setWarning('Note: This transaction was not originally marked for RBF. Most Bitcoin nodes will accept the replacement as long as it pays a higher fee.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load transaction')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReplacement = () => {
    if (!transaction) return
    setShowConfirmModal(true)
  }

  const confirmReplacement = async () => {
    if (!transaction) return

    try {
      setIsProcessing(true)
      setError(null)
      setShowConfirmModal(false)

      const api = getMempoolAPI(network)
      const rbfHandler = new RBFHandler(network, api)
      const walletManager = getWalletManager()

      const feeRateNum = parseFloat(newFeeRate)
      if (isNaN(feeRateNum) || feeRateNum <= 0) {
        throw new Error('Invalid fee rate')
      }

      // Build replacement transaction PSBT
      showToast('Creating replacement transaction...', 'info')
      const replacement = await rbfHandler.createReplacementTransaction(
        txid,
        feeRateNum
      )

      // Step 1: Sign PSBT with wallet
      showToast('Requesting wallet signature...', 'info')
      const signedPsbtHex = await walletManager.signPsbt(replacement.psbt)

      // Step 2: Broadcast the replacement transaction
      showToast('Broadcasting replacement transaction...', 'info')
      const newTxid = await walletManager.pushTransaction(signedPsbtHex)

      // Success!
      showToast(`Replacement transaction broadcast! TxID: ${newTxid.slice(0, 16)}...`, 'success')
      setLastBroadcastTxid(newTxid)

      onClose()
    } catch (err: any) {
      console.error('RBF error:', err)
      setError(err.message || 'Failed to broadcast replacement transaction')
      showToast(err.message || 'Failed to broadcast replacement transaction', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  // Calculate vsize from weight for accurate fee rate (SegWit transactions)
  const vsize = transaction ? Math.ceil(transaction.weight / 4) : 0
  const currentFeeRate = transaction && vsize > 0 ? parseFloat((transaction.fee / vsize).toFixed(1)) : 0
  const newFeeRateNum = parseFloat(newFeeRate) || 0
  const estimatedNewFee = vsize > 0 ? Math.ceil(vsize * newFeeRateNum) : 0
  const feeIncrease = estimatedNewFee - (transaction?.fee || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <h2 className="text-xl font-semibold">Replace Transaction (RBF)</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {isLoading && (
            <div className="text-center py-8 text-gray-400">
              Loading transaction...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300">
              {error}
            </div>
          )}

          {warning && !error && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-300">
              <p className="font-semibold mb-1">⚠️ Warning</p>
              {warning}
            </div>
          )}

          {transaction && !error && (
            <>
              <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Transaction ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white">{txid.slice(0, 16)}...</span>
                    <button
                      onClick={() => copy(txid, 'Transaction ID')}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Copy full transaction ID"
                    >
                      <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <Badge variant={transaction.status.confirmed ? 'success' : 'warning'}>
                    {transaction.status.confirmed ? 'Confirmed' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Fee:</span>
                  <span className="font-semibold text-white">{formatSatoshis(transaction.fee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Fee Rate:</span>
                  <span className="font-semibold text-white">{currentFeeRate} sat/vB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Size:</span>
                  <span className="font-semibold text-white">{transaction.size} bytes</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">New Fee Rate (sat/vB)</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewFeeRate(recommendedFee.toString())}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Use Recommended
                  </Button>
                </div>
                <Input
                  type="number"
                  value={newFeeRate}
                  onChange={(e) => setNewFeeRate(e.target.value)}
                  min={(currentFeeRate + 0.1).toFixed(1)}
                  step="0.1"
                />
                <p className="text-xs text-gray-400">
                  Recommended: {recommendedFee} sat/vB (fastest confirmation)
                </p>
              </div>

              {newFeeRateNum > currentFeeRate && (
                <div className="space-y-2 p-4 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">New Fee:</span>
                    <span className="font-semibold text-white">{formatSatoshis(estimatedNewFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Fee Increase:</span>
                    <span className="font-semibold text-[#10B981]">
                      +{formatSatoshis(feeIncrease)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">New Fee Rate:</span>
                    <span className="font-semibold text-white">{newFeeRateNum.toFixed(1)} sat/vB</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReplacement}
                  disabled={isProcessing || newFeeRateNum <= currentFeeRate}
                  className="flex-1"
                >
                  {isProcessing ? 'Processing...' : 'Replace Transaction'}
                </Button>
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <p>Note: Replace-By-Fee (RBF) replaces the original transaction with a new one that pays a higher fee.</p>
                <p>The replacement must use the same inputs and pay a higher fee rate.</p>
              </div>
            </>
          )}
        </div>
      </Card>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmReplacement}
        title="Replace Transaction with Higher Fee?"
        message={`You are about to replace this transaction with a higher fee rate.\n\nCurrent Fee Rate: ${currentFeeRate} sat/vB\nNew Fee Rate: ${newFeeRateNum.toFixed(1)} sat/vB\nFee Increase: +${formatSatoshis(feeIncrease)}\n\nThis action cannot be undone.`}
        variant="warning"
        confirmText="Replace Transaction"
        cancelText="Cancel"
      />
    </div>
  )
}
