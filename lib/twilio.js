import Twilio from 'twilio'
const client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

export async function sendWhatsApp(to, body) {
  if (!process.env.TWILIO_SID) throw new Error('TWILIO not configured')
  return client.messages.create({ from: process.env.TWILIO_WHATSAPP_NUMBER, to: `whatsapp:${to}`, body })
}

export function formatPicksMessage(picks) {
  if (!picks || picks.length === 0) return 'Sem palpites para hoje.'
  let msg = '⚽ Palpites do dia:\n\n'
  picks.forEach((p, i) => { msg += `${i+1}) ${p.match}\n• Mercado: ${p.market} - ${p.selection}\n• Odds: ${p.odds} (edge ${Math.round(p.edge*100)}%)\n\n` })
  msg += 'Aposte com responsabilidade. Resultados não são garantidos.'
  return msg
}
export function formatDailyReportMessage(dateObj, total, wins, losses, hitRate, profitSim) {
  const d = dateObj.toLocaleDateString('pt-BR')
  return `📊 Relatório do dia ${d}\nTotal: ${total}\n✅ Acertos: ${wins}\n❌ Erros: ${losses}\n% Acerto: ${hitRate}%\nLucro simulado: R$${profitSim.toFixed(2)}`
}
export function formatMonthlyReportMessage(dateObj, total, wins, losses, hitRate, profitSim) {
  const d = dateObj.toLocaleDateString('pt-BR')
  return `📈 Relatório mensal (${d})\nTotal palpites: ${total}\n✅ Acertos: ${wins}\n❌ Erros: ${losses}\n% Acerto: ${hitRate}%\nLucro simulado: R$${profitSim.toFixed(2)}`
}
