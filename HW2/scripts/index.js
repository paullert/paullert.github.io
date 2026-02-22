// Global Vars
let activeDeck = [];
const startingMoney = 1000;

let UI = {};
let input = {};

let player = new Player([], startingMoney);
let dealer = new Player([], -1);

const minBet = 30;
const maxBet = 100;
let currentBet = 0;
let recentBets = [];

let gameState = "idle";

initDOM();
updateUI();
// hideAll();


// Initializes dom variables, needed to run test files easier
function initDOM(){
    // DOM Variables
    UI = {
        start: document.getElementById("start"),
        bet: document.getElementById("bet"),
        currentBet: document.getElementById("currentBet"),
        currentGamePhase: document.getElementById("currentGamePhase"),
        recentBets: document.getElementById("recentBets"),
        moneyCounter: document.getElementById("moneyCounter"),
        dealer: document.getElementById("dealer"),
        player: document.getElementById("player"),
        playerHand: document.getElementById("playerHand"),
        dealerHand: document.getElementById("dealerHand"),
    }
    input = {
        betBtn: document.getElementById("betBtn"),
        betNum: document.getElementById("betInput"),
        start: document.getElementById("startBtn"),
        hit: document.getElementById("hitBtn"),
        stand: document.getElementById("standBtn"),
        doubleDown: document.getElementById("doubleBtn"),
        surrender: document.getElementById("surrenderBtn"),
    }

    // Event Listeners
    input.start.addEventListener("click", startGame);
    input.betBtn.addEventListener("click", makeBet);
    input.hit.addEventListener("click", hit);
    input.stand.addEventListener("click", hold);
    input.doubleDown.addEventListener("click", doubleDown);
    input.surrender.addEventListener("click", surrender);
}

// Card Object
//      holds card information and contains a method to change card value
function Card(cardValue, cardSuit, cardRank, isShown) {
    this.value = cardValue;
    this.suit = cardSuit;
    this.rank = cardRank;
    this.isRevealed = isShown;

    this.show = function () {
        this.isRevealed = true;
    };
    // this.toString = function () {
    //     // if (!this.isRevealed) {
    //     //     return "[  ???  ]";
    //     // }
    //     return `[${this.rank}${this.suit}]`;
    // };

    this.tweak = function (newValue) {
        this.value = newValue;
    };
}

// Player Object
//      holds player information
function Player(playerHand, startingMoney) {
    this.hand = playerHand;
    this.total = 0;
    this.money = startingMoney;
}

// Fills a chosen deck with cards, not shuffled
function buildDeck(deck) {
    const suits = ["spades", "clubs", "hearts", "diamonds"];
    // const suits = ["♤", "♡", "♢", "♧"];
    const ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

    for (const suit of suits) {
        for (let rank of ranks) {
            if (rank === "jack" || rank === "queen" || rank === "king") {
                deck.push(new Card(10, suit, rank, false));
            } else if (rank === "ace") {
                deck.push(new Card(11, suit, rank, false));
            } else {
                deck.push(new Card(parseInt(rank), suit, rank, false));
            }
        }
    }
    return deck;
}

function cardFileRef(card){
    return `images/SVG-cards-1.3/${card.rank}_of_${card.suit}.svg`;
}

function renderHand(hand, container) {
    container.innerHTML = "";
    for (const card of hand) {
        const cardImage = document.createElement("img");
        card.isRevealed ? cardImage.src = cardFileRef(card) : cardImage.src = "images/blank.jpg";
        cardImage.className = "card";
        container.appendChild(cardImage);
    }
}

function updateUI() {
    UI.moneyCounter.textContent = player.money;
    UI.recentBets.innerHTML = "";
    UI.currentGamePhase.textContent = gameState;
    for (const bet of recentBets) {
        UI.recentBets.appendChild(bet);
    }

    if (gameState === "idle") {
        input.start.disabled = false;
        input.start.classList.remove("button--disabled");
        input.hit.disabled = true;
        input.hit.classList.add("button--disabled");
        input.stand.disabled = true;
        input.stand.classList.add("button--disabled");
        input.betBtn.disabled = true;
        input.betBtn.classList.add("button--disabled");
        input.surrender.disabled = true;
        input.surrender.classList.add("button--disabled");
        input.doubleDown.disabled = true;
        input.doubleDown.classList.add("button--disabled");
    } else if(gameState === "betting") {
        input.start.disabled = true;
        input.start.classList.add("button--disabled");
        input.betBtn.disabled = false;
        input.betBtn.classList.remove("button--disabled");

        // input.betBtn.className = "button";
    } else if(gameState === "playing") {
        input.hit.disabled = false;
        input.hit.classList.remove("button--disabled");
        input.stand.disabled = false;
        input.stand.classList.remove("button--disabled");
        input.betBtn.disabled = true;
        input.betBtn.classList.add("button--disabled");
        input.surrender.disabled = false;
        input.surrender.classList.remove("button--disabled");
        input.doubleDown.disabled = false;
        input.doubleDown.classList.remove("button--disabled");
    } else if(gameState === "finished") {
        input.start.disabled = true;
        input.start.classList.add("button--disabled");
        input.hit.disabled = true;
        input.hit.classList.add("button--disabled");
        input.stand.disabled = true;
        input.stand.classList.add("button--disabled");
        input.betBtn.disabled = true;
        input.betBtn.classList.add("button--disabled");
        input.surrender.disabled = true;
        input.surrender.classList.add("button--disabled");
        input.doubleDown.disabled = true;
        input.doubleDown.classList.add("button--disabled");
    }
}

// Resets the game to the starting state
//      Clears hands and rebuilds draw deck
function startGame() {
    gameState = "betting";
    activeDeck.length = 0;
    buildDeck(activeDeck);
    shuffleDeck(activeDeck);
    dealer.hand.length = 0;
    dealer.total = 0;
    player.hand.length = 0;
    player.total = 0;
    UI.moneyCounter.textContent = player.money;
    currentBet = 0;
    renderHand(player.hand, UI.player);
    renderHand(dealer.hand, UI.dealer);
    updateUI();
}

/*
Handles game ending
    gameResult: 1 = Win
    gameResult: 0 = Tie
    gameResult:-1 = Lose
 */
function gameOver(gameResult) {
    gameState = "idle";
    if (gameResult === 0) {
        alert("Tie!");
        updateUI();
        return;
    }

    let result = document.createElement("p");
    if (recentBets.length >= 10) {
        recentBets.shift();
        recentBets.push(result);
    }

    if (gameResult === 1) {
        player.money += currentBet;
        result.className = "positiveBet";
        result.textContent = `+${currentBet}`;
        alert("Won!");
    } else {
        player.money -= currentBet;
        result.className = "negativeBet";
        result.textContent = `\t-${currentBet}`;
        alert("Lost!");
    }
    UI.currentBet.textContent = "";
    currentBet = 0;
    recentBets.push(result);

    if (player.money <= minBet) {
        alert(`You are out of money! Game Over.`);
        gameState = "finished";
    }
    updateUI();
}

// Adds cards to a player hand, handles ace logic
//      player = Player object to add card to
//      isRevealed: true = show card
//      isSorted: true = sort hand after adding card
// TODO: Delete Debug Messages in deal function
function deal(playerIn, isRevealed, isSorted, drawDeck) {
    if (drawDeck === undefined) {
        drawDeck = activeDeck;
    }
    if (drawDeck.length === 0) {
        console.log("Deck is empty!");
        return -1;
    }

    let hand = playerIn.hand;
    let handValue = playerIn.total;
    let card = drawDeck.pop();

    if (isRevealed) {
        card.show();
    }
    // console.log(`Deck Before Addition: ${hand}`);
    hand.push(card);
    // console.log(`Deck After Addition: ${hand}`);

    // console.log(`Adding ${card.value} to value: ${handValue}`);
    handValue += card.value;
    // console.log(`Total Hand Value After: ${handValue}`);

    while(handValue > 21){
        let temp = hand.find(card => card.value === 11)
        if(temp === undefined){
            break;
        }
        temp.tweak(1);
        handValue -= 10;
    }
    if (isSorted) sortDeck(hand);
    playerIn.total = handValue;
}

// Takes a bet from input and allows the game to actually begin
function makeBet() {
    let betAmount = parseInt(input.betNum.value);
    if (betAmount < minBet || betAmount > maxBet) {
        alert(`Bet must be between ${minBet} and ${maxBet}`);
        return;
    }
    gameState = "playing";
    currentBet = betAmount;
    UI.currentBet.textContent = currentBet;
    deal(player, true, false);
    deal(dealer, true, false);
    deal(player, true, true);
    deal(dealer, false, false);
    renderHand(player.hand, UI.player);
    renderHand(dealer.hand, UI.dealer);
    updateUI();
}

// Adds card to player hand and checks for bust
function hit() {
    let playerHand = player.hand;
    deal(player,true, true);
    renderHand(playerHand, UI.player);
    // UI.playerHand.textContent = playerDeck.toString();
    if (player.total > 21) {
        dealer.hand[1].show();
        renderHand(dealer.hand, UI.dealer);
        gameOver(-1);
    }
    updateUI();
}

// If the dealer's hand is below the player's, the dealer hits until they are at or above
function hold() {
    gameState = "idle";
    let dTotal = dealer.total;
    let pTotal = player.total;
    let dHand = dealer.hand;
    console.table(dHand);
    dHand[1].show();
    console.table(dHand);

    while (dTotal < 17) { // Continue until the dealer is above 16/busts
        let err = deal(dealer, true, true);
        if (err === -1){
            console.log("ERR: Deck is empty");
            break;
        }
        dTotal = dealer.total;
        if (dTotal > 21) {
            renderHand(dHand, UI.dealer);
            gameOver(1);
            return;
        }
    }
    renderHand(dHand, UI.dealer);
    // If dealer didnt bust ...
    if (dTotal > pTotal) {
        gameOver(-1);
    } else if (dTotal === pTotal) {
        //TODO: Mull over how ties should go
        gameOver(0);
    } else {
        gameOver(1);
    }
}

function doubleDown(){
    deal(player, true, true);
    currentBet *= 2;
    if (player.total > 21) {
        dealer.hand[1].show();
        renderHand(dealer.hand, UI.dealer);
        renderHand(player.hand, UI.player);
        gameOver(-1);
    } else {
        renderHand(dealer.hand, UI.dealer);
        renderHand(player.hand, UI.player);
        hold();
    }
    updateUI();
}

function surrender(){
    currentBet /= 2;
    gameOver(-1);
}

// Shuffles deck, self-explanatory
//      (optional) randomSeed: random float between 0 and 1
function shuffleDeck(deck, randomSeed) {
    if (randomSeed === undefined) randomSeed = Math.random();
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(randomSeed * (i + 1));
        [ deck[i], deck[j] ] = [ deck[j], deck[i] ];
    }

}

// Sorts deck based on number values of cards
function sortDeck(deck) {
    deck.sort((a, b) => a.value - b.value);
}

