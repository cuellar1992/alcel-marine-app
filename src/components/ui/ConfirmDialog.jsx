/**
 * ConfirmDialog Component
 * Premium confirmation with Headless UI Dialog
 */

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AlertTriangle, Info, AlertCircle } from 'lucide-react'

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const typeStyles = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      iconBg: 'from-red-500/20 to-rose-500/20',
      iconBorder: 'border-red-500/40',
      glowColor: 'bg-red-500/30',
      confirmBtn: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
      iconBg: 'from-yellow-500/20 to-orange-500/20',
      iconBorder: 'border-yellow-500/40',
      glowColor: 'bg-yellow-500/30',
      confirmBtn: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg shadow-yellow-500/30'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      iconBg: 'from-blue-500/20 to-indigo-500/20',
      iconBorder: 'border-blue-400/40',
      glowColor: 'bg-blue-500/30',
      confirmBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30'
    }
  }

  const style = typeStyles[type] || typeStyles.danger
  const IconComponent = style.icon

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
        </Transition.Child>

        {/* Dialog container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/98 via-gray-800/98 to-slate-900/98 backdrop-blur-2xl shadow-2xl border border-white/10 transition-all">
                
                {/* Icon */}
                <div className="pt-8 pb-4 flex justify-center">
                  <div className={`relative bg-gradient-to-br ${style.iconBg} backdrop-blur-xl rounded-2xl p-6 border ${style.iconBorder}`}>
                    <div className={`absolute inset-0 ${style.glowColor} blur-2xl opacity-50`}></div>
                    <IconComponent className={`relative w-12 h-12 ${style.iconColor}`} strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 pb-6 text-center">
                  <Dialog.Title className="text-2xl font-bold text-white mb-3">
                    {title}
                  </Dialog.Title>
                  <Dialog.Description className="text-gray-300 leading-relaxed">
                    {message}
                  </Dialog.Description>
                </div>

                {/* Actions */}
                <div className="px-8 pb-8 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-slate-700/50 text-gray-300 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 border border-white/10 active:scale-95"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${style.confirmBtn}`}
                  >
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

