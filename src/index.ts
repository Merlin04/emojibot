import { App } from "@slack/bolt";
import * as features from "./features/index";

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
	socketMode: true,
	appToken: process.env.SLACK_APP_TOKEN
});

void (async function () {
    // Start your app
    await app.start(Number(process.env.PORT) || 3000);

    console.log(`Emojibot is running!`);

    for (const [feature, handler] of Object.entries(features)) {
        handler(app);
        console.log(`Feature "${feature}" has been loaded.`);
    }
})();
