import * as FormData from "form-data";
import { App } from "@slack/bolt";
import fetch from "node-fetch";
import config from "../config";
import { SlackApp } from "slack-edge";

async function deleteEmoji(emojiName: string, user: string) {
    const form = new FormData();
    form.append("_x_reason", "customize-emoji-remove");
    form.append("_x_mode", "online");
    form.append("name", emojiName);
    form.append("token", process.env.SLACK_BOT_USER_TOKEN);
    const res = await fetch("https://thepurplebubble.slack.com/api/emoji.remove", {
        method: "POST",
        headers: {
            ...config.reqHeaders,
            "Content-Length": form.getLengthSync().toString(),
            ...form.getHeaders(),
        },
        body: form.getBuffer(),
    }).then((res) => res.json() as Promise<{ ok: boolean }>);
    return res.ok
        ? `:${emojiName}: has been removed, thanks <@${user}>!`
        : `Failed to remove emoji:
\`\`\`
${JSON.stringify(res, null, 4)}
\`\`\``;
}

const feature3 = async (app: SlackApp<{
    SLACK_SIGNING_SECRET: string;
    SLACK_BOT_TOKEN: string;
    SLACK_APP_TOKEN: string;
}>) => {
    app.view("delete_view", async ({ client, ack, view }) => {
        await ack();
        const meta = JSON.parse(view.private_metadata) as {
            emoji: string;
            thread_ts: string;
            user: string;
        };
        const status = await deleteEmoji(meta.emoji, meta.user);
        await client.chat.postMessage({
            channel: config.channel,
            thread_ts: meta.thread_ts,
            text: status,
        });
    });
};

export default feature3;
