import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const getSalesData = async (id: string) => {
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
      .select()
      .eq("url", id)

    if (error?.code) return error;

    return data?.[0];
  } catch (error) {
    return error;
  }
}
