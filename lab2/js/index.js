// Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

// Global Vars
let rNum; // Random Number
let attempts = 0; // Player attempts used
let maxAttempts = 7; // Number of attempts for game to end
let maxGuess = 100;
let minGuess = 0;
let gamesWon = 0;
let gamesLost = 0;

// HTML Element Selectors
let guessBtn = document.querySelector("#guessBtn");
let resetBtn = document.querySelector("#resetBtn");
let guesses = document.querySelector("#guesses");
let playerGuess = document.querySelector("#playerGuess");
let feedback = document.querySelector("#feedback");
let winCounter = document.querySelector("#winCounter");
let lossCounter = document.querySelector("#lossCounter");

document.querySelector("#descriptor").textContent = `Guess a number between ${minGuess} and ${maxGuess} in ${maxAttempts} attempts!`;
initializeGame();

function initializeGame() {
    rNum = Math.ceil(Math.random() * (maxGuess - minGuess) + minGuess);
    attempts = 0;
    console.log(`Random Number ${rNum}`);

    resetBtn.style.display = "none"; // Hide reset button
    guessBtn.style.display = "inline"; // Show guess button
    playerGuess.focus(); // Emphasize text box
    playerGuess.value = "";
    feedback.textContent = "";
    guesses.textContent = "";
}

function checkGuess() {
    let guess = playerGuess.value;
    console.log(`Player guess: ${guess}`);
    feedback.textContent = "";
    if (guess < minGuess || guess > maxGuess) {
        alert("Guess is out of range");
        feedback.textContent = `Enter a value between ${minGuess} and ${maxGuess}!`;
        return;
    }
    attempts++;
    console.log(`Attempt ${attempts}`);
    feedback.style.color = "orange";
    if(guess == rNum){
        feedback.textContent = "You won!";
        feedback.style.color = "green";
        gameOver(true);
    } else {
        guesses.textContent += `${guess}  `;
        if (attempts === maxAttempts) {
            feedback.textContent = "You Lost!";
            feedback.style.color = "red";
            gameOver(false);
        } else if (guess > rNum) {
            feedback.textContent = "Your guess is too high!";
        } else {
            feedback.textContent = "Your guess is too low!";
        }
    }
}

function gameOver(hasWon) {
    guessBtn.style.display = "none";
    resetBtn.style.display = "inline";
    if (hasWon) {
        gamesWon++;
        winCounter.textContent = `Games Won: ${gamesWon}`;
    } else {
        gamesLost++;
        lossCounter.textContent = `Games Lost: ${gamesLost}`;
    }
}
