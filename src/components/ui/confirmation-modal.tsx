'use client'

import React from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { Button } from './button'
import { Card } from './card'

type ModalType = 'confirm' | 'alert' | 'info'
type Variant = 'default' | 'warning' | 'danger' | 'success'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  type?: ModalType
  variant?: Variant
  confirmText?: string
  cancelText?: string
}

const variantStyles = {
  default: {
    icon: Info,
    iconColor: 'text-[#8B5CF6]',
    bgColor: 'bg-[#8B5CF6]/10',
    borderColor: 'border-[#8B5CF6]/30',
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
  danger: {
    icon: AlertCircle,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-[#10B981]',
    bgColor: 'bg-[#10B981]/10',
    borderColor: 'border-[#10B981]/30',
  },
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'confirm',
  variant = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const style = variantStyles[variant]
  const Icon = style.icon

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <Card className="w-full max-w-lg animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className={`flex-shrink-0 p-3 rounded-full ${style.bgColor} ${style.borderColor} border`}>
                <Icon className={`h-6 w-6 ${style.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex-shrink-0 -mt-1 -mr-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-3">
            {type === 'confirm' && (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1"
                  variant={variant === 'danger' ? 'destructive' : 'default'}
                >
                  {confirmText}
                </Button>
              </>
            )}
            {type === 'alert' && (
              <Button onClick={onClose} className="w-full">
                OK
              </Button>
            )}
            {type === 'info' && (
              <Button onClick={onClose} className="w-full" variant="outline">
                Close
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
