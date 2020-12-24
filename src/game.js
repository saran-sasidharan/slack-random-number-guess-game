class RandomGuessGame {
  #secret
  constructor(noOfTries, randomNumberGenerator) {
    if (noOfTries < 1) {
      throw new Error("No of tries should be atleast 1");
    }
    this.#secret = randomNumberGenerator();
    this.status = {
      guessedCorrect: false,
      remainingTries: noOfTries,
      gameOver: false,
    };
  }

  get secret() {
   return this.#secret; 
  }

  guess(value) {
    if (this.status.gameOver) return { ...this.status };

    this.status.remainingTries--;

    if (value === this.#secret) {
      this.status.guessedCorrect = true;
      this.status.gameOver = true;
      return { ...this.status };
    }

    const exceededTries = this.status.remainingTries === 0;
    if (exceededTries) {
      this.status.gameOver = true;
      return { ...this.status };
    }

    if (value > this.#secret) {
      return { ...this.status, is_greater: true };
    }
    return { ...this.status, is_greater: false };
  }
}

module.exports = RandomGuessGame;
