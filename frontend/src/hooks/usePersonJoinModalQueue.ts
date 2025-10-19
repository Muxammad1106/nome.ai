import { useState, useCallback } from 'react'

import type { PersonType } from '@/types'

interface PersonJoinModalQueue {
  id: string
  person: PersonType
}

interface UsePersonJoinModalQueueReturn {
  queue: PersonJoinModalQueue[]
  currentModal: PersonJoinModalQueue | null
  addPersonToQueue: (person: PersonType) => void
  closeCurrentModal: () => void
  clearAllQueuedPersons: () => void
  isModalOpen: boolean
}

export const usePersonJoinModalQueue = (): UsePersonJoinModalQueueReturn => {
  const [queue, setQueue] = useState<PersonJoinModalQueue[]>([])
  const [currentModal, setCurrentModal] = useState<PersonJoinModalQueue | null>(null)

  const addPersonToQueue = useCallback(
    (person: PersonType) => {
      const modalQueueItem: PersonJoinModalQueue = {
        id: `${person.id}-${Date.now()}`, // Unique ID for queue item
        person
      }

      setQueue(prevQueue => {
        const newQueue = [...prevQueue, modalQueueItem]

        // If no modal is currently open, open the first one
        if (!currentModal) {
          setCurrentModal(newQueue[0])

          return newQueue.slice(1)
        }

        return newQueue
      })
    },
    [currentModal]
  )

  const closeCurrentModal = useCallback(() => {
    setCurrentModal(null)

    // Open next modal in queue if available
    setQueue(prevQueue => {
      if (prevQueue.length > 0) {
        setCurrentModal(prevQueue[0])

        return prevQueue.slice(1)
      }

      return prevQueue
    })
  }, [])

  const clearAllQueuedPersons = useCallback(() => {
    setCurrentModal(null)
    setQueue([])
  }, [])

  const isModalOpen = currentModal !== null

  return {
    queue,
    currentModal,
    addPersonToQueue,
    closeCurrentModal,
    clearAllQueuedPersons,
    isModalOpen
  }
}
