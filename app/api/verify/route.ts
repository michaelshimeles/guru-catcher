// app/api/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_TIMEOUT = 120000; // 120 seconds

const calculateSales = async (stripe: Stripe, days: number) => {
  const now = Math.floor(Date.now() / 1000);
  const startDate = now - (days * 24 * 60 * 60);

  const balanceTransactions = await stripe.balanceTransactions.list({
    limit: 100,
    created: { gte: startDate },
    type: 'charge',
  });

  return balanceTransactions.data.reduce((sum, t) => sum + t.amount, 0) / 100; // Convert from cents to dollars
};

const calculateMonthlyRevenue = async (stripe: Stripe) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      month: date.toLocaleString('default', { month: 'long' }),
      revenue: 0,
    };
  }).reverse();

  const balanceTransactions = await stripe.balanceTransactions.list({
    limit: 100,
    created: { gte: Math.floor(sixMonthsAgo.getTime() / 1000) },
    type: 'charge',
  });

  balanceTransactions.data.forEach(transaction => {
    const transactionDate = new Date(transaction.created * 1000);
    const monthIndex = monthlyData.findIndex(data => data.month === transactionDate.toLocaleString('default', { month: 'long' }));
    if (monthIndex !== -1) {
      monthlyData[monthIndex].revenue += transaction.amount / 100; // Convert cents to dollars
    }
  });

  return monthlyData;
};

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      timeout: STRIPE_TIMEOUT,
    });

    const [sales7Days, sales30Days, sales90Days, chartData] = await Promise.all([
      calculateSales(stripe, 7),
      calculateSales(stripe, 30),
      calculateSales(stripe, 90),
      calculateMonthlyRevenue(stripe),
    ]);

    const salesAllTime = await calculateSales(stripe, 365 * 10); // Assuming 10 years as "all time"

    const currentRevenue = chartData[chartData.length - 1].revenue;
    const previousRevenue = chartData[chartData.length - 2].revenue;
    const revenueGrowth = previousRevenue ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    const salesData = {
      sales7Days,
      sales30Days,
      sales90Days,
      salesAllTime,
      revenueGrowth,
      chartData,
    };

    return NextResponse.json(salesData);
  } catch (error: any) {
    console.error('Stripe API Error:', error);
    let errorMessage = 'An error occurred while processing your request.';
    let statusCode = 500;

    if (error instanceof Stripe.errors.StripeError) {
      if (error.type === 'StripePermissionError') {
        errorMessage = 'The provided API key does not have the required permissions. Please ensure you\'ve created a restricted key with "Read balance transactions" and "Read charges" permissions.';
        statusCode = 403;
      } else if (error.type === 'StripeAuthenticationError') {
        errorMessage = 'Invalid API key. Please check your Stripe API key and try again.';
        statusCode = 401;
      } else if (error.type === 'StripeRateLimitError') {
        errorMessage = 'Too many requests. Please try again later.';
        statusCode = 429;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}