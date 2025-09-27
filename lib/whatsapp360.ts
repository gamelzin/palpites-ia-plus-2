import axios from "axios";

const API_URL = process.env.D360_API_URL || "https://waba.360dialog.io/v1/messages";
const API_KEY = process.env.D360_API_KEY!;

if (!API_KEY) {
  console.warn("⚠️ D360_API_KEY não configurada. As mensagens serão apenas simuladas.");
}

export async function sendWhatsApp360(to: string, body: string) {
  if (!API_KEY) {
    console.log(`[SIMULATED SEND] to=${to}\n${body}\n`);
    return { simulated: true };
  }

  try {
    const resp = await axios.post(
      API_URL,
      {
        to,
        type: "text",
        text: { body },
      },
      {
        headers: {
          "D360-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return resp.data;
  } catch (err: any) {
    console.error("[360DIALOG ERROR]", err.response?.data || err.message);
    throw err;
  }
}
