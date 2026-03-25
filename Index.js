const express = require("express");
const app = express();

// Главная страница
app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

// Порт (ВАЖНО для Railway)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
