import { getSalesData } from '@/utils/functions/get-sales-data'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const response = await getSalesData(id!)

    // Formatting sales data
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0)

    const formattedSalesAllTime = formatCurrency(Number(response?.sales_all_days))
    const formattedSales90Days = formatCurrency(Number(response?.sales_90_days))
    const formattedSales30Days = formatCurrency(Number(response?.sales_30_days))
    const formattedSales7Days = formatCurrency(Number(response?.sales_7_days))

    console.log('Formatted sales:', formattedSalesAllTime)

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            color: 'white',
            fontFamily: 'sans-serif',
            padding: '60px',
            paddingTop: "100px"
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: "column",
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: "100px",
            marginBottom: "20px",
          }}>
            <h1 style={{ marginBottom: "0px", fontSize: "36px" }}>
              Verified Stripe Analytics
            </h1>
            <p style={{ marginTop: "5px" }}>
              Prove your income claim using gurucatcher and let&apos;s see if you real or fake
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
          }}>
            {[
              { title: 'Total Revenue', value: formattedSalesAllTime },
              { title: 'Revenue (90 days)', value: formattedSales90Days },
              { title: 'Revenue (30 days)', value: formattedSales30Days },
              { title: 'Revenue (7 days)', value: formattedSales7Days },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '48%',
                  marginBottom: '20px',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'rgb(24 24 27)', // A light gray color, you can adjust as needed
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  color: 'black',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  color: "white"
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{item.title}</div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: "white" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error: any) {
    console.error('Error generating OG Image:', error)
    return new Response(`Failed to generate OG Image: ${error.message}`, { status: 500 })
  }
}