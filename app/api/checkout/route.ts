import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inicializa Stripe (sem apiVersion para evitar erro no VS Code)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Mapeamento dos planos -> IDs de preços no Stripe
const priceMap: Record<string, string | undefined> = {
  // ⚽ Futebol
  football_monthly: process.env.STRIPE_PRICE_FOOTBALL_MONTHLY,
  football_quarterly: process.env.STRIPE_PRICE_FOOTBALL_QUARTERLY,
  football_yearly: process.env.STRIPE_PRICE_FOOTBALL_YEARLY,

  // ⚽🏀 Combo Futebol + Basquete
  combo_monthly: process.env.STRIPE_PRICE_COMBO_MONTHLY,
  combo_quarterly: process.env.STRIPE_PRICE_COMBO_QUARTERLY,
  combo_yearly: process.env.STRIPE_PRICE_COMBO_YEARLY,
};

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    // 🔎 Logs de debug (aparecem na Vercel → Deployments → Logs)
    console.log("🟢 Debug Checkout");
    console.log("➡️ Plano recebido:", plan);
    console.log("➡️ BASE_URL:", process.env.BASE_URL);
    console.log("➡️ STRIPE_KEY início:", process.env.STRIPE_SECRET_KEY?.slice(0, 6));
    console.log("➡️ STRIPE_KEY fim:", process.env.STRIPE_SECRET_KEY?.slice(-4));
    console.log("➡️ STRIPE_KEY tamanho:", process.env.STRIPE_SECRET_KEY?.length);
    console.log("➡️ PriceMap selecionado:", priceMap[plan]);

    if (!plan || !priceMap[plan]) {
      return NextResponse.json(
        { error: "Plano inválido ou não configurado" },
        { status: 400 }
      );
    }

    // Cria sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceMap[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Erro no checkout:", err);
    return NextResponse.json(
      { error: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}
