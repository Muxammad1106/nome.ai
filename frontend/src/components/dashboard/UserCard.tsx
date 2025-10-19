import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Chip } from '@mui/material'

import OpenDialogOnElementClick from '../dialogs/OpenDialogOnElementClick'
import UserEditDialog from './UserEditDialog'
import UserDetailDialog from './UserDetailDialog'
import UserAvatar from './UserAvatar'
import type { PersonType } from '@/types'
import { useModalState } from '@/hooks/useModalState'

type Props = {
  person: PersonType
  onPersonUpdate?: (person: PersonType) => void
}

const UserCard = ({ person, onPersonUpdate }: Props) => {
  const { open: detailDialogOpen, setOpen: setDetailDialogOpen } = useModalState(`user-detail-${person.id}`)
  const firstTime = !person.fullName

  const toggleDetailDialog = () => {
    setDetailDialogOpen(true)
  }

  return (
    <Card className='h-full'>
      <CardContent className='flex flex-col gap-4 p-3'>
        <div
          className='flex justify-center items-center pli-2.5 py-4 rounded border relative cursor-pointer w-full h-full transition hover:border-primary'
          onClick={toggleDetailDialog}
        >
          <UserAvatar
            image={person.image}
            className='bs-[146px] min-h-[146px] w-full object-contain'
            alt={`${person.fullName || 'User'} avatar`}
          />

          {firstTime ? (
            <Chip className='absolute top-1 left-1' variant='filled' label='New' size='small' color='primary' />
          ) : null}
        </div>
        <div>
          {firstTime ? (
            <div className='flex justify-between gap-1'>
              <div className='flex-1'>
                <Typography variant='h5' className='text-gray-500'>
                  {person.fullName || 'No name provided'}
                </Typography>
                {person.age && <Typography variant='body2'>{person.age} y.o.</Typography>}
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
              <Typography variant='h5'>{person.fullName}</Typography>
              {person.age && <Typography variant='body2'>{person.age} y.o.</Typography>}
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
