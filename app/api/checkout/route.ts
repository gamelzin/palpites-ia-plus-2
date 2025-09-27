import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs"; // Stripe precisa de runtime Node.js

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

/**
 * Mapeia cada price_id ao plano/sports para gravarmos no Supabase via webhook.
 * (Usando seus price_id reais)
 */
const PLAN_BY_PRICE: Record<string, { plan: string; sports: string }> = {
  // Futebol
  "price_1SABXl8tnYbk8AGNGdIG7nkM": { plan: "football_monthly",   sports: "football" },
  "price_1SABZ98tnYbk8AGNiaLEapDv": { plan: "football_quarterly", sports: "football" },
  "price_1SABeJ8tnYbk8AGN6dCg8Nd2": { plan: "football_yearly",    sports: "football" },

  // Combo Futebol + Basquete
  "price_1SBgbM8tnYbk8AGN89wh2LRH": { plan: "combo_monthly",      sports: "football,basketball" },
  "price_1SBgbz8tnYbk8AGNAsVmeuwb": { plan: "combo_quarterly",    sports: "football,basketball" },
  "price_1SBgcV8tnYbk8AGNQkjFS4zg": { plan: "combo_yearly",       sports: "football,basketball" },
};

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();
    if (!priceId) {
      return NextResponse.json({ error: "priceId é obrigatório" }, { status: 400 });
    }

    const meta = PLAN_BY_PRICE[priceId] ?? { plan: "unknown", sports: "unknown" };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      // coleta telefone do cliente (útil pro WhatsApp/360dialog depois)
      phone_number_collection: { enabled: true },
      // metadados que o webhook vai receber
      metadata: {
        plan: meta.plan,
        sports: meta.sports,
      },
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Erro no checkout:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
