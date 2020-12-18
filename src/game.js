class RandomGuessGame {
  constructor(noOfTries, randomNumberGenerator) {
      //TODO: noOfTries cannot be less than 1
    if (noOfTries < 1) {
        throw new Error("No of tries should be atleast 1")
    }
    this.secret = randomNumberGenerator();
    this.status = {
      guessedCorrect: false,
      remainingTries: noOfTries,
      gameOver: false,
    };
  }

  guess(value) {
    if (this.status.gameOver) return { ...this.status };

    this.status.remainingTries--;

    if (value === this.secret) {
      this.status.guessedCorrect = true;
      this.status.gameOver = true;
      return { ...this.status };
    }

    const exceededTries = this.status.remainingTries === 0;
    if (exceededTries) {
      this.status.gameOver = true;
      return { ...this.status };
    }

    if (value > this.secret) {
      return { ...this.status, is_greater: true };
    }
    return { ...this.status, is_greater: false };
  }
}

module.exports = RandomGuessGame;