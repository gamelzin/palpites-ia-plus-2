export function predictMatch(fixture, odds) {
  // MVP: probabilidade base + edge por diferença da odd implícita
  const homeProb = 0.55
  const implied = odds && odds.bestOdds ? 1 / odds.bestOdds : 0.45
  const edge = homeProb - implied
  return {
    selection: '1',
    market: 'match_winner',
    odds: odds && odds.bestOdds ? odds.bestOdds : 2.1,
    edge
  }
}
