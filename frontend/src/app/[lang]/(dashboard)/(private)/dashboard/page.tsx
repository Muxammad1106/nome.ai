'use client'

import { useCallback } from 'react'

import { Grid, CircularProgress, Typography } from '@mui/material'

import type { PersonEventType, PersonType } from '../../../../../types'

import UserCard from '../../../../../components/dashboard/UserCard'
import { useWebSocketPersonEvents } from '../../../../../hooks/useWebSocketPersonEvents'
import { usePersonActionList } from '../../../../../services/persons'

export default function Dashboard() {
  const { data: personList, setData: setPersonList, loading } = usePersonActionList()

  // Utility function to remove person if exists and add to front
  const addPersonToFront = useCallback(
    (person: PersonType) => {
      setPersonList(prevData => {
        if (!prevData) {
          return {
            count: 1,
            results: [person]
          }
        }

        // Remove person if exists and add to front
        const filteredResults = prevData.results.filter(item => item.id !== person.id)
        const newCount = filteredResults.length + 1

        return {
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
          count: prevData.count,
          results: updatedResults
        }
      })
    },
    [setPersonList]
  )

  return (
    <Grid container spacing={6}>
      {loading ? (
        <Grid item xs={12}>
          <div className='flex items-center justify-center gap-2 py-8'>
            <CircularProgress />
            <Typography>Loading...</Typography>
          </div>
        </Grid>
      ) : personList?.count === 0 ? (
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
