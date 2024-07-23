import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
});

export async function GET() {
  try {
    // Fetch all upcoming invoices
    const invoices = await stripe.invoices.list({
      status: 'open',
      limit: 100, // Adjust this limit as needed
    });

    // Fetch all subscription schedules
    const subscriptionSchedules = await stripe.subscriptionSchedules.list({
      limit: 100, // Adjust this limit as needed
    });

    // Process and format the data
    const paymentSchedule = [...invoices.data, ...subscriptionSchedules.data]
      .flatMap((item: any) => {
        if ('due_date' in item) {
          // This is an invoice
          return [{
            date: new Date(item.due_date * 1000).toISOString(),
            amount: item.amount_due,
            currency: item.currency,
            type: 'invoice',
            customerId: item.customer as string,
          }];
        } else {
          // This is a subscription schedule
          return item.phases.map((phase: any) => ({
            date: new Date(phase.start_date * 1000).toISOString(),
            amount: phase.total,
            currency: phase.currency,
            type: 'subscription',
            customerId: item.customer as string,
          }));
        }
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json(paymentSchedule);
  } catch (error) {
    console.error('Error fetching payment schedules:', error);
    return NextResponse.json(
      { error: 'Error fetching payment schedules', details: error.message },
      { status: 500 }
    );
  }
}