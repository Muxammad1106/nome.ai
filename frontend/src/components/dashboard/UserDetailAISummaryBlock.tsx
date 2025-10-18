'use client'

import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material'

import AISummarySkeleton from '../skeltons/AiSummarySkeleton'

type AISummaryBlockProps = {
  summary: any
  loading: boolean
  error: any
}

const AISummaryBlock = ({ summary, loading, error }: AISummaryBlockProps) => {
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
        <Typography variant='h6' className='flex items-center gap-2 mbe-3'>
          <i className='tabler-brain' />
          AI Summary & Insights
        </Typography>

        {loading ? (
          <AISummarySkeleton />
        ) : error ? (
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
                <Chip label={`Table ${summary.favoriteTable}`} color='primary' variant='outlined' size='small' />
              </Box>
            )}

            {/* Favorite Dishes */}
            {summary.favoriteDishes && summary.favoriteDishes.length > 0 && (
              <Box className='mbe-4'>
                <Typography variant='subtitle2' className='mbe-2'>
                  Favorite Dishes
                </Typography>
                <Box className='flex flex-wrap gap-1'>
                  {summary.favoriteDishes.map((dish: any, index: number) => (
                    <Chip key={index} label={dish.dish} color='secondary' variant='outlined' size='small' />
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
  )
}

export default AISummaryBlock
