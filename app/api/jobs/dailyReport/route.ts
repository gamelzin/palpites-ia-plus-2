import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

console.log("[ENV DEBUG]", {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
});


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  // Busca picks do dia
  const { data, error } = await supabase
    .from("picks")
    .select("*")
    .gte("date_utc", `${date}T00:00:00`)
    .lte("date_utc", `${date}T23:59:59`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const counts = data?.reduce((acc: any, row: any) => {
    acc[row.sport] = (acc[row.sport] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    date,
    total: data?.length ?? 0,
    counts,
    message: `Relatório do dia ${date}: ${data?.length ?? 0} jogos cadastrados.`,
  });
}
