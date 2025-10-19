'use client'

import { useCallback } from 'react'

import { Grid, CircularProgress, Typography } from '@mui/material'

import type { PersonEventType, PersonType } from '../../../../../types'

import UserCard from '../../../../../components/dashboard/UserCard'
import { useWebSocketPersonEvents } from '../../../../../hooks/useWebSocketPersonEvents'
import { usePersonActionList } from '../../../../../services/persons'

export default function Dashboard() {
  const { data: personList, setData: setPersonList, loading } = usePersonActionList()

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
      }
    },
    [addPersonToFront]
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Dashboard</Typography>
        <Typography>Real-time monitoring of customer interactions and restaurant activity.</Typography>
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
    </Grid>
  )
}
