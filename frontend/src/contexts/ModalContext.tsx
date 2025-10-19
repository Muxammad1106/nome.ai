'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface ModalContextType {
  isAnyModalOpen: boolean
  setModalOpen: (modalType: string, isOpen: boolean) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [openModals, setOpenModals] = useState<Set<string>>(new Set())

  const setModalOpen = useCallback((modalType: string, isOpen: boolean) => {
    setOpenModals(prev => {
      const newSet = new Set(prev)

      if (isOpen) {
        newSet.add(modalType)
      } else {
        newSet.delete(modalType)
      }

      return newSet
    })
  }, [])

  const isAnyModalOpen = openModals.size > 0

  return <ModalContext.Provider value={{ isAnyModalOpen, setModalOpen }}>{children}</ModalContext.Provider>
}

export const useModalContext = () => {
  const context = useContext(ModalContext)

  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider')
  }

  return context
}
