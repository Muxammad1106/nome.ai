import { useState, useCallback } from 'react'

import { useModalContext } from '@/contexts/ModalContext'

interface UseModalStateReturn {
  open: boolean
  setOpen: (open: boolean) => void
  modalType: string
}

export const useModalState = (modalType: string): UseModalStateReturn => {
  const [open, setOpenState] = useState(false)
  const { setModalOpen } = useModalContext()

  const setOpen = useCallback(
    (newOpen: boolean) => {
      setOpenState(newOpen)
      setModalOpen(modalType, newOpen)
    },
    [modalType, setModalOpen]
  )

  return {
    open,
    setOpen,
    modalType
  }
}
