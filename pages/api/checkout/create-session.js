import Stripe from 'stripe'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: (process.env.BASE_URL || 'http://localhost:3000') + '/pricing?success=1',
      cancel_url: (process.env.BASE_URL || 'http://localhost:3000') + '/pricing?canceled=1',
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      metadata: { app: 'palpites.IA' }
    })
    res.status(200).json({ url: session.url })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: String(e) })
  }
}
