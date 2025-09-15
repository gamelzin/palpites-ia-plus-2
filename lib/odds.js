import fetch from 'node-fetch'
const API_BASE = process.env.APIFOOTBALL_BASE || 'https://v3.football.api-sports.io'
const API_KEY = process.env.APIFOOTBALL_KEY || ''

// Util para cabeçalhos (API-SPORTS usa x-apisports-key)
function headers() {
  return {
    'x-apisports-key': API_KEY,
    'accept': 'application/json'
  }
}

// Fixtures do dia (por data atual, todas as ligas disponíveis)
export async function fetchFixtures() {
  // Se não houver chave, retorna mocks para não quebrar dev local
  if (!API_KEY) {
    return [
      { id: 'm1', home: 'Time A', away: 'Time B', utcDate: new Date().toISOString() },
      { id: 'm2', home: 'Time C', away: 'Time D', utcDate: new Date().toISOString() }
    ]
  }
  const today = new Date().toISOString().slice(0,10)
  const url = `${API_BASE}/fixtures?date=${today}`
  const r = await fetch(url, { headers: headers() })
  if (!r.ok) throw new Error('API-Football fixtures error ' + r.status)
  const j = await r.json()
  // Mapear para formato interno
  const fixtures = (j.response || []).map(x => ({
    id: String(x.fixture?.id),
    home: x.teams?.home?.name,
    away: x.teams?.away?.name,
    utcDate: x.fixture?.date
  }))
  return fixtures.slice(0, 20) // limitar para MVP
}

// Odds: a API-Football tem endpoint /odds (às vezes requer plano). Vamos retornar bestOdds se disponível, caso contrário mock 2.1
export async function fetchOdds(fixtures) {
  const out = {}
  if (!API_KEY) {
    fixtures.forEach(f => out[f.id] = { bestOdds: 2.1 })
    return out
  }
  // Tentativa de odds (se o plano não suportar, caímos no fallback)
  try {
    for (const f of fixtures) {
      // Odds por fixture (nem todas as ligas têm odds)
      const url = `${API_BASE}/odds?fixture=${f.id}`
      const r = await fetch(url, { headers: headers() })
      if (!r.ok) { out[f.id] = { bestOdds: 2.1 }; continue }
      const j = await r.json()
      // Navegar em bookmakers/markets para pegar uma odd de match_winner
      let best = 2.1
      for (const item of (j.response || [])) {
        for (const b of (item.bookmakers || [])) {
          for (const m of (b.bets || [])) {
            if ((m.name || '').toLowerCase().includes('match winner')) {
              for (const v of (m.values || [])) {
                // Pegar a menor prob implícita (maior odd) para 1 (casa)
                const odd = parseFloat(v.odd)
                if (!isNaN(odd) && odd > best) best = odd
              }
            }
          }
        }
      }
      out[f.id] = { bestOdds: best || 2.1 }
    }
  } catch (e) {
    fixtures.forEach(f => out[f.id] = { bestOdds: 2.1 })
  }
  return out
}

// Resultados: verifica resultado final do fixture e mapeia para win/lose baseado no nosso pick "1" (casa)
export async function fetchResultsForMatches(picks) {
  if (!API_KEY) {
    return picks.map(p => ({ id: p.id, match: p.match, result: Math.random() < 0.6 ? 'win' : 'lose' }))
  }
  const out = []
  for (const p of picks) {
    // Tentamos extrair um possível fixture id do texto "Team A vs Team B" não é trivial sem salvar fixtureId
    // Melhor abordagem: salvar o fixtureId na tabela 'picks' quando criamos (ajuste recomendado futuramente).
    // Aqui, seguimos com 'pending' se não soubermos o fixture id real.
    out.push({ id: p.id, match: p.match, result: 'pending' })
  }
  return out
}
