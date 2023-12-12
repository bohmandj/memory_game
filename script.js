const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const card = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");

    // give it a class attribute for the value we are looping over
    card.classList.add(color);
    card.classList.add('card');
    front.classList.add('front');
    front.style.backgroundColor = `${color}`;
    front.innerText = color;
    back.classList.add('back');
    back.innerText = `Match
    Pairs`;

    // call a function handleCardClick when a div is clicked on
    card.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    card.appendChild(front);
    card.appendChild(back);
    gameContainer.append(card);
  }
}

// TODO: Implement this function!
// Card functionality declarations:
let firstColor = '';
let firstCard = '';
let secondCard = '';
let selectedCard = '';
let clickedCount = 0;
let matchedPairs = 0;
let guessCounter = 0;

// Local storage values
let storedRecord = 99;
let storedSpeed = "99:99";

// Timer-specific declarations
let seconds = 0
let timer;
let minuteCount = 0;
let secondCount = 0;
let formattedSeconds = secondCount.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
let formattedMinutes = minuteCount.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
let playTime = formattedMinutes + ":" + formattedSeconds;

// Selectors:
const playerScoreCounter = document.querySelector('.playerScore');
const recordScore = document.querySelector('.recordScore');
const timerDisplay = document.querySelector('.timer');
const startButton = document.querySelector('.start');

function retrieveStorage() {
  if (localStorage.getItem("storedRecord")) storedRecord = localStorage.getItem('storedRecord');
  if (localStorage.getItem("storedSpeed")) storedSpeed = localStorage.getItem("storedSpeed");
}
// Retrieve local storage values
retrieveStorage();

function startTimer() {
  timer = setInterval(addSecond, 1000);
  playerScoreCounter.innerText = "Current Guess Count: " + guessCounter;
  recordScore.innerText = "Record Score: " + storedRecord;
  document.querySelector('#pregame').classList.add('hidden');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart'
}

function addSecond() {
  seconds++;
  calculatePlayTime(seconds);
}

function calculatePlayTime() {
  minuteCount = Math.floor(seconds / 60);
  secondCount = seconds - (minuteCount * 60);
  formattedSeconds = secondCount.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  formattedMinutes = minuteCount.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  playTime = formattedMinutes + ":" + formattedSeconds;
  timerDisplay.innerHTML = playTime
  return playTime
}

startButton.addEventListener("click", clickStart);
function clickStart() {
  startButton.classList.contains('restart') ? resetBoard() : startTimer();
}

function resetBoard() {
  const removeCard = document.getElementsByClassName('card');
  while (removeCard[0]) {
    removeCard[0].parentNode.removeChild(removeCard[0]);
  }
  shuffle(COLORS);
  clearInterval(timer)
  seconds = 0;
  minuteCount = 0;
  secondCount = 0;
  firstColor = '';
  firstCard = '';
  secondCard = '';
  selectedCard = '';
  clickedCount = 0;
  matchedPairs = 0;
  guessCounter = 0;
  retrieveStorage();
  playerScoreCounter.innerText = "Player's Guess Count: " + guessCounter;
  recordScore.innerText = "Record Score: " + storedRecord;
  calculatePlayTime();
  timerDisplay.innerHTML = formattedMinutes + ":" + formattedSeconds;
  createDivsForColors(COLORS);
  startTimer();
}

function clickFirstCard() {
  firstCard = selectedCard;
  firstCard.classList.toggle('clicked');
  clickedCount++;
  firstColor = selectedCard.className;
  return;
}

function itsAMatch() {
  clickedCount = 0;
  matchedPairs++;
  firstColor = '';
  firstCard = '';
  if (matchedPairs === (COLORS.length) / 2) {
    win();
  }
  return;
}
function win() {
  clearInterval(timer)
  let winTime = timerDisplay.innerHTML;
  // Won score and speed
  if (guessCounter < storedRecord) {
    alert("Congratulations, you WIN! \n It took you " + winTime + " and " + guessCounter + " guesses to match all pairs. \n That's a new record!");
    recordScore.innerText = "Record Score: " + guessCounter;
    localStorage.setItem('storedRecord', guessCounter);
    localStorage.setItem('storedSpeed', winTime);
    return
  }
  else if (guessCounter = storedRecord) {
    if (parseInt(winTime.replace(':', '')) < parseInt(storedSpeed.replace(':', ''))) {
      // Tied score, won faster
      alert("Congratulations, you WIN! \nYou tied the record score of " + guessCounter + " guesses to match all pairs, but won the speed tie-breaker by winning in " + winTime + "! It took the old record holder " + storedSpeed + " to match all pairs.");
      recordScore.innerText = "Record Score: " + guessCounter;
      localStorage.setItem('storedRecord', guessCounter);
      localStorage.setItem('storedSpeed', winTime);
      return
    }
    // Tied score, won slower
    else {
      alert("Congratulations, you WIN! \nIt took you " + winTime + " and " + guessCounter + " guesses to match all pairs. \nYou tied the record score! Try again to set a new score record, or beat the current record of " + guessCounter + " guesses in less than the record's " + storedSpeed + " completion time!");
      return
    }
  }
  // Completed with more guesses + slower
  else { alert('Congratulations! \nYou Win! \nIt took you ' + winTime + " and " + guessCounter + ' guesses to match all pairs.\nTry again to beat our current record score of only ' + storedRecord + ' guesses.'); }
}

function resetClickedCards() {
  firstCard.classList.toggle('clicked');
  secondCard.classList.toggle('clicked');
  clickedCount = 0;
  firstColor = '';
  firstCard = '';
  secondCard = '';
}

function handleCardClick(event) {
  selectedCard = event.target.parentElement;
  // you can use event.target to see which element was clicked
  // console.log("you just clicked", selectedCard);

  // clicking on card border was flipping the whole game, below code avoids that
  if (selectedCard.id) return;

  // 0. if third or more cards clicked before first two reset or match, OR if card is already flipped: do nothing with those clicks
  if (clickedCount === 2 || selectedCard.className.includes('clicked')) return;

  // 1. flip first clicked card over
  if (clickedCount === 0) {
    clickFirstCard(selectedCard);
    return;
  }

  // 2. when second card clicked, see if clicked cards match
  if (clickedCount === 1) {
    secondCard = selectedCard;
    secondCard.classList.toggle('clicked');
    clickedCount++;
    guessCounter++;
    playerScoreCounter.innerText = "Player's Guess Count: " + guessCounter
    if (secondCard.className === firstColor) {
      itsAMatch();
      return;
    }

    // 2.b. if diff, background colors back to normal after 1 sec
    setTimeout(resetClickedCards, 1000);
    return;
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);
