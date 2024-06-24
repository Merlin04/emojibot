import { App, View } from "@slack/bolt";
import config from "../config";
import { SlackApp } from "slack-edge";

function deleteView(emoji: string, thread_ts: string, user: string): View {
    return {
        callback_id: "delete_view",
        type: "modal",
        title: {
            type: "plain_text",
            text: "Confirm Deletion",
        },
        submit: {
            type: "plain_text",
            text: "Confirm",
            emoji: true,
        },
        close: {
            type: "plain_text",
            text: "Cancel",
            emoji: true,
        },
        private_metadata: JSON.stringify({ emoji, thread_ts, user }),
        blocks: [
            {
                type: "context",
                elements: [
                    {
                        type: "plain_text",
                        text: `Delete :${emoji}:?`,
                        emoji: true,
                    },
                ],
            },
        ],
    };
}

function errorView(reason: string): View {
    return {
        type: "modal",
        title: {
            type: "plain_text",
            text: "Error",
            emoji: true,
        },
        close: {
            type: "plain_text",
            text: "Okay",
            emoji: true,
        },
        blocks: [
            {
                type: "context",
                elements: [
                    {
                        type: "plain_text",
                        text: reason,
                        emoji: true,
                    },
                ],
            },
        ],
    };
}

const feature2 = async (app: SlackApp<{
    SLACK_SIGNING_SECRET: string;
    SLACK_BOT_TOKEN: string;
    SLACK_APP_TOKEN: string;
}>) => {
    app.shortcut(
        { callback_id: "delete_emoji", type: "message_action" },
        async ({ shortcut, ack, client }) => {
            await ack();
            console.log(shortcut);

            if (shortcut.channel.id !== config.channel) {
                await client.views.open({
                    trigger_id: shortcut.trigger_id,
                    view: errorView(
                        "This channel doesn't have any emojis managed by emojibot."
                    ),
                });
                return;
            }

            if (
                shortcut.user.id !== shortcut.message.user &&
                !config.admins.includes(shortcut.user.id)
            ) {
                await client.views.open({
                    trigger_id: shortcut.trigger_id,
                    view: errorView(
                        "Only the OP or authorized admins can delete emojis added with emojibot."
                    ),
                });
                return;
            }

            const emojiName =
                shortcut.message.text.startsWith(":") &&
                    shortcut.message.text.endsWith(":")
                    ? shortcut.message.text.slice(1, -1)
                    : shortcut.message.text;

            await client.views.open({
                trigger_id: shortcut.trigger_id,
                view: deleteView(
                    emojiName,
                    shortcut.message_ts,
                    shortcut.user.id
                ),
            });
        }
    );
};

export default feature2;
