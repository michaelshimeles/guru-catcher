import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { CartesianGrid, XAxis, YAxis, Bar, BarChart } from 'recharts'
import { SalesCard } from './sales-card'

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function DashLoading() {
  return (
    <div className='flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4'>
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
        <p className="text-sm text-gray-400">Data directly from stripe.com</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <SalesCard title="Revenue (7 Days)" amount={0} />
        <SalesCard title="Revenue (30 Days)" amount={0} />
        <SalesCard title="Revenue (90 Days)" amount={0} />
        <SalesCard title="Revenue (All Time)" amount={0} />
      </div>
      <Card className="min-w-[800px]">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Last 6 Months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart width={800} height={400} data={JSON.parse(JSON.stringify([{ month: '', revenue: 0 }]))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>)
}
