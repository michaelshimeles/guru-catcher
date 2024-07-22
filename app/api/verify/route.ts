// app/api/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_TIMEOUT = 120000; // 120 seconds

const calculateSales = (transactions: Stripe.BalanceTransaction[], days: number) => {
  const now = Math.floor(Date.now() / 1000);
  const startDate = now - (days * 24 * 60 * 60);
  return transactions
    .filter(t => t.created >= startDate && t.type === 'charge')
    .reduce((sum, t) => sum + t.amount, 0) / 100; // Convert from cents to dollars
};

const calculateMonthlyRevenue = (transactions: Stripe.BalanceTransaction[]) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      month: date.toLocaleString('default', { month: 'long' }),
      revenue: 0,
    };
  }).reverse();

  transactions.forEach(transaction => {
    if (transaction.type === 'charge' && transaction.created * 1000 >= sixMonthsAgo.getTime()) {
      const transactionDate = new Date(transaction.created * 1000);
      const monthIndex = monthlyData.findIndex(data => data.month === transactionDate.toLocaleString('default', { month: 'long' }));
      if (monthIndex !== -1) {
        monthlyData[monthIndex].revenue += transaction.amount / 100; // Convert cents to dollars
      }
    }
  });

  return monthlyData;
};

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    console.log('apiKey', apiKey)

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      timeout: STRIPE_TIMEOUT,
    });

    const balanceTransactions = await stripe.balanceTransactions.list({
      limit: 100,
      expand: ['data.source'],
    });

    const revenueData = calculateMonthlyRevenue(balanceTransactions.data);
    const currentRevenue = revenueData[revenueData.length - 1].revenue;
    const previousRevenue = revenueData[revenueData.length - 2].revenue;
    const revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    const salesData = {
      sales7Days: calculateSales(balanceTransactions.data, 7),
      sales30Days: calculateSales(balanceTransactions.data, 30),
      sales90Days: calculateSales(balanceTransactions.data, 90),
      salesAllTime: calculateSales(balanceTransactions.data, Infinity),
      revenueGrowth,
      chartData: revenueData,
    };

    return NextResponse.json(salesData);
  } catch (error: any) {
    console.error('Stripe API Error:', error);
    let errorMessage = 'An error occurred while processing your request.';
    let statusCode = 500;

    if (error instanceof Stripe.errors.StripeError) {
      if (error.type === 'StripeConnectionError') {
        errorMessage = 'Unable to connect to Stripe. Please check your internet connection and try again.';
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