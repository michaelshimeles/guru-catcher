"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { storeRevenue } from '@/utils/actions/store-revenue'
import { RevenueData } from '@/utils/types'
import { Clipboard } from 'lucide-react'
import { useState } from 'react'
import { toast } from "sonner"

function ShareRevenue({
  sales_7_days,
  sales_30_days,
  sales_90_days,
  sales_all_days,
  chart_data,
}: RevenueData) {
  const [shareUrl, setShareUrl] = useState<string>("")

  const copylink = (e: any) => {
    navigator.clipboard.writeText(shareUrl)
    toast("Shareable URL has been copied")
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button onClick={async () => {
          const { url } = await storeRevenue({
            sales_7_days, sales_30_days,
            sales_90_days,
            sales_all_days,
            chart_data,
          })

          setShareUrl(`${process.env.NEXT_PUBLIC_BASE_DOMAIN}/dashboard/${url}`)

        }}>Share Revenue</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-1">
          <h4 className="font-medium leading-none">Shareable URL</h4>
          <p className="text-sm text-muted-foreground">
            You can share this url
          </p>
        </div>
        <div className='flex gap-1 mt-2'>
          {shareUrl ? <Input value={shareUrl} className='text-xs' /> : <Skeleton className="w-full " />}
          <Button size="icon" variant="outline" onClick={copylink}>
            <Clipboard className='w-4 h-4' />
          </Button>
        </div>
      </PopoverContent>
    </Popover>

  )
}

export default ShareRevenue