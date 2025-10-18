import { Box, Button, Card, CardContent, Chip, Grid, Typography } from '@mui/material'

import type { PersonType } from '@/types'
import { BACKEND_API } from '@/utils/request'
import CustomTextField from '@/@core/components/mui/TextField'

type Props = {
  person: PersonType
  openEditModal: () => void
}

export default function UserDetailLeftSide({ person, openEditModal }: Props) {
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

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Not available'

    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <Grid item xs={12} md={5}>
      <Grid container spacing={2}>
        {/* Profile Image and Basic Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent className='text-center relative'>
              <Box className='flex justify-center mbe-3'>
                <img
                  src={
                    person.image
                      ? BACKEND_API + person.image
                      : 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Image.png'
                  }
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
                onClick={openEditModal}
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
  )
}
