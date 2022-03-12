import * as FormData from "form-data";
import { App } from "@slack/bolt";
import fetch from "node-fetch";
import config from "../config";

async function deleteEmoji(emojiName: string, user: string) {
    const form = new FormData();
    form.append("_x_reason", "customize-emoji-remove");
    form.append("_x_mode", "online");
    form.append("name", emojiName);
    form.append("token", process.env.SLACK_BOT_USER_TOKEN);
    const res = await fetch(
        "https://hackclub.slack.com/api/emoji.remove?_x_id=9791fced-1647058806.077&slack_route=T0266FRGM&_x_version_ts=no-version&fp=a3",
        {
            method: "POST",
            headers: {
                ...config.reqHeaders,
                "Content-Length": form.getLengthSync().toString(),
                ...form.getHeaders(),
            },
            body: form.getBuffer(),
        }
    ).then((res) => res.json() as Promise<{ ok: boolean }>);
    return res.ok
        ? `:${emojiName}: has been removed, thanks <@${user}>!`
        : `Failed to remove emoji:
\`\`\`
${JSON.stringify(res, null, 4)}
\`\`\``;
}

const feature3 = async (app: App) => {
    app.view("delete_view", async ({ client, ack, view }) => {
        await ack();
        console.log("sususususssdfdssf");
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
