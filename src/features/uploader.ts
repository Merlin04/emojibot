import { App } from "@slack/bolt";

const convertPermalink = (url: string, name: string) => {
    const arr = url.split(/\/|-/);
    const l = arr.length;

    return `https://files.slack.com/files-pri/${arr[l - 3]}-${
        arr[l - 2]
    }/${name.toLowerCase()}?pub_secret=${arr[l - 1]}`;
};

const feature1 = async (app: App) => {
    app.message("", async ({ message, say }) => {
        if (
            message.subtype !== "file_share" ||
            message.channel !== "C02T3CU03T3" // only listen for messages in #emojibot
        )
            return;
        if (!message.files || message.files.length === 0) {
            say("Make sure to send a file");
            return;
        }

        const { file } = await app.client.files.sharedPublicURL({
            file: message.files[0].id,
            token: process.env.SLACK_BOT_USER_TOKEN,
        });

        try {
            const emojiName =
                message.text.startsWith(":") && message.text.endsWith(":")
                    ? message.text.slice(1, -1)
                    : message.text;

            const res = await app.client.admin.emoji.add({
                name: emojiName,
                url: convertPermalink(file.permalink_public, file.name),
            });

            say({
                text: res.ok
                    ? `:${emojiName}: has been added, thanks <@${message.user}>!`
                    : `Failed to add emoji:
            \`\`\`
            ${JSON.stringify(res, null, 4)}
            \`\`\``,
                thread_ts: message.ts,
            });
            if (res.ok)
                await app.client.reactions.add({
                    name: emojiName,
                    channel: message.channel,
                    timestamp: message.ts,
                });
        } catch (err) {
            console.error(err);
        }
    });
};

export default feature1;
