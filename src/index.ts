import { SlackApp } from "slack-edge";
import * as features from "./features/index";

const app = new SlackApp({
    env: {
        SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET!,
        SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN!,
        SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN!,
    },
});

for (const [feature, handler] of Object.entries(features)) {
    console.log(`Loading ${feature}`);
    handler(app);
}

export default {
    port: 3000,
    async fetch(request) {
        return await app.run(request);
    },
};
