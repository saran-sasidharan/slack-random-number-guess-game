const { App, LogLevel } = require("@slack/bolt");
const mongoose = require("mongoose");
const { startGame, playGameIfActive } = require("./app");

const logLevel =
  process.env.PRODUCTION === "true" ? LogLevel.INFO : LogLevel.DEBUG;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel,
});

const uri = `${process.env.DB_CONNECTION_STRING}/test1?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.event("app_mention", async ({ event, say }) => {
  const { message } = await startGame(event.user);
  await say(message);
});

app.message(/^ *[1-9] *$/, async ({ message, context, say }) => {
  const guess = parseInt(context.matches[0]);
  const { is_player, message: msg } = await playGameIfActive(message.user, guess);
  if (!is_player) {
    return;
  }
  await say(msg);
});

app.command("/botgame", async ({ command, ack, say }) => {
  await ack();
  if (command.text.includes("start")) {
    const { message } = await startGame(command.user_id);
    await say(message);
  }
});

const run = async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);

  console.debug(`Listening on port ${port}`);
  console.log("⚡️ Bolt app is running!");
};

run();
