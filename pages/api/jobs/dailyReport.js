import { supabaseAdmin } from '../../../lib/supabase'
import { fetchResultsForMatches } from '../../../lib/odds'
import { sendWhatsApp, formatDailyReportMessage } from '../../../lib/twilio'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const yesterday = new Date(Date.now() - 24*60*60*1000)
    const yStart = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate(), 0,0,0)).toISOString()
    const yEnd = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate(), 23,59,59)).toISOString()

    const { data: picks } = await supabaseAdmin.from('picks').select('*').gte('created_at', yStart).lte('created_at', yEnd)
    if (!picks || picks.length === 0) return res.status(200).json({ ok: true, message: 'no picks yesterday' })

    const results = await fetchResultsForMatches(picks)
    for (const r of results) await supabaseAdmin.from('picks').update({ result: r.result }).eq('id', r.id)

    const { data: subs } = await supabaseAdmin.from('subscribers').select('*').eq('active', true)
    for (const s of subs || []) {
      const total = results.length
      const wins = results.filter(x => x.result === 'win').length
      const losses = results.filter(x => x.result === 'lose').length
      const hitRate = total ? Math.round(1000 * wins/total)/10 : 0
      const profitSim = (wins * 100) - (losses * 100)
      const msg = formatDailyReportMessage(yesterday, total, wins, losses, hitRate, profitSim)
      try {
        await sendWhatsApp(s.phone, msg)
        await supabaseAdmin.from('send_logs').insert([{ subscriber_id: s.id, type: 'daily_report', sent_at: new Date().toISOString(), payload: msg }])
      } catch (err) { console.error('send error', err) }
    }

    return res.status(200).json({ ok: true, processed: results.length })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: String(err) })
  }
}
