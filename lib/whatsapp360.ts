export async function sendWhatsApp(to: string, body: string) {
  try {
    const resp = await fetch(process.env.WHATSAPP_API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "D360-API-KEY": process.env.WHATSAPP_API_KEY as string,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    })

    const data = await resp.json()
    console.log("Resposta WhatsApp:", data)
    return data
  } catch (err) {
    console.error("Erro geral:", err)
    throw err
  }
}
