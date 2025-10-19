'use client'

import { useCallback } from 'react'

import { Grid, CircularProgress, Typography } from '@mui/material'

import type { PersonEventType, PersonType } from '../../../../../types'

import UserCard from '../../../../../components/dashboard/UserCard'
import { useWebSocketPersonEvents } from '../../../../../hooks/useWebSocketPersonEvents'
import { usePersonInfiniteScrollList } from '../../../../../services/persons'
import { useScrollToBottom } from '../../../../../hooks/useScrollToBottom'

export default function Dashboard() {
  const {
    data: personList,
    setData: setPersonList,
    loading,
    loadingMore,
    loadMore,
    hasNextPage
  } = usePersonInfiniteScrollList(20)

  // Scroll detection for infinite scroll
  useScrollToBottom({
    threshold: 200,
    onReachBottom: loadMore,
    enabled: hasNextPage && !loadingMore
  })

  // Utility function to remove person if exists and add to front
  const addPersonToFront = useCallback(
    (person: PersonType) => {
      setPersonList(prevData => {
        if (!prevData) {
          return {
            count: 1,
            results: [person],
            currentPage: 1,
            hasNextPage: false,
            totalPages: 1
          }
        }

        // Remove person if exists and add to front
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
            results: [updatedPerson],
            currentPage: 1,
            hasNextPage: false,
            totalPages: 1
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
        <>
          {personList?.results.map(person => (
            <Grid key={person.id} item xs={12} sm={6} md={4} lg={3}>
              <UserCard person={person} onPersonUpdate={handlePersonUpdate} />
            </Grid>
          ))}

          {/* Loading more indicator */}
          {loadingMore && (
            <Grid item xs={12}>
              <div className='flex items-center justify-center gap-2 py-4'>
                <CircularProgress size={20} />
                <Typography variant='body2'>Loading more persons...</Typography>
              </div>
            </Grid>
          )}

          {/* End of list indicator */}
          {!hasNextPage && personList?.results && personList.results.length > 0 && (
            <Grid item xs={12}>
              <div className='text-center py-4'>
                <Typography variant='body2' color='text.secondary'>
                  You&apos;ve reached the end of the list
                </Typography>
              </div>
            </Grid>
          )}
        </>
      )}
    </Grid>
  )
}
