'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// Component Imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '@/libs/Recharts'
import type { TooltipProps } from '@/libs/Recharts'

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

// Vars
const defaultData = [
  { pv: 280, name: '7/12' },
  { pv: 200, name: '8/12' },
  { pv: 220, name: '9/12' },
  { pv: 180, name: '10/12' },
  { pv: 270, name: '11/12' },
  { pv: 250, name: '12/12' },
  { pv: 70, name: '13/12' },
  { pv: 90, name: '14/12' },
  { pv: 200, name: '15/12' },
  { pv: 150, name: '16/12' },
  { pv: 160, name: '17/12' },
  { pv: 100, name: '18/12' },
  { pv: 150, name: '19/12' },
  { pv: 100, name: '20/12' },
  { pv: 50, name: '21/12' }
]

const CustomTooltip = (props: TooltipProps<number, string>) => {
  // Props
  const { active, payload } = props

  if (active && payload && payload.length > 0 && payload[0]) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography fontSize='0.875rem' color='text.primary'>{`${payload[0].value}`}</Typography>
      </div>
    )
  }

  return null
}

interface RechartsLineChartProps {
  data?: { date: string; value: number }[]
}

const RechartsLineChart = ({ data }: RechartsLineChartProps) => {
  // Hooks
  const theme = useTheme()

  // Transform data to match chart format
  const chartData = data
    ? data.map(item => ({
        name: new Date(item.date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        pv: item.value
      }))
    : defaultData

  // Color for visit count line chart
  const lineColor = '#ff9f43'

  return (
    <Card>
      <CardHeader
        title='Customers traffic'
        subheader=''
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
              <LineChart height={350} data={chartData} style={{ direction: theme.direction }} margin={{ left: -20 }}>
                <CartesianGrid />
                <XAxis dataKey='name' reversed={theme.direction === 'rtl'} />
                <YAxis orientation={theme.direction === 'rtl' ? 'right' : 'left'} />
                <Tooltip content={CustomTooltip} />
                <Line dataKey='pv' stroke={lineColor} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
      </CardContent>
    </Card>
  )
}

export default RechartsLineChart
