import config from "../config";
import { SlackApp } from "slack-edge";
import { humanizeSlackError } from "../utils/translate";

async function deleteEmoji(emojiName: string, user: string) {
    const form = new FormData();
    form.append("_x_reason", "customize-emoji-remove");
    form.append("_x_mode", "online");
    form.append("name", emojiName);
    form.append("token", process.env.SLACK_BOT_USER_TOKEN!);
    const res = await fetch(
        `https://${config.slackWorkspace}.slack.com/api/emoji.remove`,
        {
            method: "POST",
            headers: {
                Cookie: `Cookie ${process.env.SLACK_COOKIE}`,
            },
            body: form,
        }
    ).then((res) => res.json() as Promise<{ ok: boolean, error?: string }>);

    console.log(res.ok ? `🗑️  User ${user} deleted the ${emojiName} emoji` : `💥 User ${user} failed to delete the ${emojiName} emoji: ${res.error}`);

    return res.ok
        ? `:${emojiName}: has been removed, thanks <@${user}>!`
        : `Failed to remove emoji:
\`\`\`
${humanizeSlackError(res)}
\`\`\``;
}

const feature3 = async (
    app: SlackApp<{
        SLACK_SIGNING_SECRET: string;
        SLACK_BOT_TOKEN: string;
        SLACK_APP_TOKEN: string;
    }>
) => {
    app.view(
        "delete_view",
        async () => { },
        async ({ context, payload }) => {
            const meta = JSON.parse(payload.view.private_metadata) as {
                emoji: string;
                thread_ts: string;
                user: string;
            };

            const status = await deleteEmoji(meta.emoji, meta.user);
            await context.client.chat.postMessage({
                channel: config.channel,
                thread_ts: meta.thread_ts,
                text: status,
            });
        }
    );
};

export default feature3;
