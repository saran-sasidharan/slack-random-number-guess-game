const express = require("express");
const Joi = require("joi");
const axios = require("axios");

const app = express();

// middleware to parse body of request data as json
app.use(express.json());

const VALUES = [1, 2, 3];

const db = {}
let guess = -1;
let tries = 3;

const http = axios.create({
  baseURL: "https://slack.com/api/",
  timeout: 3000,
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
  },
});


app.post("/api/botgame", (req, res) => {
  const payload = req.body;
  console.log(payload)
  res.status(200).send(payload.challenge);
  const channel = payload.event.item.channel;

  if (payload.event.type === "app_mention") {
    if (payload.event.text.includes("start")) {
       chatPostMessage("Welcome to the Slack Bot Game, try and guess what number I am thinking of between 0 and 10", channel)
       guess =  Math.floor(Math.random() * 9) + 1; 
       tries = 3;
    }
    return;
  }

  if (guess === -1) {
      return;
  }

  if (payload.event.type === "message") {
      try {
        const value = parseInt(payload.event.text);
        if (value < 10 && value > 0) {
            tries = tries - 1;
            if (value === guess) {
                chatPostMessage("Congratulations! You guessed the number I was thinking of!", channel)
                return
            }
            if (tries === 0) {
                chatPostMessage("Sorry! Your tries are over :(", channel)
                guess = -1;
                tries = 3;
                return
            }
            if (value < guess) {
                chatPostMessage("The number I'm thinking of is higher", channel)
                return
            }
            chatPostMessage("The number I'm thinking of is lower", channel)
            return
        }
      } catch (error) {
          console.error(error)
      }
  }
});

const chatPostMessage = async (text, channel) => {
  const url = "chat.postMessage";
  try {
    const response = await http.post(url, { text, channel });
    console.log(
      `Succesfully posted message\n
      channel: ${channel}\n
      text: ${text}`
    );
  } catch (error) {
    console.error(
      `Failed posting message\n
      channel: ${channel}\n
      text: ${text}\n
      status: ${error.response.status}\n
      error: ${error}`
    );
  }
};

app.get("/api/courses", (req, res) => {
  res.send(VALUES);
});

app.get("/api/courses/:id", (req, res) => {
  const schema = Joi.object({
    name: Joi.number().min(0).max(2).required(),
  });

  const result = schema.validate({ name: parseInt(req.params.id) });
  if (result.error) {
    return res.status(400).send(result.error);
  }
  res.send(`${VALUES[req.params.id]}`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// req.params
// req.query
// req.body // require express json middleware
