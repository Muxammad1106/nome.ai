'use client'

import { type ChangeEvent, useState } from 'react'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'

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

const initialData: EditPersonDataType = {
  id: '13721752-5533-4969-4bc36-e4933f8e6d7e',
  image: '/media/people/213123_TAjF1Q9.jpg',
  age: 31,
  gender: 'Male',
  emotion: '\u0421\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u044b\u0439',
  bodyType: 'Normal',
  entryTime: '2025-10-17T23:48:27Z',
  exitTime: '2025-10-17T23:48:27Z'
}

const UserEditDialog = ({ open, setOpen,onSuccess, person }: EditUserInfoProps) => {
  const [userData, setUserData] = useState<EditPersonDataType>(person || initialData)

  const { mutate, loading } = usePersonUpdate(person.id)

  const handleClose = () => {
    setOpen(false)
    setUserData(person || initialData)
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
                value={userData?.fullName}
                onChange={e => setUserData({ ...userData, fullName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Phone number'
                placeholder='+998 ** *** ** **'
                value={userData?.phoneNumber}
                onChange={e => setUserData({ ...userData, phoneNumber: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UserEditDialog
