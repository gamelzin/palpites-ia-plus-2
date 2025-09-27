import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWhatsApp360 } from "@/lib/whatsapp360";

function todayInSaoPauloISO() {
  return new Date().toISOString().slice(0, 10);
}

function fmtHourBRT(iso?: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

function buildMessage(dateISO: string, foot: any[], bask: any[]) {
  const toLines = (items: any[]) =>
    items.map(r => `• ${r.home} x ${r.away} — ${r.league} — ${fmtHourBRT(r.date_utc)}`);
  const dataBR = dateISO.split("-").reverse().join("/");

  let msg = `Palpites do dia — ${dataBR}\n`;
  msg += `\n⚽ Futebol (${foot.length}):\n` + (foot.length ? toLines(foot).join("\n") : "• Sem jogos");
  msg += `\n\n🏀 Basquete (${bask.length}):\n` + (bask.length ? toLines(bask).join("\n") : "• Sem jogos");
  return msg.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateISO = searchParams.get("date") ?? todayInSaoPauloISO();

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: subs } = await supabase
      .from("subscribers")
      .select("id, whatsapp_number, status")
      .eq("status", "active")
      .not("whatsapp_number", "is", null);

    const { data: rows } = await supabase
      .from("picks")
      .select("sport, league, home, away, date_utc")
      .gte("date_utc", `${dateISO}T00:00:00Z`)
      .lte("date_utc", `${dateISO}T23:59:59Z`)
      .order("date_utc", { ascending: true });

    const foot = (rows ?? []).filter(r => r.sport === "football");
    const bask = (rows ?? []).filter(r => r.sport === "basketball");
    const message = buildMessage(dateISO, foot, bask);

    const hasD360 = !!process.env.D360_API_KEY;
    const logs: any[] = [];

    for (const s of subs ?? []) {
      let status = "pending";

      if (hasD360) {
        try {
          await sendWhatsApp360(s.whatsapp_number, message);
          status = "sent";
        } catch {
          status = "failed";
        }
      } else {
        console.log(`[SIMULATED SEND] to=${s.whatsapp_number}\n${message}\n`);
      }

      logs.push({
        subscriber_id: s.id,
        message,
        status,
        sent_at: new Date().toISOString(),
      });
    }

    if (logs.length) {
      await supabase.from("send_logs").insert(logs);
    }

    return NextResponse.json({
      ok: true,
      simulated: !hasD360,
      sent_to: subs?.length ?? 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? String(e) }, { status: 500 });
  }
}
