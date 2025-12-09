'use client'

import React, { useEffect } from 'react'
import { RefreshCw, Plus, CheckSquare, Square } from 'lucide-react'
import { useWalletStore } from '@/store/wallet-store'
import { useUTXOStore } from '@/store/utxo-store'
import { getMempoolAPI } from '@/lib/api/mempool'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UTXOCard } from './UTXOCard'
import { AddUTXOForm } from './AddUTXOForm'

export function UTXOList() {
  const { address, network, isConnected } = useWalletStore()
  const { utxos, selectedUTXOs, isLoading, error, setUTXOs, setLoading, setError, selectAll, clearSelection } = useUTXOStore()
  const [showAddForm, setShowAddForm] = React.useState(false)

  const fetchUTXOs = async () => {
    if (!address) return

    try {
      setLoading(true)
      setError(null)

      const api = getMempoolAPI(network)
      const fetchedUTXOs = await api.getAddressUTXOs(address)

      setUTXOs(fetchedUTXOs)
    } catch (err: any) {
      console.error('Error fetching UTXOs:', err)
      setError(err.message || 'Failed to fetch UTXOs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchUTXOs()
    }
  }, [address, network, isConnected])

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-400">Connect your wallet to view UTXOs</p>
        </CardContent>
      </Card>
    )
  }

  const confirmedUTXOs = utxos.filter(u => u.status.confirmed)
  const pendingUTXOs = utxos.filter(u => !u.status.confirmed)
  const totalValue = utxos.reduce((sum, utxo) => sum + utxo.value, 0)
  const allSelected = utxos.length > 0 && selectedUTXOs.length === utxos.length

  const handleToggleSelectAll = () => {
    if (allSelected) {
      clearSelection()
    } else {
      selectAll()
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>UTXOs</CardTitle>
              <CardDescription>
                Manage your unspent transaction outputs
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Custom
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUTXOs}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {showAddForm && (
            <AddUTXOForm onSuccess={() => setShowAddForm(false)} />
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">Total UTXOs</p>
                <p className="text-2xl font-bold text-white">{utxos.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Confirmed</p>
                <p className="text-2xl font-bold text-[#10B981]">{confirmedUTXOs.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-[#F59E0B]">{pendingUTXOs.length}</p>
              </div>
            </div>

            {utxos.length > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleSelectAll}
                  className="gap-2"
                >
                  {allSelected ? (
                    <>
                      <CheckSquare className="h-4 w-4" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Square className="h-4 w-4" />
                      Select All
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="text-center py-8 text-gray-400">Loading UTXOs...</div>
          )}

          {!isLoading && utxos.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No UTXOs found for this address
            </div>
          )}

          {!isLoading && utxos.length > 0 && (
            <div className="max-h-[calc(100vh-28rem)] overflow-y-auto space-y-4 pr-2">
              {pendingUTXOs.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-yellow-300">Pending UTXOs</h3>
                  <div className="space-y-2">
                    {pendingUTXOs.map((utxo) => (
                      <UTXOCard key={`${utxo.txid}:${utxo.vout}`} utxo={utxo} />
                    ))}
                  </div>
                </div>
              )}

              {confirmedUTXOs.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-white">Confirmed UTXOs</h3>
                  <div className="space-y-2">
                    {confirmedUTXOs.map((utxo) => (
                      <UTXOCard key={`${utxo.txid}:${utxo.vout}`} utxo={utxo} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
