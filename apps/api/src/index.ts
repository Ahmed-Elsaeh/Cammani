import { createApp } from "./app";
import { config } from "./config";

async function main() {
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`🚀 Cammani API running on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
