'use client'

import { type ChangeEvent, useState } from 'react'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import type { PersonType } from '@/types'
import { usePersonUpdate } from '@/services/persons'

type EditPersonDataType = Partial<PersonType>

type EditUserInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onSuccess: (data: PersonType) => void
  person: PersonType
}

const UserEditDialog = ({ open, setOpen, onSuccess, person }: EditUserInfoProps) => {
  const [userData, setUserData] = useState<EditPersonDataType>({})

  const { mutate, loading } = usePersonUpdate(person.id)

  const handleClose = () => {
    setOpen(false)
    setUserData({})
  }

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return

    const response = await mutate({ data: userData })

    if (!response) return
    onSuccess?.(response)

    handleClose()
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Customer Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating user details will receive a privacy audit.
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Full Name'
                placeholder='Enter name of customer'
                defaultValue={person.fullName}
                value={userData?.fullName}
                onChange={e => setUserData({ ...userData, fullName: e.target.value })}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Phone number'
                placeholder='+998 ** *** ** **'
                defaultValue={person.phoneNumber}
                value={userData?.phoneNumber}
                onChange={e => setUserData({ ...userData, phoneNumber: e.target.value })}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button
            variant='contained'
            type='submit'
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color='inherit' /> : null}
          >
            {loading ? 'Updating...' : 'Submit'}
          </Button>

          <Button variant='tonal' color='secondary' type='reset' onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UserEditDialog
