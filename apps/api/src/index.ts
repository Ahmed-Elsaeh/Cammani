import { createApp } from "./app";
import { connectDB } from "./lib/db";
import { config } from "./config";

async function main() {
  await connectDB();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`🚀 Cammani API running on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
