import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const SYSTEM_PROMPT = `
Ты — психологический помощник.
Отвечай спокойно и поддерживающе.
`;

const memory = {};

async function getAIResponse(userId, message) {
  if (!memory[userId]) memory[userId] = [];

  memory[userId].push({ role: "user", content: message });

  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...memory[userId].slice(-5)
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }
  );

  const reply = res.data.choices[0].message.content;

  memory[userId].push({ role: "assistant", content: reply });

  return reply;
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  const reply = await getAIResponse(chatId, text);
  bot.sendMessage(chatId, reply);
});

console.log("Bot started 🚀");
