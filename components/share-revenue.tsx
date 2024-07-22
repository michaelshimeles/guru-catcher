"use client"
import React from 'react'
import { Button } from './ui/button'
import { RevenueData } from '@/utils/types'
import { storeRevenue } from '@/utils/actions/store-revenue'
import { useRouter } from 'next/navigation'

function ShareRevenue({
  sales_7_days,
  sales_30_days,
  sales_90_days,
  sales_all_days,
  chart_data,
}: RevenueData) {

  const router = useRouter()
  return (
    <Button onClick={async () => {
      const { url } = await storeRevenue({
        sales_7_days, sales_30_days,
        sales_90_days,
        sales_all_days,
        chart_data,
      })

      router.push(`/dashboard/${url}`)

    }}>Share Revenue</Button>
  )
}

export default ShareRevenue