export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-6">
      <h1 className="text-4xl font-bold text-red-700 mb-4">
        ❌ Assinatura não concluída
      </h1>
      <p className="text-lg text-gray-700 mb-6 max-w-lg">
        Parece que você cancelou o pagamento.  
        Não se preocupe, você pode tentar novamente quando quiser e garantir acesso aos palpites.
      </p>
      <a
        href="/"
        className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
      >
        Voltar para a Página Inicial
      </a>
    </div>
  );
}
