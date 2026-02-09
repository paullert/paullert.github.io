// let correctNumber = Math.ceil(Math.random() * 100) - 1
let correctNumber = 13;
let playerGuesses = 0
let playerWins = 0
let playerLosses = 0

let correctMessage = "You guessed within 7 attempts!"
let incorrectMessage = "You got it wrong!"
let invalidMessage = "Please enter a number between 1 and 100."
let lossMessage = "You lose! The correct number was " + correctNumber;
let highMessage = "You guessed too high!"
let lowMessage = "You guessed too low!"

let guessHistory = []

let guessInput = document.querySelector("#guessInput");
let guessButton = document.querySelector("#guessButton");
let guessResult = document.querySelector("#guessResult");
let numGuessesDiv = document.querySelector("#numGuesses");
let guessHistoryDiv = document.querySelector("#guessHistory");
let guessHint = document.querySelector("#guessHint");
let playAgainButton = document.getElementById("playAgainButton")

function validateGuess(guess) {
  if (isNaN(guess)) {
    return false;
  } else if (guess < 1 || guess > 100) {
    return false;
  }
  return true;
}

function resetGame(params) {
  correctNumber = Math.ceil(Math.random() * 100) - 1;
  playerGuesses = 0;
  guessHistory = [];
  guessInput.value = "";
  guessResult.textContent = "Enter a value";
  guessResult.style.color = "black";
  numGuessesDiv.textContent = "Number of Guesses:";
  guessHistoryDiv.textContent = "Your Current Guesses Are:";
  guessHint.textContent = "Hint:";
  playAgainButton.hidden = true
}


guessButton.addEventListener("click", function () {
  guess = parseInt(guessInput.value);
  if (!validateGuess(guess)) {
    guessResult.textContent = invalidMessage;
    return
  }
  playerGuesses++
  numGuessesDiv.textContent = `Number of Guesses: ${playerGuesses}`
  guessHistory.push(guess)
  guessHistoryDiv.textContent = `Your Current Guesses are ${guessHistory}`
    if (correctNumber == guessInput.value) {
        guessResult.textContent = correctMessage;
        guessResult.style.color = "green";
        playAgainButton.hidden = false
    } else if (playerGuesses === 7) {
        guessResult.textContent = lossMessage;
        guessResult.style.color = "red";
    } else {
        guessResult.textContent = incorrectMessage;
        guessResult.style.color = "black";

        if (guess < correctNumber) {
            guessHint.textContent = lowMessage;
        } else {
            guessHint.textContent = highMessage;
        }
    }

});

playAgainButton.addEventListener("click", function() {
  resetGame()
});