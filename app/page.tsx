"use client";

export default function Pricing() {
  const handleCheckout = async (priceId: string) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
          Palpites de Futebol e Basquete direto no seu WhatsApp 📲
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl">
          Receba todos os dias palpites com alta taxa de acerto — vitórias, gols,
          escanteios, cartões e muito mais. Inteligência Artificial + estatísticas
          reais para aumentar suas chances.
        </p>
      </section>

      {/* Planos */}
      <section className="py-20 px-6 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-12">Escolha seu Plano</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Plano Futebol */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-4">Plano Futebol</h3>
            <p className="text-lg text-gray-600 mb-6">Apenas palpites de Futebol</p>

            <button
              onClick={() => handleCheckout("price_1SABXl8tnYbk8AGNGdIG7nkM")}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
            >
              Mensal – R$ 49,90
            </button>

            <button
              onClick={() => handleCheckout("price_1SABZ98tnYbk8AGNiaLEapDv")}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
            >
              Trimestral – R$ 129,90
            </button>

            <button
              onClick={() => handleCheckout("price_1SABeJ8tnYbk8AGN6dCg8Nd2")}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Anual – R$ 419,90
            </button>
          </div>

          {/* Plano Combo Futebol + Basquete */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition border-4 border-green-600">
            <h3 className="text-2xl font-bold mb-4">Plano Combo Futebol + Basquete</h3>
            <p className="text-lg text-gray-600 mb-6">Receba palpites de Futebol e Basquete</p>

            <button
              onClick={() => handleCheckout("price_1SBgbM8tnYbk8AGN89wh2LRH")}
              className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3"
            >
              Mensal – R$ 79,90
            </button>

            <button
              onClick={() => handleCheckout("price_1SBgbz8tnYbk8AGNAsVmeuwb")}
              className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3"
            >
              Trimestral – R$ 159,90
            </button>

            <button
              onClick={() => handleCheckout("price_1SBgcV8tnYbk8AGNQkjFS4zg")}
              className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Anual – R$ 599,90
            </button>
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


