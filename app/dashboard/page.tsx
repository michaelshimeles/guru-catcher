"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DollarSign } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface SalesData {
  sales7Days: number;
  sales30Days: number;
  sales90Days: number;
  salesAllTime: number;
  chartData: Array<{ month: string; revenue: number }>;
  revenueGrowth: number;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const SalesCard = ({ title, amount }: { title: string; amount: number }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">${amount.toFixed(2)}</div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchSalesData = () => {
    setLoading(true);
    setError(null);
    try {
      const sales7Days = parseFloat(document.cookie.split('; ').find(row => row.startsWith('sales_7_days='))?.split('=')?.[1] || '0');
      const sales30Days = parseFloat(document.cookie.split('; ').find(row => row.startsWith('sales_30_days='))?.split('=')?.[1] || '0');
      const sales90Days = parseFloat(document.cookie.split('; ').find(row => row.startsWith('sales_90_days='))?.split('=')?.[1] || '0');
      const salesAllTime = parseFloat(document.cookie.split('; ').find(row => row.startsWith('sales_all_time='))?.split('=')?.[1] || '0');
      const chartData = JSON.parse(document.cookie.split('; ').find(row => row.startsWith('chart_data='))?.split('=')?.[1] || '[]');
      const revenueGrowth = parseFloat(document.cookie.split('; ').find(row => row.startsWith('revenue_growth='))?.split('=')?.[1] || '0');

      setSalesData({
        sales7Days,
        sales30Days,
        sales90Days,
        salesAllTime,
        chartData,
        revenueGrowth
      });
    } catch (err) {
      setError('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4'>
        <div className="flex flex-col gap-2 mn-3">
          <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
          <p>Data directly from stripe.com</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <SalesCard title="Sales (7 Days)" amount={0} />
          <SalesCard title="Sales (30 Days)" amount={0} />
          <SalesCard title="Sales (90 Days)" amount={0} />
          <SalesCard title="Sales (All Time)" amount={0} />
        </div>
        <Card className="min-w-[800px] mt-3">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Last 6 Months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart width={800} height={400} data={[{ month: '', revenue: 0 }]}>
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
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-2'>
        <p>Error: {error}</p>
        <Button onClick={() => router.push('/')}>Return to Home</Button>
      </div>
    );
  }

  if (!salesData) {
    router.push('/');
    return null;
  }

  return (
    <div className='flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4'>
      <div className="flex flex-col gap-2 mn-3">
        <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
        <p>Data directly from stripe.com</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <SalesCard title="Sales (7 Days)" amount={salesData.sales7Days} />
        <SalesCard title="Sales (30 Days)" amount={salesData.sales30Days} />
        <SalesCard title="Sales (90 Days)" amount={salesData.sales90Days} />
        <SalesCard title="Sales (All Time)" amount={salesData.salesAllTime} />
      </div>
      <Card className="min-w-[800px] mt-3">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Last 6 Months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart width={800} height={400} data={salesData.chartData}>
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
    </div>
  );
}