import { SlackApp } from "slack-edge";
import * as features from "./features/index";
const version = require("../package.json").version;

console.log("----------------------------------\nEmojiBot Server\n----------------------------------\n")
console.log(`🚀 Loading EmojiBot v${version}`);

const app = new SlackApp({
    env: {
        SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET!,
        SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN!,
        SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN!,
    },
});

console.log("🏗️  Starting EmojiBot...");

console.log(`⚒️  Loading ${Object.entries(features).length} features...`);
for (const [feature, handler] of Object.entries(features)) {
    console.log(`📦 ${feature} loaded`);
    handler(app);
}

export default {
    port: 3000,
    async fetch(request) {
        return await app.run(request);
    },
};

console.log("🚀 Server Started in", Bun.nanoseconds() / 1000000, "milliseconds on version:", version + "!", "\n\n----------------------------------\n")