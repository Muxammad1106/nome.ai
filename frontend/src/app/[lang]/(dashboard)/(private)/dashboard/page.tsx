'use client'

import { useCallback, useState } from 'react'

import { Grid, CircularProgress, Typography, FormControlLabel, Switch, Box } from '@mui/material'

import type { PersonEventType, PersonType } from '../../../../../types'

import UserCard from '../../../../../components/dashboard/UserCard'
import PersonJoinModal from '../../../../../components/dashboard/PersonJoinModal'
import { useWebSocketPersonEvents } from '../../../../../hooks/useWebSocketPersonEvents'
import { usePersonJoinModalQueue } from '../../../../../hooks/usePersonJoinModalQueue'
import { usePersonActionList } from '../../../../../services/persons'
import { useModalContext } from '../../../../../contexts/ModalContext'

export default function Dashboard() {
  const { data: personList, setData: setPersonList, loading } = usePersonActionList()
  const { isAnyModalOpen } = useModalContext()

  // Feature toggle state
  const [isPersonJoinModalEnabled, setIsPersonJoinModalEnabled] = useState(true)

  // Person join modal queue system
  const { queue, currentModal, addPersonToQueue, closeCurrentModal, clearAllQueuedPersons, isModalOpen } =
    usePersonJoinModalQueue()

  const addPersonToFront = useCallback(
    (person: PersonType) => {
      setPersonList(prevData => {
        if (!prevData) {
          return {
            count: 1,
            results: [person]
          }
        }

        const filteredResults = prevData.results.filter(item => item.id !== person.id)
        const newCount = filteredResults.length + 1

        return {
          ...prevData,
          count: newCount,
          results: [person, ...filteredResults]
        }
      })
    },
    [setPersonList]
  )

  const handleMessage = useCallback(
    (data: PersonEventType) => {
      if (data.event === 'person_joined' && data.person) {
        addPersonToFront(data.person)

        // Add person to modal queue for information collection (only if feature is enabled and no other modals are open)
        if (isPersonJoinModalEnabled && !isAnyModalOpen && !data.person.fullName && !data.person.phoneNumber) {
          if (personList?.results.some(person => person.id === data.person.id)) return
          addPersonToQueue(data.person)
        }
      }
    },
    [addPersonToFront, addPersonToQueue, isPersonJoinModalEnabled, isAnyModalOpen] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const { isConnected } = useWebSocketPersonEvents({ onMessage: handleMessage })

  const handlePersonUpdate = useCallback(
    (updatedPerson: PersonType) => {
      setPersonList(prevData => {
        if (!prevData) {
          return {
            count: 1,
            results: [updatedPerson]
          }
        }

        const updatedResults = prevData.results.map(item => (item.id === updatedPerson.id ? updatedPerson : item))

        return {
          ...prevData,
          results: updatedResults
        }
      })
    },
    [setPersonList]
  )

  const handleModalPersonUpdate = useCallback(
    (updatedPerson: PersonType) => {
      handlePersonUpdate(updatedPerson)
      closeCurrentModal()
    },
    [handlePersonUpdate, closeCurrentModal]
  )

  const handleClearAllQueuedPersons = useCallback(() => {
    clearAllQueuedPersons()
  }, [clearAllQueuedPersons])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <Box>
            <Typography variant='h4'>Dashboard</Typography>
            <Typography>Real-time monitoring of customer interactions and restaurant activity.</Typography>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={isPersonJoinModalEnabled && !isAnyModalOpen}
                onChange={e => setIsPersonJoinModalEnabled(e.target.checked)}
                color='primary'
                disabled={isAnyModalOpen}
              />
            }
            label='Auto-show new customer modal'
            labelPlacement='start'
          />
        </Box>
      </Grid>

      {loading ? (
        <Grid item xs={12}>
          <div className='flex items-center justify-center gap-2 py-8'>
            <CircularProgress />
          </div>
        </Grid>
      ) : personList?.results?.length === 0 ? (
        <Grid item xs={12}>
          <div className='text-center py-8'>
            <p className='text-gray-500'>{isConnected ? 'Waiting for person events...' : 'Connecting...'}</p>
          </div>
        </Grid>
      ) : (
        personList?.results.map(person => (
          <Grid key={person.id} item xs={12} sm={6} md={4} lg={3}>
            <UserCard person={person} onPersonUpdate={handlePersonUpdate} />
          </Grid>
        ))
      )}

      {currentModal && (
        <PersonJoinModal
          open={isModalOpen}
          setOpen={closeCurrentModal}
          person={currentModal.person}
          onSuccess={handleModalPersonUpdate}
          queueCount={queue.length}
          onClearAll={handleClearAllQueuedPersons}
        />
      )}
    </Grid>
  )
}
