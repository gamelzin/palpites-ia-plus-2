import { supabaseAdmin } from '../../../lib/supabase'
import { sendWhatsApp, formatMonthlyReportMessage } from '../../../lib/twilio'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const since = new Date(Date.now() - 30*24*60*60*1000).toISOString()
    const { data: picks } = await supabaseAdmin.from('picks').select('*').gte('created_at', since)
    const total = picks.length
    const wins = picks.filter(p=>p.result === 'win').length
    const losses = picks.filter(p=>p.result === 'lose').length
    const hitRate = total ? Math.round(1000 * wins/total)/10 : 0
    const profitSim = (wins * 100) - (losses * 100)

    const { data: subs } = await supabaseAdmin.from('subscribers').select('*').eq('active', true)
    for (const s of subs || []) {
      const msg = formatMonthlyReportMessage(new Date(), total, wins, losses, hitRate, profitSim)
      try {
        await sendWhatsApp(s.phone, msg)
        await supabaseAdmin.from('send_logs').insert([{ subscriber_id: s.id, type: 'monthly_report', sent_at: new Date().toISOString(), payload: msg }])
      } catch (err) { console.error('send error', err) }
    }

    return res.status(200).json({ ok: true, total, wins, losses })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: String(err) })
  }
}
