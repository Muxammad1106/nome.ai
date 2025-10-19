'use client'

import { type ChangeEvent, useState } from 'react'

import { toast } from 'react-toastify'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'

import UserAvatar from './UserAvatar'
import type { PersonType } from '@/types'
import { usePersonUpdate } from '@/services/persons'

type PersonJoinModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  person: PersonType
  onSuccess: (data: PersonType) => void
  queueCount?: number
  onClearAll?: () => void
}

const PersonJoinModal = ({ open, setOpen, person, onSuccess, queueCount = 0, onClearAll }: PersonJoinModalProps) => {
  const [userData, setUserData] = useState<Partial<PersonType>>({
    fullName: person.fullName || '',
    phoneNumber: person.phoneNumber || ''
  })

  const { mutate, loading } = usePersonUpdate(person.id)

  const handleClose = () => {
    setOpen(false)
    setUserData({
      fullName: person.fullName || '',
      phoneNumber: person.phoneNumber || ''
    })
  }

  const handleCloseAndClearAll = () => {
    onClearAll?.()
    setUserData({
      fullName: person.fullName || '',
      phoneNumber: person.phoneNumber || ''
    })
  }

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return

    // Only send fields that have values
    const dataToUpdate: Partial<PersonType> = {}

    if (userData.fullName && userData.fullName.trim()) {
      dataToUpdate.fullName = userData.fullName.trim()
    }

    if (userData.phoneNumber && userData.phoneNumber.trim()) {
      dataToUpdate.phoneNumber = userData.phoneNumber.trim()
    }

    if (Object.keys(dataToUpdate).length === 0) {
      toast.warning('Please fill in at least one field')

      return
    }

    const response = await mutate({ data: dataToUpdate })

    if (!response) return

    onSuccess?.(response)
    toast.success('Customer information saved successfully')
    handleClose()
  }

  const handleSkip = () => {
    // toast.info('Skipped saving customer information')
    handleClose()
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleCloseAndClearAll} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        New Customer Detected
        <Typography component='span' className='flex flex-col text-center'>
          A new customer has entered the restaurant. Please add their information if available.
        </Typography>
        {queueCount > 0 && (
          <Box className='flex justify-center mt-2'>
            <Chip
              label={`${queueCount} more customer${queueCount > 1 ? 's' : ''} waiting`}
              color='primary'
              variant='outlined'
              size='small'
            />
          </Box>
        )}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={6}>
            {/* Large Image Section */}
            <Grid item xs={12} md={5}>
              <Box className='flex flex-col items-center gap-4'>
                <UserAvatar
                  image={person.image}
                  className='bs-[300px] min-h-[300px] min-w-[300px] w-full object-cover rounded-lg border-2 border-gray-200'
                  alt={`${person.fullName || 'New customer'} avatar`}
                />
                <Box className='text-center'>
                  <Typography variant='h6' className='text-gray-600'>
                    Detected at {new Date(person.entryTime).toLocaleTimeString()}
                  </Typography>
                  {person.age && (
                    <Typography variant='body2' className='text-gray-500'>
                      Estimated age: {person.age} years
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Form Section */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    label='Full Name'
                    placeholder='Enter customer name'
                    value={userData.fullName || ''}
                    onChange={e => setUserData({ ...userData, fullName: e.target.value })}
                    disabled={loading}
                    helperText='Customer name for identification'
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    label='Phone Number'
                    placeholder='+998 ** *** ** **'
                    value={userData.phoneNumber || ''}
                    onChange={e => setUserData({ ...userData, phoneNumber: e.target.value })}
                    disabled={loading}
                    helperText='Phone number for contact purposes'
                  />
                </Grid>

                {/* Additional Info Display */}
                <Grid item xs={12}>
                  <Box className='p-4 bg-gray-50 rounded-lg'>
                    <Typography variant='subtitle2' className='mb-2 text-gray-700'>
                      Detected Information:
                    </Typography>
                    <Grid container spacing={2}>
                      {person.gender && (
                        <Grid item xs={6}>
                          <Typography variant='body2'>
                            <strong>Gender:</strong> {person.gender}
                          </Typography>
                        </Grid>
                      )}
                      {person.emotion && (
                        <Grid item xs={6}>
                          <Typography variant='body2'>
                            <strong>Mood:</strong> {person.emotion}
                          </Typography>
                        </Grid>
                      )}
                      {person.bodyType && (
                        <Grid item xs={6}>
                          <Typography variant='body2'>
                            <strong>Body Type:</strong> {person.bodyType}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 gap-4'>
          <Button
            variant='contained'
            type='submit'
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color='inherit' /> : null}
            size='large'
          >
            {loading ? 'Saving...' : 'Save Information'}
          </Button>

          <Button variant='tonal' color='secondary' onClick={handleSkip} disabled={loading} size='large'>
            Skip for Now
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PersonJoinModal
