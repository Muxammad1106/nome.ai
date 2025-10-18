'use client'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import RechartsLineChart from '@views/charts/recharts/RechartsLineChart'
import RechartsRadarChart from '@views/charts/recharts/RechartsRadarChart'
import RechartsPieChart from '@views/charts/recharts/RechartsPieChart'
import ApexRadialBarChart from '@views/charts/apex/ApexRadialBarChart'
import RechartsScatterChart from '@/views/charts/recharts/RechartsScatterChart'

const Statistics = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Statistics</Typography>

        <Typography>Real-time insights into customer behavior and restaurant performance.</Typography>
      </Grid>

      <Grid item xs={12}>
        <RechartsLineChart />
      </Grid>

      <Grid item xs={12} md={6}>
        <RechartsRadarChart />
      </Grid>

      <Grid item xs={12} md={6}>
        <RechartsPieChart />
      </Grid>

      <Grid item xs={12} md={6}>
        <ApexRadialBarChart />
      </Grid>

      <Grid item xs={12} md={6}>
        <RechartsScatterChart />
      </Grid>
    </Grid>
  )
}

export default Statistics
