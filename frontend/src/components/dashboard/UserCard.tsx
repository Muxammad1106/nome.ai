import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Chip } from '@mui/material'

import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import UserEditDialog from '@/components/dashboard/UserEditDialog'
import UserDetailDialog from '@/components/dashboard/UserDetailDialog'
import type { PersonType } from '@/types'
import { BACKEND_API } from '@/utils/request'

type Props = {
  person: PersonType
  onPersonUpdate?: (person: PersonType) => void
}

const UserCard = ({ person, onPersonUpdate }: Props) => {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const firstTime = !person.fullName

  const toggleDetailDialog = () => {
    setDetailDialogOpen(true)
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-4'>
        <div
          className='flex justify-center items-center pli-2.5 pbs-4 rounded border relative cursor-pointer w-full h-full'
          onClick={toggleDetailDialog}
        >
          <img
            src={person.image ? BACKEND_API + person.image : 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Image.png'}
            className='bs-[146px] w-full object-contain'
          />

          {firstTime ? (
            <Chip className='absolute top-1 right-1' variant='filled' label='New' size='small' color='primary' />
          ) : null}
        </div>
        <div>
          {firstTime ? (
            <div className='flex justify-between gap-1'>
              <div className='flex-1'>
                <Typography variant='h5' className='mbe-2 text-gray-500'>
                  {person.fullName || 'No name provided'}
                </Typography>
                <Typography variant='body2' className='text-gray-500'>
                  {person.bodyType}
                </Typography>
              </div>

              <OpenDialogOnElementClick
                element={Button}
                elementProps={{
                  className: 'w-fit h-fit',
                  variant: 'tonal',
                  size: 'small',
                  children: <i className='tabler-edit' />
                }}
                dialogProps={{ person, onSuccess: onPersonUpdate }}
                dialog={UserEditDialog}
              />
            </div>
          ) : (
            <>
              <Typography variant='h5' className='mbe-2'>
                {person.fullName}
              </Typography>
              <Typography variant='body2'>{person.bodyType}</Typography>
            </>
          )}
        </div>
      </CardContent>

      <UserDetailDialog
        open={detailDialogOpen}
        setOpen={setDetailDialogOpen}
        person={person}
        onPersonUpdate={onPersonUpdate}
      />
    </Card>
  )
}

export default UserCard
