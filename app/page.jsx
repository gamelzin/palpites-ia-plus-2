export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
          Palpites de Futebol direto no seu WhatsApp 📲
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl">
          Receba todos os dias palpites com alta taxa de acerto — vitórias,
          gols, escanteios, cartões e muito mais. Inteligência Artificial +
          estatísticas reais para aumentar suas chances.
        </p>
        <a
          href="/https://buy.stripe.com/test_dRm4gs9fu3e343K8tU1Nu03"
          className="bg-white text-green-700 px-10 py-5 rounded-2xl text-xl font-bold shadow-lg hover:bg-gray-100 hover:scale-105 transform transition"
        >
          Quero receber os palpites
        </a>
      </section>

      {/* Benefícios */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Por que escolher o Palpites.IA?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-lg text-gray-700">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition">
            ✅ Palpites diários com alta taxa de acerto
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition">
            ✅ Relatórios automáticos (diário e mensal)
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition">
            ✅ Receba tudo direto no WhatsApp
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition">
            ✅ Simples, rápido e acessível
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition">
            ✅ Pagamento seguro pelo Stripe
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition">
            ✅ Sem promessas milagrosas, só dados e disciplina
          </div>
        </div>
      </section>

      {/* Planos */}
      {/* Planos */}
<section className="py-20 px-6 bg-gray-100">
  <h2 className="text-4xl font-bold text-center mb-12">Planos</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    
    {/* Plano Mensal */}
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition">
      <h3 className="text-2xl font-bold mb-4">Mensal</h3>
      <p className="text-4xl font-extrabold text-green-600 mb-6">R$49,90</p>
      <a
        href="https://buy.stripe.com/cNi00d0fP3xwb7v2m30RG02"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Assinar Mensal
      </a>
    </div>

    {/* Plano Trimestral */}
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-4 border-green-600 hover:scale-105 transition">
      <h3 className="text-2xl font-bold mb-4">Trimestral</h3>
      <p className="text-4xl font-extrabold text-green-600 mb-2">R$129,90</p>
      <p className="text-sm text-green-600 mb-6">Economize 13%</p>
      <a
        href="https://buy.stripe.com/5kQcMZgeN5FE5Nb7Gn0RG03"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Assinar Trimestral
      </a>
    </div>

    {/* Plano Anual */}
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition">
      <h3 className="text-2xl font-bold mb-4">Anual</h3>
      <p className="text-4xl font-extrabold text-green-600 mb-2">R$419,90</p>
      <p className="text-sm text-green-600 mb-6">Economize 30%</p>
      <a
        href="https://buy.stripe.com/3cI3cpbYx5FE1wV0dV0RG04"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Assinar Anual
      </a>
    </div>

  </div>
</section>


      {/* Rodapé */}
      <footer className="py-10 px-6 bg-gray-900 text-gray-300 text-center text-sm">
        ⚠️ Aviso: Não garantimos lucros. Conteúdo educacional. Uso permitido apenas para maiores de 18 anos.
      </footer>
    </div>
  );
}






