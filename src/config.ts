const config = {
    channel: "C02T3CU03T3",
    reqHeaders: {
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
    },
    admins: ["U01FGQ5V9L5"],
};

export default config;
