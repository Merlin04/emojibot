import config from "../config";
import { SlackApp } from "slack-edge";
import { humanizeSlackError } from "../utils/translate";
import { $ } from "bun";

async function reuploadEmoji(emojiName: string, emojiURL: string, user: string) {
    const form = new FormData();
    form.append("token", process.env.SLACK_BOT_USER_TOKEN!);
    form.append("mode", "data");
    form.append("name", emojiName);
    const imgBuffer = await fetch(emojiURL, {
        headers: {
            Cookie: process.env.SLACK_COOKIE!,
        },
    }).then((res) => res.blob());

    const randomUUID = crypto.randomUUID();
    console.log("writing to tmp", randomUUID);
    await Bun.write(`tmp/${randomUUID}.png`, imgBuffer);
    const blob = await Bun.file(`tmp/${randomUUID}.png`);

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

    console.log(res.ok ? `💾 User ${user} readded the ${emojiName} emoji` : `💥 User ${user} failed to readd the ${emojiName} emoji: ${res.error}`);

    return res.ok
        ? `:${emojiName}: has been readded, thanks <@${user}>!`
        : `Failed to readd emoji:
\`\`\`
${humanizeSlackError(res)}
\`\`\``
}

const feature3 = async (
    app: SlackApp<{
        SLACK_SIGNING_SECRET: string;
        SLACK_BOT_TOKEN: string;
        SLACK_APP_TOKEN: string;
    }>
) => {
    app.view(
        "retry_view",
        async () => { },
        async ({ context, payload }) => {
            const meta = JSON.parse(payload.view.private_metadata) as {
                emoji: string;
                emojiURL: string;
                thread_ts: string;
                user: string;
            };

            const status = await reuploadEmoji(meta.emoji, meta.emojiURL, meta.user);
            await context.client.chat.postMessage({
                channel: config.channel,
                thread_ts: meta.thread_ts,
                text: status,
            });
        }
    );
};

export default feature3;
