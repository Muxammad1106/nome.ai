'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// Component Imports
import { Bar, XAxis, YAxis, BarChart, Tooltip, CartesianGrid, ResponsiveContainer } from '@/libs/Recharts'
import type { TooltipProps } from '@/libs/Recharts'

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

// Vars
const defaultData = [
  { ageRange: '18-25', percentage: 6.41 },
  { ageRange: '25-35', percentage: 51.28 },
  { ageRange: '35-45', percentage: 39.74 },
  { ageRange: '45-55', percentage: 1.28 },
  { ageRange: '55-65', percentage: 1.28 }
]

const CustomTooltip = (props: TooltipProps<number, string>) => {
  // Props
  const { active, payload } = props

  if (active && payload && payload.length > 0 && payload[0]) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography color='text.primary'>{props.label}</Typography>
        <Divider />
        {props &&
          props.payload &&
          props.payload.length > 0 &&
          props.payload.map(i => {
            return (
              <Box key={i.dataKey} className='flex items-center gap-2.5' sx={{ '& i': { color: '#00d4bd' } }}>
                <i className='tabler-circle-filled text-[10px]' />
                <Typography variant='body2'>{`${i.dataKey} : ${i.payload?.[i.dataKey as string] || ''}%`}</Typography>
              </Box>
            )
          })}
      </div>
    )
  }

  return null
}

interface RechartsAgeChartProps {
  data?: { type: string; percentage: number }[]
}

const RechartsAgeChart = ({ data }: RechartsAgeChartProps) => {
  // Hooks
  const theme = useTheme()

  // Transform data to match chart format
  const chartData = data
    ? data.map(item => ({
        ageRange: item.type,
        percentage: item.percentage
      }))
    : defaultData

  // Color for age bars
  const barColor = '#00d4bd'

  return (
    <Card>
      <CardHeader
        title='Age Distribution'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent>
        <AppRecharts>
          <div className='bs-[350px]'>
            <ResponsiveContainer>
              <BarChart height={350} data={chartData} style={{ direction: theme.direction }} margin={{ left: -20 }}>
                <CartesianGrid />
                <XAxis dataKey='ageRange' reversed={theme.direction === 'rtl'} />
                <YAxis orientation={theme.direction === 'rtl' ? 'right' : 'left'} />
                <Tooltip content={CustomTooltip} />
                <Bar dataKey='percentage' fill={barColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
        <div className='flex justify-center gap-6'>
          <Box className='flex items-center gap-1.5' sx={{ '& i': { color: barColor } }}>
            <i className='tabler-circle-filled text-xs' />
            <Typography variant='body2'>Age Groups</Typography>
          </Box>
        </div>
      </CardContent>
    </Card>
  )
}

export default RechartsAgeChart
