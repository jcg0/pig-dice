"use strict";

const getElement = selector => document.querySelector(selector);

class Die {
    roll() {
        // return random number between 1 and 6
        return Math.floor(Math.random() * 6) + 1;
    }
}


class Player {
    constructor(username = "") {
        this.username = username;
        this.totalScore = 0;
        this.turnScore = 0;
        this.rollValue = 0;
    }

    // reset player scores
    reset() {
        this.totalScore = 0;
        this.turnScore = 0;
        this.rollValue = 0;
    }

    // start of a turn: clear score and last roll value
    startTurn() {
        this.turnScore = 0;
        this.rollValue = 0;
    }

    // take a turn by rolling the die
    rollDie(die) {
        this.rollValue = die.roll();
        if (this.rollValue === 1) {
            this.turnScore = 0;
            return false;
        } else {
            this.turnScore += this.rollValue;
            return true;
        }
    }

    // add turnScore to totalScore and end turn
    hold() {
        this.totalScore += this.turnScore;
        this.turnScore = 0;
    }

    // did player bust on last roll
    isBusted() {
        return this.rollValue === 1;
    }

    // did player win
    hasWon(targetScore = 30) {
        return this.totalScore >= targetScore;
    }
}


const game = {
    die: new Die(),
    player1: new Player(),
    player2: new Player(),
    currentPlayer: null,
    targetScore: 30,

    player1Input: null,
    player2Input: null,
    score1Input: null,
    score2Input: null,
    dieInput: null,
    totalInput: null,
    currentSpan: null,
    messageLabel: null,
    turnSection: null,
    newGameButton: null,
    rollButton: null,
    holdButton: null,

    // runs one time when the page loads
    init() {
        this.player1Input = getElement("#player1");
        this.player2Input = getElement("#player2");
        this.score1Input = getElement("#score1");
        this.score2Input = getElement("#score2");
        this.dieInput = getElement("#die");
        this.totalInput = getElement("#total");
        this.currentSpan = getElement("#current");
        this.messageLabel = getElement("#message");
        this.turnSection = getElement("#turn");
        this.newGameButton = getElement("#new_game");
        this.rollButton = getElement("#roll");
        this.holdButton = getElement("#hold");

        // buttons storing the functions to be called on click
        this.newGameButton.addEventListener("click", () => this.startNewGame());
        this.rollButton.addEventListener("click", () => this.rollDie());
        this.holdButton.addEventListener("click", () => this.holdTurn());

        this.player1Input.focus();

        
    },

    // starts a new game when 2 players have entered their names and click New Game
    startNewGame() {
        const p1Name = this.player1Input.value.trim();
        const p2Name = this.player2Input.value.trim();

        if (p1Name === "" || p2Name === "") {
            this.messageLabel.textContent = "Both players must enter a name.";
            this.turnSection.classList.add("hide");
            return;
        }

        this.player1.username = p1Name;
        this.player2.username = p2Name;
        this.resetGame();
        
        // player 1 starts
        this.currentPlayer = this.player1;
        this.currentPlayer.startTurn();
        this.updateCurrentPlayerDisplay();
        this.updateScores();
        this.turnSection.classList.remove("hide");
    },

    // resets the game state to start a new game
    resetGame() {
        this.player1.reset();
        this.player2.reset();
        this.dieInput.value = "";
        this.totalInput.value = 0;
        this.messageLabel.textContent = "";
        this.updateScores();
    },

    // rolls the die for the current player
    rollDie() {
        if (!this.currentPlayer) return;

        const stillRolling = this.currentPlayer.rollDie(this.die);

        this.dieInput.value = this.currentPlayer.rollValue;

        if (!stillRolling) {
            this.totalInput.value = 0;
            this.messageLabel.textContent = `${this.currentPlayer.username} rolled a 1 and lost all points!`;
            this.switchPlayer();
        } else {
            this.totalInput.value = this.currentPlayer.turnScore;
            this.messageLabel.textContent = `${this.currentPlayer.username} rolled a ${this.currentPlayer.rollValue}.`;
        }
    },

    // holds the turn for the current player and calls switch players method
    holdTurn() {
        if (!this.currentPlayer) return;

        this.currentPlayer.hold();
        this.updateScores();

        if (this.gameWon()) {
            return;
        }

        this.switchPlayer();
    },

    // switches the current player
    switchPlayer() { 
        this.totalInput.value = 0;
        this.dieInput.value = "";

        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        this.currentPlayer.startTurn();
        this.updateCurrentPlayerDisplay();
    },

    // updates the score input fields
    updateScores() {
        this.score1Input.value = this.player1.totalScore;
        this.score2Input.value = this.player2.totalScore;
        if (this.currentPlayer) {
            this.totalInput.value = this.currentPlayer.turnScore;
        }
    },

    // updates the display of the current player's name
    updateCurrentPlayerDisplay() {
        this.currentSpan.textContent = this.currentPlayer.username;
    },

    // checks if the current player has won the game
    gameWon() {
        if (this.player1.hasWon(this.targetScore)) {
            this.messageLabel.textContent = `${this.player1.username} wins the game with ${this.player1.totalScore} points!`;
            this.turnSection.classList.add("hide");
            return true;
        }
        return false; 
    }
};

document.addEventListener("DOMContentLoaded", () => {
    game.init();
});