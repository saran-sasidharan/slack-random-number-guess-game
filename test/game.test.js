const RandomGuessGame = require("../src/game");

describe("game logic testing", () => {
  test("throws exception if number of tries passed to start game is less than 1", () => {
    const noOfTriesArray = [0, -1, -5];
    const randomGenerator = () => 1;
    noOfTriesArray.forEach((noOfTries) =>
      expect(() => new RandomGuessGame(noOfTries, randomGenerator)).toThrow(
        Error
      )
    );
  });

  test("correct guessing should return positive status & set game as over", () => {
    const correctGuess = 1;
    const noOfTries = 1;
    const game = new RandomGuessGame(noOfTries, () => correctGuess);

    const status = game.guess(correctGuess);

    expect(status.guessedCorrect).toBe(true);
    expect(status.gameOver).toBe(true);
  });

  test("wrong guess when retries are available should return negative status, reduce number of tries by one & should not set game as over", () => {
    const correctGuess = 1;
    const noOfTries = 2;
    const game = new RandomGuessGame(noOfTries, () => correctGuess);

    const wrongGuess = 2;
    const status = game.guess(wrongGuess);

    expect(status.guessedCorrect).toBe(false);
    expect(status.gameOver).toBe(false);
    expect(status.remainingTries).toBe(noOfTries - 1);
  });

  test("wrong guess at last try should return negative status & set game as over", () => {
    const correctGuess = 1;
    const noOfTries = 1;
    const game = new RandomGuessGame(noOfTries, () => correctGuess);

    const wrongGuess = 2;
    const status = game.guess(wrongGuess);

    expect(status.guessedCorrect).toBe(false);
    expect(status.gameOver).toBe(true);
  });

  test("returns greater than status if guess is large", () => {
    const correctGuess = 5;
    const noOfTries = 2;
    const game = new RandomGuessGame(noOfTries, () => correctGuess);

    const greaterGuess = 6;
    const status = game.guess(greaterGuess);

    expect(status.is_greater).toBe(true);
  });

  test("returns not greater than status if guess is small", () => {
    const correctGuess = 5;
    const noOfTries = 2;
    const game = new RandomGuessGame(noOfTries, () => correctGuess);

    const smallerGuess = 4;
    const status = game.guess(smallerGuess);

    expect(status.is_greater).toBe(false);
  });
});
