'use client'

import React, { useState } from 'react'
import { Send, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { useWalletStore } from '@/store/wallet-store'
import { useUTXOStore } from '@/store/utxo-store'
import { useTransactionStore } from '@/store/transaction-store'
import { TransactionBuilder as TxBuilder } from '@/lib/bitcoin/transaction'
import { FeeEstimator } from '@/lib/bitcoin/fee-estimator'
import { getMempoolAPI } from '@/lib/api/mempool'
import { getWalletManager } from '@/lib/wallets/wallet-manager'
import { isValidBitcoinAddress } from '@/lib/utils/validation'
import { formatSatoshis } from '@/lib/utils/format'
import { useToast } from '@/components/ui/toast'

interface OutputField {
  id: string
  address: string
  value: string
}

export function TransactionBuilder() {
  const { network } = useWalletStore()
  const { utxos, selectedUTXOs, clearSelection } = useUTXOStore()
  const { setError, setBroadcasting, setLastBroadcastTxid } = useTransactionStore()
  const { showToast } = useToast()

  const [outputs, setOutputs] = useState<OutputField[]>([
    { id: '1', address: '', value: '' },
  ])
  const [feeRate, setFeeRate] = useState('5')
  const [totalFee, setTotalFee] = useState('')
  const [enableRBF, setEnableRBF] = useState(true)
  const [isBuilding, setIsBuilding] = useState(false)
  const [txHex, setTxHex] = useState<string | null>(null)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)

  const selectedUTXOsList = utxos.filter(u =>
    selectedUTXOs.includes(`${u.txid}:${u.vout}`)
  )

  const totalInput = selectedUTXOsList.reduce((sum, utxo) => sum + utxo.value, 0)
  const totalOutput = outputs.reduce((sum, output) =>
    sum + (parseInt(output.value) || 0), 0
  )

  const addOutput = () => {
    setOutputs([...outputs, { id: Date.now().toString(), address: '', value: '' }])
  }

  const removeOutput = (id: string) => {
    setOutputs(outputs.filter(o => o.id !== id))
  }

  const updateOutput = (id: string, field: 'address' | 'value', value: string) => {
    setOutputs(outputs.map(o =>
      o.id === id ? { ...o, [field]: value } : o
    ))
  }

  const setMaxAmount = (outputId: string) => {
    // Calculate total output for other outputs
    const otherOutputsTotal = outputs
      .filter(o => o.id !== outputId)
      .reduce((sum, o) => sum + (parseInt(o.value) || 0), 0)

    // Estimate fee
    const feeRateNum = parseFloat(feeRate) || 5
    const estimatedSize = 10 + (selectedUTXOsList.length * 148) + (outputs.length * 34) + 10
    const estimatedFee = Math.ceil(estimatedSize * feeRateNum)

    // Calculate max amount for this output
    const maxAmount = Math.max(0, totalInput - otherOutputsTotal - estimatedFee)

    updateOutput(outputId, 'value', maxAmount.toString())
  }

  const formatNumberInput = (value: string): string => {
    // Remove non-numeric characters except for leading digits
    const numericValue = value.replace(/[^\d]/g, '')
    if (!numericValue) return ''

    // Convert to number and format with commas
    return parseInt(numericValue).toLocaleString('en-US')
  }

  const parseNumberInput = (value: string): string => {
    // Remove commas and return plain number string
    return value.replace(/,/g, '')
  }

  // Calculate estimated transaction size
  const estimatedTxSize = (() => {
    const inputCount = selectedUTXOsList.length
    const outputCount = outputs.filter(o => o.address && o.value).length
    if (inputCount === 0 || outputCount === 0) return 0
    // Rough estimation: 10 bytes overhead + 148 bytes per input + 34 bytes per output + 10 bytes
    return 10 + (inputCount * 148) + (outputCount * 34) + 10
  })()

  // Handler for fee rate changes
  const handleFeeRateChange = (newFeeRate: string) => {
    setFeeRate(newFeeRate)
    const feeRateNum = parseFloat(newFeeRate)
    if (!isNaN(feeRateNum) && estimatedTxSize > 0) {
      const calculatedFee = Math.ceil(estimatedTxSize * feeRateNum)
      setTotalFee(calculatedFee.toString())
    } else {
      setTotalFee('')
    }
  }

  // Handler for total fee changes
  const handleTotalFeeChange = (newTotalFee: string) => {
    setTotalFee(newTotalFee)
    const feeNum = parseInt(newTotalFee)
    if (!isNaN(feeNum) && estimatedTxSize > 0) {
      const calculatedFeeRate = (feeNum / estimatedTxSize).toFixed(1)
      setFeeRate(calculatedFeeRate)
    } else {
      setFeeRate('')
    }
  }

  const buildTransaction = async () => {
    setError(null)

    // Validation
    if (selectedUTXOsList.length === 0) {
      setError('Please select at least one UTXO')
      return
    }

    const validOutputs = outputs.filter(o => o.address && o.value)
    if (validOutputs.length === 0) {
      setError('Please add at least one output')
      return
    }

    for (const output of validOutputs) {
      if (!isValidBitcoinAddress(output.address, network)) {
        setError(`Invalid ${network} address: ${output.address}`)
        return
      }
    }

    try {
      setIsBuilding(true)

      const txBuilder = new TxBuilder(network)
      const feeRateNum = parseFloat(feeRate)

      const inputs = selectedUTXOsList.map(u => ({
        txid: u.txid,
        vout: u.vout,
        value: u.value,
        scriptPubKey: u.scriptPubKey,
      }))

      const txOutputs = validOutputs.map(o => ({
        address: o.address,
        value: parseInt(o.value),
      }))

      // Check if we have enough funds
      const estimatedSize = txBuilder.estimateSize(inputs.length, txOutputs.length)
      const estimatedFee = Math.ceil(estimatedSize * feeRateNum)

      if (totalInput < totalOutput + estimatedFee) {
        setError(`Insufficient funds. Need ${totalOutput + estimatedFee} sats, have ${totalInput} sats`)
        return
      }

      // Create PSBT for wallet signing
      const psbtHex = txBuilder.createPSBT({
        inputs,
        outputs: txOutputs,
        feeRate: feeRateNum,
        enableRBF,
      })

      setTxHex(psbtHex)
    } catch (err: any) {
      setError(err.message || 'Failed to build transaction')
    } finally {
      setIsBuilding(false)
    }
  }

  const handleBroadcast = () => {
    if (!txHex) return
    setShowBroadcastModal(true)
  }

  const confirmBroadcast = async () => {
    if (!txHex) return

    try {
      setBroadcasting(true)
      setError(null)
      setShowBroadcastModal(false)

      const walletManager = getWalletManager()

      // Step 1: Sign PSBT with wallet
      showToast('Requesting wallet signature...', 'info')
      const signedPsbtHex = await walletManager.signPsbt(txHex)

      // Step 2: Broadcast the signed transaction
      showToast('Broadcasting transaction...', 'info')
      const txid = await walletManager.pushTransaction(signedPsbtHex)

      // Success!
      showToast(`Transaction broadcast successfully! TxID: ${txid.slice(0, 16)}...`, 'success')
      setLastBroadcastTxid(txid)

      // Clear selection and reset form
      clearSelection()
      setOutputs([{ id: '1', address: '', value: '' }])
      setTxHex(null)
    } catch (err: any) {
      console.error('Broadcast error:', err)
      setError(err.message || 'Failed to broadcast transaction')
      showToast(err.message || 'Failed to broadcast transaction', 'error')
    } finally {
      setBroadcasting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Transaction</CardTitle>
        <CardDescription>
          Create and broadcast Bitcoin transactions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Selected UTXOs:</span>
            <span className="font-semibold text-white">{selectedUTXOsList.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Input:</span>
            <span className="font-semibold text-[#10B981]">{formatSatoshis(totalInput)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Output:</span>
            <span className="font-semibold text-white">{formatSatoshis(totalOutput)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Estimated Fee:</span>
            <span className="font-semibold text-[#F59E0B]">
              {formatSatoshis(Math.max(0, totalInput - totalOutput))}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Outputs</h3>
            <Button variant="outline" size="sm" onClick={addOutput}>
              <Plus className="h-4 w-4 mr-1" />
              Add Output
            </Button>
          </div>

          {outputs.map((output, index) => (
            <Card key={output.id} className="p-4 bg-white/5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Output {index + 1}</span>
                  {outputs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOutput(output.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Address</Label>
                  <Input
                    placeholder="Bitcoin address"
                    value={output.address}
                    onChange={(e) => updateOutput(output.id, 'address', e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Amount (satoshis)</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="0"
                      value={formatNumberInput(output.value)}
                      onChange={(e) => {
                        const numericValue = parseNumberInput(e.target.value)
                        updateOutput(output.id, 'value', numericValue)
                      }}
                      className="pr-16"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setMaxAmount(output.id)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-3 text-xs font-semibold text-[#F59E0B] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10"
                    >
                      MAX
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Fee Rate (sat/vB)</Label>
              <Input
                type="number"
                value={feeRate}
                onChange={(e) => handleFeeRateChange(e.target.value)}
                min="1"
                step="0.1"
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Total Fee (sats)</Label>
              <Input
                type="text"
                value={formatNumberInput(totalFee)}
                onChange={(e) => {
                  const numericValue = parseNumberInput(e.target.value)
                  handleTotalFeeChange(numericValue)
                }}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Options</Label>
            <div className="flex items-center gap-2 h-10">
              <input
                type="checkbox"
                id="rbf"
                checked={enableRBF}
                onChange={(e) => setEnableRBF(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#F59E0B] focus:ring-[#F59E0B] focus:ring-offset-0"
              />
              <label htmlFor="rbf" className="text-sm text-gray-300">
                Enable RBF (Replace-By-Fee)
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={buildTransaction}
            disabled={isBuilding || selectedUTXOsList.length === 0}
            className="flex-1"
          >
            {isBuilding ? 'Building...' : 'Build Transaction'}
          </Button>

          {txHex && (
            <Button
              onClick={handleBroadcast}
              variant="default"
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Sign & Broadcast
            </Button>
          )}
        </div>
      </CardContent>

      <ConfirmationModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        onConfirm={confirmBroadcast}
        title="Broadcast Transaction?"
        message={`You are about to broadcast this transaction on ${network}.\n\nInputs: ${selectedUTXOsList.length}\nOutputs: ${outputs.filter(o => o.address && o.value).length}\nEstimated Fee: ~${formatSatoshis(Math.ceil(totalInput - totalOutput))}\n\nThis action cannot be undone.`}
        variant="warning"
        confirmText="Broadcast Transaction"
        cancelText="Cancel"
      />
    </Card>
  )
}
