import { Box, Grid, Skeleton } from '@mui/material'

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

export default AISummarySkeleton
