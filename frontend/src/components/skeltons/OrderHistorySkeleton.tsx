import { Box, Skeleton } from '@mui/material'

const OrderHistorySkeleton = () => (
  <Box>
    <Skeleton variant='rectangular' height={200} className='rounded' />
  </Box>
)

export default OrderHistorySkeleton
