/**
 * Modal Component
 * Premium modal with Headless UI for better accessibility
 */

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'default',
  ...props 
}) {
  const sizes = {
    sm: 'max-w-md',
    default: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop with premium blur */}
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

        {/* Full-screen container */}
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
              <Dialog.Panel 
                className={`${sizes[size]} w-full transform overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/98 via-gray-800/98 to-slate-900/98 backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.15)] transition-all`}
                {...props}
              >
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      {title}
                    </Dialog.Title>
                    
                    <button
                      onClick={onClose}
                      className="group relative p-2 text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-lg"
                    >
                      <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Content with custom scrollbar */}
                <div className="px-6 py-6 max-h-[calc(90vh-100px)] overflow-y-auto">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

