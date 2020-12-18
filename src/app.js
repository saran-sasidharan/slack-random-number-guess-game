const RandomGuessGame = require("./game");
const randomIntegerInInterval = require("./random");

const db = {};

const createNewGame = () => {
  const noOfTries = 3;
  const guessRange = { min: 1, max: 10 };
  const randomNumberGenerator = () => randomIntegerInInterval(guessRange);
  return new RandomGuessGame(noOfTries, randomNumberGenerator);
};

const startGame = (user) => {
  const game = createNewGame();
  db[user] = game;
};

const isPlayer = (user) => {
  return db.hasOwnProperty(user);
};

const getUpdatedGameStatus = (user, guessValue) => {
  const game = db[user];
  const status = game.guess(guessValue);

  if (status.guessedCorrect) {
    delete db[user];
    return "Congratulations! You guessed the number I was thinking of!";
  }

  if (status.gameOver) {
    delete db[user];
    return "Sorry! Your tries are over :(";
  }

  db[user] = game;

  if (status.is_greater) {
    return "The number I'm thinking of is lower";
  }
  return "The number I'm thinking of is higher";
};

module.exports = {
  startGame,
  isPlayer,
  getUpdatedGameStatus,
};
