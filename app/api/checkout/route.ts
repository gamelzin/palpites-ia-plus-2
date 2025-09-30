import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const priceMap: Record<string, string> = {
  // ⚽ Futebol
  football_monthly: process.env.STRIPE_PRICE_FOOTBALL_MONTHLY!,
  football_quarterly: process.env.STRIPE_PRICE_FOOTBALL_QUARTERLY!,
  football_yearly: process.env.STRIPE_PRICE_FOOTBALL_YEARLY!,

  // ⚽🏀 Combo Futebol + Basquete
  combo_monthly: process.env.STRIPE_PRICE_COMBO_MONTHLY!,
  combo_quarterly: process.env.STRIPE_PRICE_COMBO_QUARTERLY!,
  combo_yearly: process.env.STRIPE_PRICE_COMBO_YEARLY!,
}

export async function POST(req: Request) {
  try {
    const { plan } = await req.json()

    if (!plan || !priceMap[plan]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 })
    }

    // Cria sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceMap[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Erro no checkout:", err)
    return NextResponse.json(
      { error: err.message || "Erro interno" },
      { status: 500 }
    )
  }
}
