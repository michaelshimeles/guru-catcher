"use client"
import { useState } from 'react';
import FloatingBadge from "@/components/floating-badge";
import PageWrapper from "@/components/wrapper/page-wrapper";

export default function Upcoming() {
  const [queryParam, setQueryParam] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState<any>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_DOMAIN;

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/payment?param=${queryParam}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment schedules');
      }

      const data = await response.json();
      console.log('Payment data:', data);
      setPaymentData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setError('Error loading payment data. Please try again later.');
      setPaymentData(null);
    }
  };

  return (
    <PageWrapper>
      <section className="flex items-center justify-center min-h-screen w-full">
        <div className="flex flex-col items-start justify-center gap-3 px-4 md:px-6 w-full max-w-2xl">
          <div className="text-center w-full">
            <h1 className="text-2xl font-bold tracking-tighter text-left mb-4">
              Payment Data
            </h1>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={queryParam}
                onChange={(e) => setQueryParam(e.target.value)}
                placeholder="Enter Stripe API Key"
                className="flex-grow p-2 border rounded"
              />
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Fetch Data
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {paymentData && (
              <p className="text-left text-muted-foreground overflow-auto max-h-60">
                {JSON.stringify(paymentData, null, 2)}
              </p>
            )}
          </div>
          <div className="text-sm mt-2">
            <p>Please create a restricted API key with the following permissions:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Read credit notes</li>
              <li>Read invoices</li>
              <li>Read subscriptions</li>
              <li>Read subscription schedules</li>
              <li>Read customer data</li>
              <li>Read balance information</li>
              <li>Read charges</li>
              <li>Read balance transactions</li>
            </ul>
            <a href="https://dashboard.stripe.com/apikeys/create?name=PaymentScheduleAPI&permissions[]=rak_credit_note_read&permissions[]=rak_invoice_read&permissions[]=rak_subscription_read&permissions[]=rak_subscription_schedule_read&permissions[]=rak_customer_read&permissions[]=rak_balance_read&permissions[]=rak_charge_read&permissions[]=rak_balance_transaction_read"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 inline-block">
              Create Restricted API Key
            </a>
          </div>
        </div>
      </section>
      <FloatingBadge />
    </PageWrapper>
  );
}