'use client'

import React, { useState } from 'react'
import { Heart, Copy } from 'lucide-react'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'

export function DonationBanner() {
  const { copy } = useCopyToClipboard()
  const [isExpanded, setIsExpanded] = useState(false)

  const evmAddress = '0x6cc25d12d3a5c7094e487d438f6f14205d105ff0'
  const bitcoinAddress = 'bc1qdnp9h5f855w8fey0u8xrg60c5pg3qh0srgrldk' // Replace with actual BTC address

  const handleCopy = (address: string, type: string) => {
    copy(address, `${type} address`)
  }

  return (
    <div
      className="fixed left-0 top-1/2 z-50 transition-transform duration-300 ease-in-out"
      style={{
        transform: isExpanded
          ? 'translateY(-50%) translateX(0)'
          : 'translateY(-50%) translateX(-480px)',
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center">
        {/* Main Panel */}
        <div className="glass-card p-6 rounded-r-2xl border-2 border-l-0 border-r-0 border-[#F59E0B]/20 w-[480px] backdrop-blur-xl bg-[#0A0F1E]/95 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Support This Project</h3>
                <p className="text-sm text-gray-400">
                  If you find this tool useful, consider supporting its development
                </p>
              </div>

              <div className="space-y-3">
                {/* EVM Address */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#8B5CF6] uppercase">EVM (ETH, BSC, etc.)</span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                    onClick={() => handleCopy(evmAddress, 'EVM')}
                  >
                    <code className="flex-1 text-xs font-mono text-gray-300 break-all">
                      {evmAddress}
                    </code>
                    <button className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded transition-colors">
                      <Copy className="h-4 w-4 text-gray-400 group-hover:text-[#8B5CF6]" />
                    </button>
                  </div>
                </div>

                {/* Bitcoin Address */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#F59E0B] uppercase">Bitcoin</span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                    onClick={() => handleCopy(bitcoinAddress, 'Bitcoin')}
                  >
                    <code className="flex-1 text-xs font-mono text-gray-300 break-all">
                      {bitcoinAddress}
                    </code>
                    <button className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded transition-colors">
                      <Copy className="h-4 w-4 text-gray-400 group-hover:text-[#F59E0B]" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic">
                Thank you for your support!
              </p>
            </div>
          </div>
        </div>

        {/* Tab - Always visible */}
        <div className="glass-card py-6 px-3 rounded-r-xl border-2 border-l-0 border-[#F59E0B]/20 backdrop-blur-xl bg-[#0A0F1E]/95 shadow-xl cursor-pointer hover:bg-[#F59E0B]/10 transition-colors">
          <div className="flex flex-col items-center gap-4">
            <div className="rotate-90">
              <Heart className="h-5 w-5 text-[#F59E0B] animate-pulse" />
            </div>
            <div
              className="whitespace-nowrap"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
              }}
            >
              <span className="text-sm font-semibold text-white">Support This Project</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
