import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import RevenueChart from "../_components/revenue-chart";
import { getSalesData } from "@/utils/functions/get-sales-data";



export async function generateMetadata({ params }: { params: { id: string } }) {
  const salesData = await getSalesData(params?.id)

  if (!salesData) {
    return {}
  }

  const ogUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_DOMAIN}/api/og?id=${params?.id}`)

  return {
    title: 'Guru Catcher Results',
    description: "Prove your income claim using gurucatcher and let's see if you real or fake",
    openGraph: {
      title: 'Guru Catcher Results',
      description: "Prove your income claim using gurucatcher and let's see if you real or fake",
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        }
      ]
    },
  }
}



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
        ${new Intl.NumberFormat('en-US').format(amount)}
      </div>
    </CardContent>
  </Card>
);


export default async function Dashboard({ params }: { params: { id: string } }) {

  const salesData = await getSalesData(params?.id)

  return (
    <div className='flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4'>
      <div className="flex w-full justify-between gap-2 mn-3">
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
          <p className="text-sm text-gray-400">Data directly from stripe.com</p>
        </div>
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