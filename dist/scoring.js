// SCORES / LOCAL STORAGE UPDATE

import {getGameRunningState } from "./labgen.js";

let gameState = getGameRunningState();

// Check if the scoreStore object already exists in localStorage
let scoreStore = JSON.parse(localStorage.getItem('scoreStore'));

if (gameState){
  resetScore();
  initStore();
}


function resetScore(){
  scoreStore = {
      scores: {
        wallsDestroyed: 0,
        StepsTakenScore: 0,
        portalsFound: 0
      }
}
localStorage.setItem('scoreStore', JSON.stringify(scoreStore));
}

if (!scoreStore) {
  // If it doesn't exist, create it with initial values
  scoreStore = {
    scores: {
      wallsDestroyed: 0,
      StepsTakenScore: 0,
      portalsFound: 0
    }
  };
}


// Function to update the scores
function updateScore(key, value) {
  if (scoreStore.scores.hasOwnProperty(key)) {
    scoreStore.scores[key] = value;
    localStorage.setItem('scoreStore', JSON.stringify(scoreStore));
    console.log(scoreStore);
  } else {
    console.error(`Key "${key}" not found in the scoreStore.`);
  }
}

// Initial scores setup
function initStore() {
  // Check if the scoreStore object already exists in localStorage
  let existingScoreStore = JSON.parse(localStorage.getItem('scoreStore'));

  if (!existingScoreStore) {
    // If it doesn't exist, create it with initial values
    scoreStore = {
      scores: {
        wallsDestroyed: 0,
        StepsTakenScore: 0,
        portalsFound: 0
      }
    };
  } else {
    scoreStore = existingScoreStore;
  }
}


function retrieveStores(){
// You can retrieve the JSON object from localStorage as needed
const storedScore = JSON.parse(localStorage.getItem('scoreStore'));
return storedScore;
}

// Display the stored scores in the console
console.log(scoreStore);

export {updateScore, retrieveStores}