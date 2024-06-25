import fetch from "node-fetch";
import config from "../config";
import { SlackApp } from "slack-edge";
import { unlinkSync } from "node:fs";
import { $ } from "bun";

const feature1 = async (
    app: SlackApp<{
        SLACK_SIGNING_SECRET: string;
        SLACK_BOT_TOKEN: string;
        SLACK_APP_TOKEN: string;
    }>
) => {
    app.anyMessage(async ({ payload, context }) => {
        if (
            payload.subtype !== "file_share" ||
            payload.channel !== config.channel
        ) {
            // only listen for payloads in #emojibot
            console.log(
                "not in channel",
                payload.channel,
                config.channel,
                payload.subtype
            );
            return;
        }
        if (!payload.files || payload.files.length === 0) {
            console.log("no files");
            context.say({ text: "Make sure to send a file" });
            return;
        }
        if (payload.text.length > 100) {
            console.log("too long");
            context.say({
                text: "Please keep your payload under 100 characters.",
            });
            return;
        }

        const form = new FormData();
        form.append("token", process.env.SLACK_BOT_USER_TOKEN!);
        form.append("mode", "data");
        const emojiName =
            payload.text.startsWith(":") && payload.text.endsWith(":")
                ? payload.text.slice(1, -1).toLowerCase()
                : payload.text.toLowerCase();
        form.append("name", emojiName);
        const imgBuffer = await fetch(payload.files[0].url_private, {
            headers: {
                Cookie: process.env.SLACK_COOKIE,
            },
        }).then((res) => res.buffer());

        const randomUUID = crypto.randomUUID();
        Bun.write(`tmp/${randomUUID}.png`, imgBuffer);
        const blob = await Bun.file(`tmp/${randomUUID}.png`);
        await $`rm tmp/${randomUUID}.png`.quiet();

        form.append("image", blob);

        // No idea how much of this is necessary but I don't feel like figuring it out
        const res = await fetch(
            "https://thepurplebubble.slack.com/api/emoji.add",
            {
                credentials: "include",
                method: "POST",
                body: form,
                headers: {
                    Cookie: `Cookie ${process.env.SLACK_COOKIE}`,
                },
            }
        ).then((res) => res.json() as Promise<{ ok: boolean }>);

        console.log(res);

        // No idea how much of this is necessary but I don't feel like figuring it out
        context.say({
            text: res.ok
                ? `:${emojiName}: has been added, thanks <@${payload.user}>!`
                : `Failed to add emoji:
\`\`\`
${JSON.stringify(res, null, 4)}
\`\`\``,
            thread_ts: payload.ts,
        });
        if (res.ok)
            await app.client.reactions.add({
                name: emojiName,
                channel: payload.channel,
                timestamp: payload.ts,
            });
    });
};

export default feature1;
