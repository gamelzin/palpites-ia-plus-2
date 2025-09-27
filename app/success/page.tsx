export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center px-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        🎉 Assinatura confirmada!
      </h1>
      <p className="text-lg text-gray-700 mb-6 max-w-lg">
        Obrigado por confiar no <strong>palpites.IA</strong>.  
        Sua assinatura já está ativa e em breve você começará a receber seus palpites
        direto no WhatsApp 📲.
      </p>
      <a
        href="/"
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Voltar para a Página Inicial
      </a>
    </div>
  );
}
