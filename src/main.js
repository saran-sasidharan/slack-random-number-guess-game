const { App, LogLevel } = require("@slack/bolt");
const { startGame, isPlayer, getUpdatedGameStatus } = require("./app");

const logLevel =
  process.env.PRODUCTION === "true" ? LogLevel.INFO : LogLevel.DEBUG;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel,
});

app.event("app_mention", async ({ event, say }) => {
  startGame(event.user);
  await say(
    `Hey there <@${event.user}>!\nWelcome to the Slack Bot Game, try and guess what number I am thinking of between 0 and 10`
  );
});

app.message(/^ *[1-9] *$/, async ({ message, context, say }) => {
  if (!isPlayer(message.user)) {
    return;
  }
  const guess = parseInt(context.matches[0]);
  await say(getUpdatedGameStatus(message.user, guess));
});

app.command("/botgame", async ({ command, ack, say }) => {
  await ack();
  if (command.text.includes("start")) {
    startGame(command.user);
    await say(
      `Hey there <@${command.user}>!\nWelcome to the Slack Bot Game, try and guess what number I am thinking of between 0 and 10`
    );
  }
});

const run = async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);

  console.debug(`Listening on port ${port}`);
  console.log("⚡️ Bolt app is running!");
};

run();
