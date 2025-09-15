import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase'

export const config = { api: { bodyParser: false } }

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = []
    readable.on('data', (chunk) => chunks.push(chunk))
    readable.on('end', () => resolve(Buffer.concat(chunks)))
    readable.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
  const sig = req.headers['stripe-signature']
  const buf = await buffer(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object
      const email = s.customer_details?.email || null
      const phone = s.customer_details?.phone || null
      // Ativa assinante pelo telefone se existir, senão cria
      if (phone) {
        const { data: subs } = await supabaseAdmin.from('subscribers').select('id').eq('phone', phone).limit(1)
        if (subs && subs.length) {
          await supabaseAdmin.from('subscribers').update({ active: true }).eq('id', subs[0].id)
        } else {
          await supabaseAdmin.from('subscribers').insert([{ phone, active: true }])
        }
      }
      // (Opcional) relacione email a users
      if (email) {
        const { data: users } = await supabaseAdmin.from('users').select('id').eq('email', email).limit(1)
        if (!users || !users.length) await supabaseAdmin.from('users').insert([{ email }])
      }
    }

    if (event.type === 'customer.subscription.deleted' || event.type === 'invoice.payment_failed') {
      // Sem mapear por customer_id, vamos desativar por telefone no metadata (se usar mais tarde)
      // Aqui, como fallback, não desativamos ninguém específico (adapte conforme seu mapeamento real).
    }

    res.json({ received: true })
  } catch (e) {
    console.error('stripe webhook handler error', e)
    res.status(500).json({ error: 'internal error' })
  }
}
