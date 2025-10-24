/**
 * useConfirm Hook
 * Hook for managing confirmation dialogs
 */

import { useState } from 'react'

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  })

  const confirm = ({ title, message, onConfirm, type = 'danger' }) => {
    setConfig({ title, message, onConfirm, type })
    setIsOpen(true)
  }

  const handleConfirm = () => {
    config.onConfirm()
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    config,
    confirm,
    handleConfirm,
    handleClose
  }
}

