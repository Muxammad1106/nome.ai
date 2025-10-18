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
import Skeleton from '@mui/material/Skeleton'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

import UserEditDialog from '@/components/dashboard/UserEditDialog'
import type { PersonType } from '@/types'
import { BACKEND_API } from '@/utils/request'
import { usePersonAISummary, usePersonDetailWithCarts } from '@/services/persons'

type UserDetailDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  person: PersonType
  onPersonUpdate?: (person: PersonType) => void
}

const UserDetailDialog = ({ open, setOpen, person, onPersonUpdate }: UserDetailDialogProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { data: summary, loading: summaryLoading, error: summaryError } = usePersonAISummary(person.id, open)

  const {
    data: personDetail,
    loading: personDetailLoading,
    error: personDetailError
  } = usePersonDetailWithCarts(person.id, open)

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

  const AISummarySkeleton = () => (
    <Box>
      {/* AI Summary Skeleton */}
      <Box className='mbe-4'>
        <Skeleton variant='text' width={120} height={24} className='mbe-2' />
        <Skeleton variant='rectangular' height={80} className='rounded' />
      </Box>

      {/* Visit Statistics Skeleton */}
      <Grid container spacing={2} className='mbe-4'>
        <Grid item xs={6}>
          <Box className='text-center p-2 bg-grey-50 rounded'>
            <Skeleton variant='text' width={40} height={32} className='mx-auto mbe-1' />
            <Skeleton variant='text' width={80} height={16} className='mx-auto' />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className='text-center p-2 bg-grey-50 rounded'>
            <Skeleton variant='text' width={40} height={32} className='mx-auto mbe-1' />
            <Skeleton variant='text' width={100} height={16} className='mx-auto' />
          </Box>
        </Grid>
      </Grid>

      {/* Favorite Table Skeleton */}
      <Box className='mbe-4'>
        <Skeleton variant='text' width={100} height={20} className='mbe-1' />
        <Skeleton variant='rectangular' width={80} height={24} className='rounded-full' />
      </Box>

      {/* Favorite Dishes Skeleton */}
      <Box className='mbe-4'>
        <Skeleton variant='text' width={100} height={20} className='mbe-2' />
        <Box className='flex flex-wrap gap-1'>
          <Skeleton variant='rectangular' width={60} height={24} className='rounded-full' />
          <Skeleton variant='rectangular' width={80} height={24} className='rounded-full' />
          <Skeleton variant='rectangular' width={70} height={24} className='rounded-full' />
        </Box>
      </Box>

      {/* Last Visit Skeleton */}
      <Box>
        <Skeleton variant='text' width={80} height={20} className='mbe-1' />
        <Skeleton variant='text' width={150} height={16} />
      </Box>
    </Box>
  )

  const OrderHistorySkeleton = () => (
    <Box>
      <Skeleton variant='rectangular' height={200} className='rounded' />
    </Box>
  )

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
                        AI Summary & Insights
                      </Typography>

                      {summaryLoading ? (
                        <AISummarySkeleton />
                      ) : summaryError ? (
                        <Box className='text-center py-8'>
                          <Typography variant='body1' color='error'>
                            Failed to load AI insights
                          </Typography>
                        </Box>
                      ) : summary ? (
                        <Box>
                          {/* AI Summary */}
                          <Box className='mbe-4'>
                            <Typography variant='subtitle2' className='mbe-2'>
                              AI Summary
                            </Typography>
                            <Typography variant='body2' className='p-3 bg-grey-50 rounded border'>
                              {summary.aiSummary}
                            </Typography>
                          </Box>

                          {/* Visit Statistics */}
                          <Grid container spacing={2} className='mbe-4'>
                            <Grid item xs={6}>
                              <Box className='text-center p-2 bg-primary/5 rounded'>
                                <Typography variant='h6' color='primary'>
                                  {summary.totalVisits}
                                </Typography>
                                <Typography variant='caption'>Total Visits</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box className='text-center p-2 bg-success/5 rounded'>
                                <Typography variant='h6' color='success.main'>
                                  {summary.totalSpentItems}
                                </Typography>
                                <Typography variant='caption'>Items Purchased</Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          {/* Favorite Table */}
                          {summary.favoriteTable && summary.favoriteTable > 0 && (
                            <Box className='mbe-4'>
                              <Typography variant='subtitle2' className='mbe-1'>
                                Favorite Table
                              </Typography>
                              <Chip
                                label={`Table ${summary.favoriteTable}`}
                                color='primary'
                                variant='outlined'
                                size='small'
                              />
                            </Box>
                          )}

                          {/* Favorite Dishes */}
                          {summary.favoriteDishes && summary.favoriteDishes.length > 0 && (
                            <Box className='mbe-4'>
                              <Typography variant='subtitle2' className='mbe-2'>
                                Favorite Dishes
                              </Typography>
                              <Box className='flex flex-wrap gap-1'>
                                {summary.favoriteDishes.map((dish, index) => (
                                  <Chip
                                    key={index}
                                    label={dish.dish}
                                    color='secondary'
                                    variant='outlined'
                                    size='small'
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                          {/* Last Visit */}
                          {summary.lastVisit && (
                            <Box>
                              <Typography variant='subtitle2' className='mbe-1'>
                                Last Visit
                              </Typography>
                              <Typography variant='body2' color='text.secondary'>
                                {formatDateTime(summary.lastVisit)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box className='text-center py-8'>
                          <Typography variant='body1'>No AI insights available</Typography>
                        </Box>
                      )}
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

                      {personDetailLoading ? (
                        <OrderHistorySkeleton />
                      ) : personDetailError ? (
                        <Box className='text-center py-8'>
                          <Typography variant='body1' color='error'>
                            Failed to load order history
                          </Typography>
                        </Box>
                      ) : personDetail && personDetail.carts && personDetail.carts.length > 0 ? (
                        <Box>
                          {/* Order Summary */}
                          <Box className='flex gap-4 mbe-4 p-3 bg-grey-50 rounded'>
                            <Box className='text-center'>
                              <Typography variant='h6' color='primary'>
                                {personDetail.totalCarts}
                              </Typography>
                              <Typography variant='caption'>Total Orders</Typography>
                            </Box>
                            <Box className='text-center'>
                              <Typography variant='h6' color='success.main'>
                                {personDetail.totalProductsInCarts}
                              </Typography>
                              <Typography variant='caption'>Items Ordered</Typography>
                            </Box>
                          </Box>

                          {/* Cart List */}
                          <Box className='space-y-3'>
                            {personDetail.carts.map((cart, index) => (
                              <Card key={cart.id} variant='outlined' className='p-3'>
                                <Box className='flex justify-between items-start mbe-2'>
                                  <Typography variant='subtitle2'>Order #{index + 1}</Typography>
                                  <Chip
                                    label={`Table ${cart.tableNumber}`}
                                    color='primary'
                                    size='small'
                                    variant='outlined'
                                  />
                                </Box>

                                <Typography variant='caption' color='text.secondary' className='mbe-2 block'>
                                  {formatDateTime(cart.createdAt)}
                                </Typography>

                                {/* Products in this cart */}
                                <Box>
                                  <Typography variant='body2' className='mbe-1'>
                                    Products:
                                  </Typography>
                                  <Box className='flex flex-wrap gap-1'>
                                    {cart.cartProducts.map(product => (
                                      <Chip
                                        key={product.id}
                                        label={product.productName}
                                        color='secondary'
                                        size='small'
                                        variant='outlined'
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              </Card>
                            ))}
                          </Box>
                        </Box>
                      ) : (
                        <Box className='text-center py-8'>
                          <Typography variant='body1'>No order history available</Typography>
                        </Box>
                      )}
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
