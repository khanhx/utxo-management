'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useUTXOStore } from '@/store/utxo-store'
import { isValidTxid, isValidVout, isValidAmount, isValidScriptPubKey } from '@/lib/utils/validation'

interface AddUTXOFormProps {
  onSuccess?: () => void
}

export function AddUTXOForm({ onSuccess }: AddUTXOFormProps) {
  const [txid, setTxid] = useState('')
  const [vout, setVout] = useState('')
  const [value, setValue] = useState('')
  const [scriptPubKey, setScriptPubKey] = useState('')
  const [error, setError] = useState('')

  const { addCustomUTXO } = useUTXOStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate inputs
    if (!isValidTxid(txid)) {
      setError('Invalid transaction ID (must be 64 hex characters)')
      return
    }

    const voutNum = parseInt(vout)
    if (!isValidVout(voutNum)) {
      setError('Invalid output index')
      return
    }

    const valueNum = parseInt(value)
    if (!isValidAmount(valueNum)) {
      setError('Invalid value (must be positive integer in satoshis)')
      return
    }

    if (scriptPubKey && !isValidScriptPubKey(scriptPubKey)) {
      setError('Invalid script pubkey (must be hex)')
      return
    }

    try {
      // Add custom UTXO
      addCustomUTXO({
        txid,
        vout: voutNum,
        value: valueNum,
        status: {
          confirmed: false, // Custom UTXOs are marked as unconfirmed
        },
        scriptPubKey: scriptPubKey || undefined,
      })

      // Reset form
      setTxid('')
      setVout('')
      setValue('')
      setScriptPubKey('')

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add UTXO')
    }
  }

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="font-semibold text-sm">Add Custom UTXO</h3>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="txid">Transaction ID</Label>
          <Input
            id="txid"
            type="text"
            placeholder="64-character hex string"
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
            required
            className="font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vout">Output Index (vout)</Label>
            <Input
              id="vout"
              type="number"
              placeholder="0"
              value={vout}
              onChange={(e) => setVout(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value (satoshis)</Label>
            <Input
              id="value"
              type="number"
              placeholder="100000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              min="1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="script">Script PubKey (optional)</Label>
          <Input
            id="script"
            type="text"
            placeholder="Hex-encoded script"
            value={scriptPubKey}
            onChange={(e) => setScriptPubKey(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <Button type="submit" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add UTXO
        </Button>
      </form>
    </Card>
  )
}
