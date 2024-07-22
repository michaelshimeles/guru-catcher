"use server";

import { createServerClient } from "@supabase/ssr";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RevenueData } from "../types";

export const storeRevenue = async ({
  sales_7_days,
  sales_30_days,
  sales_90_days,
  sales_all_days,
  chart_data,
}: RevenueData) => {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const { data, error } = await supabase
      .from("revenue")
      .insert([
        {
          sales_7_days,
          sales_30_days,
          sales_90_days,
          sales_all_days,
          chart_data,
          url: randomUUID(),
        },
      ])
      .select();

    if (error?.code) return error;

    return data?.[0]

  } catch (error) {
    return error;
  }
};
