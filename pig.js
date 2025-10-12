"use strict";

const getElement = selector => document.querySelector(selector);

function rollDie() {
    // return random number between 1 and 6
    return Math.floor(Math.random() * 6) + 1;
}

document.addEventListener("DOMContentLoaded", () => {
let player1 = '';
let player2 = '';
let currentPlayer = '';
let totalScore = 0;
let score1 = 0;
let score2 = 0;

// changes players when they roll a 1 or hold
const switchPlayer = () => {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    getElement("#current").textContent = currentPlayer;
    getElement("#die").value = "";
    getElement("#total").value = 0;
    totalScore = 0;
}

// checks if a player has won the game
const gameWon = () => {
    if ( score1 >= 30) {
        getElement("#message").textContent = `${player1} wins the game with ${score1} points!`;
        getElement("#turn").classList.add("hide");
        return true;
    }
    if ( score2 >= 30) {
        getElement("#message").textContent = `${player2} wins the game with ${score2} points!`;
        getElement("#turn").classList.add("hide");
        return true;
    }
}

    // add click event handler for New Game button
    getElement("#new_game").addEventListener("click", () => {
        const player1El = getElement("#player1").value.trim();
        const player2El = getElement("#player2").value.trim();

        if ( player1El === '' || player2El === '') {
            getElement("#message").textContent = "Both players must enter a name.";
            getElement("#turn").classList.add("hide");
            return;
        }
     
        player1 = player1El;
        player2 = player2El;
        score1 = 0;
        score2 = 0;
        totalScore = 0;

        getElement("#score1").value = 0;
        getElement("#score2").value = 0;
        getElement("#die").value = "";
        getElement("#total").value = 0;
        getElement("#message").textContent = "";
        getElement("#turn").classList.remove("hide");

        
        currentPlayer = player1El;
        getElement("#current").textContent = currentPlayer;
    }); 
    
    // add click event handler for Roll button
    getElement("#roll").addEventListener("click", () => {
        const dieValue = rollDie();
        getElement("#die").value = dieValue;
        if (dieValue === 1) {
            totalScore = 0;
            getElement("#total").value = totalScore;
            getElement("#message").textContent = `${currentPlayer} rolled a 1 and lost all points!`;
            switchPlayer();
        } else {
            totalScore += dieValue;
            getElement("#total").value = totalScore;
            getElement("#message").textContent = `${currentPlayer} rolled a ${dieValue}.`;
        }
    }); 
    
    // add click event handler for Hold button
    getElement("#hold").addEventListener("click", () => {
        if ( currentPlayer === player1) {
            score1 += totalScore;
            getElement("#score1").value = score1;
        } else {
            score2 += totalScore;
            getElement("#score2").value = score2;
        }

        if (gameWon()) {
            return;
        }

        switchPlayer();
    }); 

    // set focus on initial page load
    getElement("#player1").focus();
});