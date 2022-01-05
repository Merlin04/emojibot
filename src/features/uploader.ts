import { App } from "@slack/bolt";
import fetch from "node-fetch";
import * as FormData from "form-data";

const feature1 = async (app: App) => {
    app.message("", async ({ message, say }) => {
        if (message.subtype !== "file_share") return;
        if (!message.files || message.files.length === 0) {
            say("Make sure to send a file");
            return;
        }
        // const res = await app.client.admin.emoji.add({
        // 	name: message.text.startsWith(":") && message.text.endsWith(":") ? message.text.slice(1, -1) : message.text,
        // 	url: message.files[0].url_private
        // });
        const form = new FormData();
        form.append("mode", "data");
        const emojiName =
            message.text.startsWith(":") && message.text.endsWith(":")
                ? message.text.slice(1, -1)
                : message.text;
        form.append("name", emojiName);
        const imgBuffer = await fetch(message.files[0].url_private, {
            headers: {
                Cookie: process.env.SLACK_COOKIE,
            },
        }).then((res) => res.buffer());
        form.append("image", imgBuffer, {
            filename: message.files[0].name,
            contentType: message.files[0].mimetype,
            knownLength: imgBuffer.length,
        });
        form.append("url", message.files[0].url_private);
        form.append("token", process.env.SLACK_BOT_USER_TOKEN);
        form.append("_x_reason", "customize-emoji-add");
        form.append("_x_mode", "online");
        form.append("_x_sonic", "true");

        // No idea how much of this is necessary but I don't feel like figuring it out
        const res = await fetch("https://hackclub.slack.com/api/emoji.add", {
            credentials: "include",
            method: "POST",
            mode: "cors",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 11.0; WOW64; x64; rv:93.0esr) Gecko/20010101 Firefox/93.0esr/Yp6557blmseFJz",
                Accept: "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "Sec-GPC": "1",
                Pragma: "no-cache",
                "Cache-Control": "no-cache",
                Cookie: process.env.SLACK_COOKIE,
                TE: "trailers",
                Origin: "https://app.slack.com",
                Host: "hackclub.slack.com",
                DNT: "1",
                Connection: "keep-alive",
                "Content-Length": form.getLengthSync().toString(),
                ...form.getHeaders(),
            },
            body: form.getBuffer(),
        }).then((res) => res.json());
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
    });
};

export default feature1;
