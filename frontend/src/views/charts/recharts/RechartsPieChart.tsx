'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Component Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from '@/libs/Recharts'

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

type LabelProp = {
  cx: number
  cy: number
  percent: number
  midAngle: number
  innerRadius: number
  outerRadius: number
}

// Vars
const defaultData = [
  { name: 'Calm', value: 50, color: '#00d4bd' },
  { name: 'Happy', value: 85, color: '#ffe700' },
  { name: 'Neutral', value: 16, color: '#FFA1A1' },
  { name: 'Angry', value: 50, color: '#cd3c3c' },
  { name: 'Surprised', value: 50, color: '#826bf8' }
]

const RADIAN = Math.PI / 180

const renderCustomizedLabel = (props: LabelProp) => {
  // Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props

  // Vars
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central' className='max-[400px]:text-xs'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

interface RechartsPieChartProps {
  data?: { type: string; value: number }[]
}

// Color palette for emotions
const emotionColors = [
  '#00d4bd', // Calm - teal
  '#ffe700', // Happy - yellow
  '#FFA1A1', // Neutral - light red
  '#cd3c3c', // Angry - red
  '#826bf8', // Surprised - purple
  '#32baff', // Sad - blue
  '#ff9f43', // Fear - orange
  '#00c851' // Disgust - green
]

const RechartsPieChart = ({ data }: RechartsPieChartProps) => {
  const chartData = data
    ? data.map((item, index) => ({
        name: item.type,
        value: item.value,
        color: emotionColors[index % emotionColors.length]
      }))
    : defaultData

  return (
    <Card>
      <CardHeader title='Emotion' />
      <CardContent>
        <AppRecharts>
          <div className='bs-[350px]'>
            <ResponsiveContainer>
              <PieChart height={350} style={{ direction: 'ltr' }}>
                <Pie
                  data={chartData}
                  innerRadius={80}
                  dataKey='value'
                  label={renderCustomizedLabel}
                  labelLine={false}
                  stroke='none'
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
        <div className='flex justify-center flex-wrap gap-6'>
          {chartData.map((item, index) => (
            <Box key={index} className='flex items-center gap-1.5' sx={{ '& i': { color: item.color } }}>
              <i className='tabler-circle-filled text-xs' />
              <Typography variant='body2'>{item.name}</Typography>
            </Box>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RechartsPieChart
