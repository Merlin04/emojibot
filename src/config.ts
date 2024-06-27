const config = {
    channel: process.env.SLACK_CHANNEL!,
    slackWorkspace: process.env.SLACK_WORKSPACE!,
    admins: process.env.ADMINS?.split(",") ?? [],
};

export default config;
