'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import UserEditDialog from '@/components/dashboard/UserEditDialog'
import type { PersonType } from '@/types'
import { BACKEND_API } from '@/utils/request'

type UserDetailDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  person: PersonType
  onPersonUpdate?: (person: PersonType) => void
}

const UserDetailDialog = ({ open, setOpen, person, onPersonUpdate }: UserDetailDialogProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handlePersonUpdate = (updatedPerson: PersonType) => {
    onPersonUpdate?.(updatedPerson)
    setEditDialogOpen(false)
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Not available'

    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return 'Invalid date'
    }
  }

  const getEmotionColor = (emotion: string) => {
    const emotionLower = emotion.toLowerCase()

    if (emotionLower.includes('счастлив') || emotionLower.includes('happy')) return 'success'
    if (emotionLower.includes('грустн') || emotionLower.includes('sad')) return 'error'
    if (emotionLower.includes('злой') || emotionLower.includes('angry')) return 'error'
    if (emotionLower.includes('нейтральн') || emotionLower.includes('neutral')) return 'default'

    return 'primary'
  }

  const getBodyTypeColor = (bodyType: string) => {
    const typeLower = bodyType.toLowerCase()

    if (typeLower.includes('normal')) return 'success'
    if (typeLower.includes('overweight')) return 'warning'
    if (typeLower.includes('underweight')) return 'info'

    return 'default'
  }

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        maxWidth='lg'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        {/*
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          Customer Profile
          <Typography component='span' className='flex flex-col text-center text-body1'>
            Complete information about {person.fullName || 'this customer'}
          </Typography>
        </DialogTitle> */}

        <DialogContent className='overflow-visible pbs-12 sm:pli-12'>
          <Grid container spacing={4}>
            {/* Left Side - User Information */}
            <Grid item xs={12} md={5}>
              <Grid container spacing={2}>
                {/* Profile Image and Basic Info */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent className='text-center relative'>
                      <Box className='flex justify-center mbe-3'>
                        <img
                          src={person.image ? BACKEND_API + person.image : '/images/illustrations/characters/4.png'}
                          width={120}
                          height={120}
                          className='border-2 border-primary/20 object-contain p-1 rounded-full'
                        />
                      </Box>

                      <Typography variant='h6' className='mbe-1'>
                        {person.fullName || 'No Name Provided'}
                      </Typography>

                      {/* Emotion and Body Type Chips */}
                      <Box className='flex gap-2 justify-center mbe-2 flex-wrap'>
                        {person.emotion && (
                          <Chip
                            label={person.emotion}
                            color={getEmotionColor(person.emotion)}
                            size='small'
                            variant='outlined'
                          />
                        )}
                        {person.bodyType && (
                          <Chip
                            label={person.bodyType}
                            color={getBodyTypeColor(person.bodyType)}
                            size='small'
                            variant='outlined'
                          />
                        )}
                      </Box>

                      <Typography variant='caption' className='mbe-2'>
                        ID: {person.id}
                      </Typography>

                      <Button
                        className='absolute top-2 right-2'
                        variant='outlined'
                        startIcon={<i className='tabler-edit' />}
                        onClick={() => setEditDialogOpen(true)}
                        size='small'
                      >
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Personal Information */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant='subtitle1' className='flex items-center gap-2 mbe-2'>
                        <i className='tabler-user' />
                        Personal Information
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <CustomTextField
                            fullWidth
                            label='Full Name'
                            value={person.fullName || 'Not provided'}
                            variant='outlined'
                            size='small'
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomTextField
                            fullWidth
                            label='Phone'
                            value={person.phoneNumber || 'Not provided'}
                            variant='outlined'
                            size='small'
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomTextField
                            fullWidth
                            label='Gender'
                            value={person.gender || 'Not specified'}
                            variant='outlined'
                            size='small'
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Physical & Visit Info */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant='subtitle1' className='flex items-center gap-2 mbe-2'>
                        <i className='tabler-body-scan' />
                        Physical & Visit Details
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <CustomTextField
                            fullWidth
                            label='Age'
                            value={person.age?.toString() || 'N/A'}
                            variant='outlined'
                            size='small'
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <CustomTextField
                            fullWidth
                            label='Body Type'
                            value={person.bodyType || 'N/A'}
                            variant='outlined'
                            size='small'
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <CustomTextField
                            fullWidth
                            label='Emotion'
                            value={person.emotion || 'N/A'}
                            variant='outlined'
                            size='small'
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomTextField
                            fullWidth
                            label='Entry Time'
                            value={formatDateTime(person.entryTime)}
                            variant='outlined'
                            size='small'
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomTextField
                            fullWidth
                            label='Exit Time'
                            value={formatDateTime(person.exitTime)}
                            variant='outlined'
                            size='small'
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* System Information */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant='subtitle1' className='flex items-center gap-2 mbe-2'>
                        <i className='tabler-database' />
                        System Information
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <CustomTextField
                            fullWidth
                            label='Created'
                            value={formatDateTime(person.created_at)}
                            variant='outlined'
                            size='small'
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomTextField
                            fullWidth
                            label='Updated'
                            value={formatDateTime(person.updated_at)}
                            variant='outlined'
                            size='small'
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Right Side - AI Suggestions and Orders */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={3}>
                {/* AI Suggestions */}
                <Grid item xs={12}>
                  <Card className='h-full'>
                    <CardContent>
                      <Typography variant='h6' className='flex items-center gap-2 mbe-3'>
                        <i className='tabler-brain' />
                        AI Suggestions
                      </Typography>
                      <Box className='text-center py-8'>
                        <Typography variant='body1'>
                          AI-powered recommendations will appear here
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Order History */}
                <Grid item xs={12}>
                  <Card className='h-full'>
                    <CardContent>
                      <Typography variant='h6' className='flex items-center gap-2 mbe-3'>
                        <i className='tabler-shopping-cart' />
                        Order History
                      </Typography>
                      <Box className='text-center py-8'>
                        <Typography variant='body1'>
                          Order history will be displayed here
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <UserEditDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        person={person}
        onSuccess={handlePersonUpdate}
      />
    </>
  )
}

export default UserDetailDialog
