require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// Listen locally; on Vercel, the exported app is handled by Vercel's Express runtime
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(` 🏆 DryFruitKart API Server Started`);
    console.log(` 🔴 Theme: RCB 2026 (Red · Black · Gold)`);
    console.log(` ⚡ Listening on: http://localhost:${PORT}`);
    console.log(`=============================================`);
  });
}

module.exports = app;

