import { App, View } from "@slack/bolt";
import config from "../config";
import { ModalView, SlackApp } from "slack-edge";

function deleteView(emoji: string, thread_ts: string, user: string): ModalView {
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

function errorView(reason: string): ModalView {
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

const feature2 = async (
    app: SlackApp<{
        SLACK_SIGNING_SECRET: string;
        SLACK_BOT_TOKEN: string;
        SLACK_APP_TOKEN: string;
    }>
) => {
    app.shortcut(
        "delete_emoji",
        async () => {},
        async ({ context, payload, body }) => {
            if (context.channelId !== config.channel) {
                await context.client.views.open({
                    trigger_id: payload.trigger_id,
                    view: errorView(
                        "This channel doesn't have any emojis managed by emojibot."
                    ),
                });
                return;
            }

            // check if the user is a workspace admin
            const isAdmin = await app.client.users
                .info({
                    user: body.user.id,
                })
                .then((res) => res.user?.is_admin);

            if (
                body.user.id !== body.message.user &&
                !config.admins.includes(body.user.id) &&
                !isAdmin
            ) {
                await context.client.views.open({
                    trigger_id: payload.trigger_id,
                    view: errorView(
                        "Only the OP or authorized admins can delete emojis added with emojibot."
                    ),
                });
                return;
            }

            const emojiName =
                body.message.text.startsWith(":") &&
                body.message.text.endsWith(":")
                    ? body.message.text.slice(1, -1)
                    : body.message.text;

            await context.client.views.open({
                trigger_id: payload.trigger_id,
                view: deleteView(emojiName, body.message_ts, body.user.id),
            });
        }
    );
};

export default feature2;
