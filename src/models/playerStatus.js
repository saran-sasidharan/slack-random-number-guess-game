const mongoose = require("mongoose")

const playerStatusSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    gameOver: {
        type: Boolean,
        required: true
    },
    remainingTries: {
        type: Number,
        required: true
    },
    correctGuess: {
        type: Number,
        required: true
    },
    startedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = new mongoose.model("PlayerStatus", playerStatusSchema)