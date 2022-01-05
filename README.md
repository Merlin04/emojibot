# Emojibot

Simple slack bot to add emoji to your workspace when a user posts a message in a channel with an image and emoji name.

Environment variables:
```env
SLACK_SIGNING_SECRET=
SLACK_BOT_TOKEN=
SLACK_APP_TOKEN=

SLACK_BOT_USER_TOKEN=[user token of an actual user, you can get this from devtools when signed in as that user]
SLACK_COOKIE=[the cookie string when signed in as that user]
```