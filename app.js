const {App, LogLevel} = require('@slack/bolt')

const logLevel = process.env.PRODUCTION === "true" ? LogLevel.INFO : LogLevel.DEBUG;

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    logLevel
});

const run = async () => {
    const port = process.env.PORT || 3000;
    await app.start(port);

    console.debug(`Listening on port ${port}`);
    console.log("⚡️ Bolt app is running!")
}

run();