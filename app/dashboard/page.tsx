"use client"

import ShareRevenue from "@/components/share-revenue";
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
import RevenueChart from "./_components/revenue-chart";

interface SalesData {
  sales_7_days: number;
  sales_30_days: number,
  sales_90_days: number,
  sales_all_days: number,
  chart_data: string;
  revenue_growth: number;
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
      <div className="text-2xl font-bold">
        ${new Intl.NumberFormat('en-US').format(amount?.toFixed(2))}
      </div>
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
      const sales_7_days = parseFloat(document.cookie.split('; ').find(row => row.startsWith('sales_7_days='))?.split('=')?.[1] || '0');
      const sales_30_days = parseFloat(document.cookie.split('; ').find(row => row.startsWith('sales_30_days='))?.split('=')?.[1] || '0');
      const sales_90_days = parseFloat(document.cookie.split('; ').find(row => row.startsWith('sales_90_days='))?.split('=')?.[1] || '0');
      const sales_all_days = parseFloat(document.cookie.split('; ').find(row => row.startsWith('sales_all_days='))?.split('=')?.[1] || '0');
      const chart_data = JSON.parse(document.cookie.split('; ').find(row => row.startsWith('chart_data='))?.split('=')?.[1] || '[]');
      const revenue_growth = parseFloat(document.cookie.split('; ').find(row => row.startsWith('revenue_growth='))?.split('=')?.[1] || '0');

      setSalesData({
        sales_7_days,
        sales_30_days,
        sales_90_days,
        sales_all_days,
        chart_data: JSON.stringify(chart_data),
        revenue_growth
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
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
          <p className="text-sm text-gray-400">Data directly from stripe.com</p>
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
      <div className="flex w-full justify-between gap-2 mn-3">
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
          <p className="text-sm text-gray-400">Data directly from stripe.com</p>
        </div>
        <ShareRevenue
          sales_7_days={salesData.sales_7_days}
          sales_30_days={salesData.sales_30_days}
          sales_90_days={salesData.sales_90_days}
          sales_all_days={salesData.sales_all_days}
          chart_data={(salesData.chart_data)}
        />

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <SalesCard title="Revenue (7 Days)" amount={salesData.sales_7_days} />
        <SalesCard title="Revenue (30 Days)" amount={salesData.sales_30_days} />
        <SalesCard title="Revenue (90 Days)" amount={salesData.sales_90_days} />
        <SalesCard title="Revenue (All Time)" amount={salesData.sales_all_days} />
      </div>
      <RevenueChart salesData={salesData} />
    </div>
  );
}