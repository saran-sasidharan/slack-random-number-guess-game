const PlayerStatus = require("./models/playerStatus");

const newPlayerStatus = async (user, game) => {
  const playerStatus = new PlayerStatus({
    userId: user,
    gameOver: game.status.gameOver,
    remainingTries: game.status.remainingTries,
    correctGuess: game.secret,
  });
  try {
    const status = await playerStatus.save();
    console.debug("saved new player status", status);
    return { error: false, playerStatus: status };
  } catch (error) {
    console.error("failed saving new player status", error);
    return { error: true, playerStatus: null };
  }
};

const latestPlayerStatusIfExists = async (user) => {
  try {
    const playerStatus = await PlayerStatus.findOne(
      { userId: user },
      {},
      { sort: { startedAt: -1 } }
    );
    if (playerStatus) {
      console.debug(`getting player, ${user}, status, ${playerStatus._id}`);
      return { error: false, exists: true, playerStatus };
    }
    console.debug(`user, ${user}, not player`);
    return { error: false, exists: false, playerStatus: null };
  } catch (error) {
    console.error("failed getting latest player status", user);
    return { error: true };
  }
};

const existingPlayerStatus = async (playerStatusId, game) => {
  try {
    const playerStatus = await PlayerStatus.updateOne(
      {
        _id: playerStatusId,
      },
      {
        gameOver: game.status.gameOver,
        remainingTries: game.status.remainingTries,
      }
    );
    console.debug("saved existing game status", playerStatus);
    return { error: false, playerStatus };
  } catch (error) {
    console.debug("failed saving existing game status", error);
    return { error: true, playerStatus: null };
  }
};

module.exports = {
  write: {
    newPlayerStatus,
    existingPlayerStatus,
  },
  read: {
    latestPlayerStatusIfExists,
  },
};
