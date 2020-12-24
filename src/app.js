const RandomGuessGame = require("./game");
const randomIntegerInInterval = require("./random");
const { write, read } = require("./persist");

const createNewGame = () => {
  const noOfTries = 3;
  const guessRange = { min: 1, max: 10 };
  const randomNumberGenerator = () => randomIntegerInInterval(guessRange);
  return new RandomGuessGame(noOfTries, randomNumberGenerator);
};

const startGame = async (user) => {
  const game = createNewGame();
  const { error } = await write.newPlayerStatus(user, game);
  if (error) {
    return {
      message: `Sorry <@${user}>!\n Something went wrong. Please try again :(`,
    };
  }
  return {
    message: `Hey there <@${user}>!\nWelcome to the Slack Bot Game, try and guess what number I am thinking of between 0 and 10`,
  };
};

const playGameIfActive = async (user, guessValue) => {
  const result = {
    is_player: false,
    message: "",
  };

  const { error, exists, playerStatus } = await read.latestPlayerStatusIfExists(
    user
  );
  if (error || !exists || playerStatus.gameOver) {
    return result;
  }

  result.is_player = exists;

  const game = new RandomGuessGame(
    playerStatus.remainingTries,
    () => playerStatus.correctGuess
  );
  const status = game.guess(guessValue);

  const { error: errorUpdating } = await write.existingPlayerStatus(playerStatus._id, game);
  if (errorUpdating) {
    result.message = "Something went wrong!";
    return result;
  }

  if (status.guessedCorrect) {
    result.message =
      "Congratulations! You guessed the number I was thinking of!";
    return result;
  }

  if (status.gameOver) {
    result.message = "Sorry! Your tries are over :(";
    return result;
  }

  if (status.is_greater) {
    result.message = "The number I'm thinking of is lower";
    return result;
  }
  result.message = "The number I'm thinking of is higher";
  return result;
};

module.exports = {
  startGame,
  playGameIfActive,
};
