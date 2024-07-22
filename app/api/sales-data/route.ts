// app/api/getSalesData/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    // In a real application, you would retrieve the API key securely,
    // possibly from an environment variable or a secure storage
    const apiKey = process.env.STRIPE_SECRET_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Stripe API key not configured' }, { status: 500 });
    }

    const stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });

    // Fetch balance transactions for the last 30 days
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - 30 * 24 * 60 * 60;

    const balanceTransactions = await stripe.balanceTransactions.list({
      limit: 100,
      created: {
        gte: startDate,
        lte: endDate,
      },
    });

    // Calculate total sales
    const totalSales = balanceTransactions.data.reduce((sum, transaction) => {
      if (transaction.type === 'charge') {
        return sum + transaction.amount;
      }
      return sum;
    }, 0);

    return NextResponse.json({ totalSales: totalSales / 100 }); // Convert from cents to dollars
  } catch (error) {
    console.error('Stripe API Error:', error);
    return NextResponse.json({ error: 'Error fetching Stripe data' }, { status: 500 });
  }
}