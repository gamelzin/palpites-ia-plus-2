// Mock do modelo de IA para gerar palpites
export async function gerarPalpite(jogo: string) {
  console.log(`[MOCK Modelo] Gerando palpite para ${jogo}`);
  // sempre retorna o mesmo palpite como exemplo
  return "Mais de 2.5 gols";
}
