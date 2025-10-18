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

// Component Imports
import {
  Radar,
  Tooltip,
  PolarGrid,
  RadarChart,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from '@/libs/Recharts'
import type { TooltipProps } from '@/libs/Recharts'

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

// Vars
const defaultData = [
  {
    subject: 'Normal',
    Man: 41
  },
  {
    subject: 'Athletic',
    Man: 64
  },
  {
    subject: 'Heavy',
    Man: 81
  },
  {
    subject: 'Slim',
    Man: 60
  }
]

const CustomTooltip = (props: TooltipProps<number, string>) => {
  // Props
  const { active, payload } = props

  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography color='text.primary'>{props.label}</Typography>
        <Divider />
        {props &&
          props.payload &&
          props.payload.length > 0 &&
          props.payload.map(i => {
            return (
              <Box key={i.dataKey} className='flex items-center gap-2.5' sx={{ '& i': { color: '#fde802' } }}>
                <i className='tabler-circle-filled text-[10px]' />
                <Typography variant='body2'>{`${i.dataKey} : ${i.payload?.[i.dataKey as string] || ''}`}</Typography>
              </Box>
            )
          })}
      </div>
    )
  }

  return null
}

interface RechartsRadarChartProps {
  data?: { type: string; percentage: number }[]
}

const RechartsRadarChart = ({ data }: RechartsRadarChartProps) => {
  const chartData = data ? data.map(item => ({ subject: item.type, Man: item.percentage })) : defaultData

  // Generate colors for body types
  const bodyTypeColors = ['#fde802', '#32baff', '#7367f0', '#ff9f43', '#00d4bd']
  const chartColor = bodyTypeColors[0] // Use first color for the main data series

  return (
    <Card>
      <CardHeader title='Body type segmentation' />
      <CardContent>
        <AppRecharts>
          <div className='bs-[350px]'>
            <ResponsiveContainer>
              <RadarChart cx='50%' cy='50%' height={350} data={chartData} style={{ direction: 'ltr' }}>
                <PolarGrid />
                <PolarAngleAxis dataKey='subject' />
                <PolarRadiusAxis />
                <Tooltip content={CustomTooltip} />
                <Radar dataKey='Man' stroke={chartColor} fill={chartColor} fillOpacity={1} />
                {/* <Radar dataKey='Samsung s20' stroke='#9b88fa' fill='#9b88fa' fillOpacity={0.8} /> */}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
        <div className='flex justify-center gap-6'>
          <Box className='flex items-center gap-1.5' sx={{ '& i': { color: chartColor } }}>
            <i className='tabler-circle-filled text-xs' />
            <Typography variant='body2'>Man</Typography>
          </Box>
          {/* <Box className='flex items-center gap-1.5' sx={{ '& i': { color: '#9b88fa' } }}>
            <i className='tabler-circle-filled text-xs' />
            <Typography variant='body2'>Samsung s20</Typography>
          </Box> */}
        </div>
      </CardContent>
    </Card>
  )
}

export default RechartsRadarChart
