"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from 'react'
import { useForm } from "react-hook-form"

function APIForm() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: data.apiKey }),
      });
      const result = await response.json();

      if (response.ok) {
        // Store all sales data in cookies
        document.cookie = `sales_7_days=${result.sales7Days}; path=/; max-age=3600; SameSite=Strict; Secure`;
        document.cookie = `sales_30_days=${result.sales30Days}; path=/; max-age=3600; SameSite=Strict; Secure`;
        document.cookie = `sales_90_days=${result.sales90Days}; path=/; max-age=3600; SameSite=Strict; Secure`;
        document.cookie = `sales_all_time=${result.salesAllTime}; path=/; max-age=3600; SameSite=Strict; Secure`;
        document.cookie = `chart_data=${JSON.stringify(result.chartData)}; path=/; max-age=3600; SameSite=Strict; Secure`;
        document.cookie = `revenue_growth=${result.revenueGrowth}; path=/; max-age=3600; SameSite=Strict; Secure`;
        router.push('/dashboard');
      } else {
        setError(result.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start w-full gap-3">
      <div className="w-full max-w-md">
        <Input
          type="password"
          {...register("apiKey", { required: true })}
          placeholder="Stripe Live Secret Key"
          className={error ? 'border-red-500' : ''}
          disabled={isLoading}
        />

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify Income'}
      </Button>
      <div className="text-sm mt-2">
        <p>Please create a restricted API key with the following permissions:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Read balance transactions</li>
          <li>Read charges</li>
        </ul>
        <a href="https://dashboard.stripe.com/apikeys/create?name=GuruCatcher&permissions%5B%5D=rak_balance_read&permissions%5B%5D=rak_charge_read"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mt-2 inline-block">
          Create Restricted API Key
        </a>
      </div>
    </form>
  )
}

export default APIForm
