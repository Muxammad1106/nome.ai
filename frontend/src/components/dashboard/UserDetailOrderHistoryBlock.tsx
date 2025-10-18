'use client'

import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material'

import OrderHistorySkeleton from '../skeltons/OrderHistorySkeleton'

type OrderHistoryBlockProps = {
  personDetail: any
  loading: boolean
  error: any
  onAddOrder?: () => void
}

const UserDetailOrderHistoryBlock = ({ personDetail, loading, error, onAddOrder }: OrderHistoryBlockProps) => {
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Not available'

    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <Card className='h-full'>
      <CardContent>
        <div className='flex items-center justify-between mbe-3'>
          <Typography variant='h6' className='flex items-center gap-2'>
            <i className='tabler-shopping-cart' />
            Order History
          </Typography>

          <Button
            variant='outlined'
            startIcon={<i className='tabler-plus' />}
            size='small'
            onClick={() => {
              onAddOrder?.()
            }}
          >
            Add Order
          </Button>
        </div>

        {loading ? (
          <OrderHistorySkeleton />
        ) : error ? (
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
              {personDetail.carts.map((cart: any, index: number) => (
                <Card key={cart.id} variant='outlined' className='p-3'>
                  <Box className='flex justify-between items-start mbe-2'>
                    <Typography variant='subtitle2'>Order #{index + 1}</Typography>
                    <Chip label={`Table ${cart.tableNumber}`} color='primary' size='small' variant='outlined' />
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
                      {cart.cartProducts.map((product: any) => (
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
  )
}

export default UserDetailOrderHistoryBlock
