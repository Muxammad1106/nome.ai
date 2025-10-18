'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

interface ApexRadialBarChartProps {
  data?: { type: string; percentage: number }[]
}

const ApexRadialBarChart = ({ data }: ApexRadialBarChartProps) => {
  // Hooks
  const theme = useTheme()

  // Vars
  const textSecondary = 'var(--mui-palette-text-secondary)'

  const defaultData = [
    { type: 'Man', percentage: 57 },
    { type: 'Woman', percentage: 43 }
  ]

  const chartData = data || defaultData
  const labels = chartData.map(item => item.type)
  const series = chartData.map(item => item.percentage)

  // Generate colors dynamically based on data length
  const generateColors = (length: number) => {
    const baseColors = ['#32baff', '#7367f0', '#ff9f43', '#00d4bd', '#ffe700', '#cd3c3c']

    return Array.from({ length }, (_, index) => baseColors[index % baseColors.length])
  }

  const colors = generateColors(chartData.length)

  const options: ApexOptions = {
    stroke: { lineCap: 'round' },
    labels: labels,
    legend: {
      show: true,
      fontSize: '13px',
      position: 'bottom',
      labels: {
        colors: textSecondary
      },
      markers: {
        offsetX: theme.direction === 'rtl' ? 7 : -4
      },
      itemMargin: {
        horizontal: 9
      }
    },
    colors: colors,
    plotOptions: {
      radialBar: {
        hollow: { size: '30%' },
        track: {
          margin: 15,
          background: 'var(--mui-palette-customColors-trackBg)'
        },
        dataLabels: {
          name: {
            fontSize: '2rem'
          },
          value: {
            fontSize: '15px',
            fontWeight: 500,
            color: textSecondary
          },
          total: {
            show: true,
            fontWeight: 500,
            label: 'Gender',
            fontSize: '1.125rem',
            color: 'var(--mui-palette-text-primary)',
            formatter: function (w) {
              const totalValue =
                w.globals.seriesTotals.reduce((a: number, b: number) => {
                  return a + b
                }, 0) / w.globals.series.length

              if (totalValue % 1 === 0) {
                return totalValue + '%'
              } else {
                return totalValue.toFixed(2) + '%'
              }
            }
          }
        }
      }
    },
    grid: {
      padding: {
        top: -35,
        bottom: -30
      }
    }
  }

  return (
    <Card>
      <CardHeader title='Gender' />
      <CardContent>
        <AppReactApexCharts type='radialBar' width='100%' height={400} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default ApexRadialBarChart
