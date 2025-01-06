import type { SlackApp } from "slack-edge";
import { $ } from "bun";
import config from "../config";
import { humanizeSlackError } from "../utils/translate";

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
            // only listen for payloads in #emojibot that have a file attached
            return;
        }
        if (payload.text.split(" ").length > 1) {
            context.client.chat.postEphemeral({
                channel: payload.channel,
                user: payload.user,
                text: "Please only send one emoji at a time",
            });
            return;
        }
        if (!payload.files || payload.files.length === 0) {
            context.client.chat.postEphemeral({
                text: "Please attach an image to your message",
                channel: payload.channel,
                user: payload.user,
            });
            return;
        }
        if (payload.text.length > 100) {
            context.client.chat.postEphemeral({
                text: "Please keep your name under 100 characters",
                channel: payload.channel,
                user: payload.user,
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
                Cookie: process.env.SLACK_COOKIE!,
            },
        }).then((res) => res.blob());

        const randomUUID = crypto.randomUUID();
        await Bun.write(`tmp/${randomUUID}.png`, imgBuffer);
        const blob = Bun.file(`tmp/${randomUUID}.png`);

        form.append("image", blob);

        // No idea how much of this is necessary but I don't feel like figuring it out
        const res = await fetch(
            `https://${config.slackWorkspace}.slack.com/api/emoji.add`,
            {
                credentials: "include",
                method: "POST",
                body: form,
                headers: {
                    Cookie: `Cookie ${process.env.SLACK_COOKIE}`,
                },
            }
        ).then((res) => res.json() as Promise<{ ok: boolean; error?: string }>);

        await $`rm tmp/${randomUUID}.png`;

        console.log(
            res.ok
                ? `💾 User ${payload.user} added the ${emojiName} emoji`
                : `💥 User ${payload.user} failed to add the ${emojiName} emoji: ${res.error}`
        );

        context.say({
            text: res.ok
                ? `:${emojiName}: has been added, thanks <@${payload.user}>!`
                : `Failed to add emoji:
\`\`\`
${humanizeSlackError(res)}
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
