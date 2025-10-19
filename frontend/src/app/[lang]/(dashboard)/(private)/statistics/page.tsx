'use client'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

import RechartsLineChart from '@views/charts/recharts/RechartsLineChart'
import RechartsRadarChart from '@views/charts/recharts/RechartsRadarChart'
import RechartsPieChart from '@views/charts/recharts/RechartsPieChart'

import ApexRadialBarChart from '@views/charts/apex/ApexRadialBarChart'
import RechartsAgeChart from '@/views/charts/recharts/RechartsAgeChart'

import {
  useAgeStatistics,
  useBodyTypeStatistics,
  useEmotionStatistics,
  useGenderStatistics,
  useVisitCountStatistics
} from '@/services/statistics'

const Statistics = () => {
  const { data: ageData, loading: ageLoading } = useAgeStatistics()
  const { data: bodyTypeData, loading: bodyTypeLoading } = useBodyTypeStatistics()
  const { data: emotionData, loading: emotionLoading } = useEmotionStatistics()
  const { data: genderData, loading: genderLoading } = useGenderStatistics()
  const { data: visitCountData, loading: visitCountLoading } = useVisitCountStatistics()

  const isLoading = ageLoading || bodyTypeLoading || emotionLoading || genderLoading || visitCountLoading

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Statistics</Typography>

        <Typography>Real-time insights into customer behavior and restaurant performance.</Typography>
      </Grid>

      {isLoading ? (
        <Grid item xs={12}>
          <div className='flex items-center justify-center gap-2 py-8'>
            <CircularProgress />
          </div>
        </Grid>
      ) : (
        <>
          <Grid item xs={12}>
            <RechartsLineChart data={visitCountData?.data} />
          </Grid>

          <Grid item xs={12} md={6}>
            <RechartsRadarChart data={bodyTypeData?.data} />
          </Grid>

          <Grid item xs={12} md={6}>
            <RechartsPieChart data={emotionData?.data} />
          </Grid>

          <Grid item xs={12} md={6}>
            <ApexRadialBarChart data={genderData?.data} />
          </Grid>

          <Grid item xs={12} md={6}>
            <RechartsAgeChart data={ageData?.data} />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default Statistics
