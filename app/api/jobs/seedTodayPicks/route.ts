import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getByDate } from "@/lib/apisports";


function todayInSaoPauloISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sport = (searchParams.get("sport") ?? "football").toLowerCase();
    const dateISO = searchParams.get("date") ?? todayInSaoPauloISO();

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const results = await getByDate(sport, dateISO);

    const mapped = results.map((item: any) => ({
      sport,
      match_id: item.id ?? item.fixture?.id,
      league: item.league?.name,
      home: item.teams?.home?.name ?? item.home?.name,
      away: item.teams?.away?.name ?? item.away?.name,
      date_utc: item.fixture?.date ?? item.date ?? null,
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("picks").insert(mapped);
    if (error) throw new Error(error.message);

    return NextResponse.json({ sport, dateISO, inserted: mapped.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? String(e) }, { status: 500 });
  }
}
