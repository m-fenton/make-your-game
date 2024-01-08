import { Level } from "./level.js"
import { State, setLivesToXResetScore } from "./state.js"
import { gameUI, gameVariables, remainingTimeDisplay, totalScoreScreen, finalTotalScore } from "./gameVariables.js"
import { keyPresses } from "./helper.js"
import { playThemeMusic } from "./sounds.js"
import { DOMDisplay } from "./domDisplay.js"
import { storyButton, storyStart, storyMid, storyConclusion } from "./story.js"



let counter = 0


// runAnimation: A utility function for running an animation loop using requestAnimationFrame.
function runAnimation(frameFunc) {
	let lastTime = null
	function frame(time) {
		if (lastTime != null) {
			let timeStep = Math.min(time - lastTime, 100) / 1000
			if (frameFunc(timeStep) === false) return
		}
		lastTime = time
		requestAnimationFrame(frame)
	}
	requestAnimationFrame(frame)
}

// runLevel: A function for running a single game level. It creates a display, initializes the game state,
// and runs the animation loop until the game is won or lost.

function runLevel(level, Display) {
	let display = new Display(document.body, level)
	let state = State.start(level)
	let ending = 1
	let remainingTime = 200 // Total time for the level (30 seconds)
	playThemeMusic()

	const restartGameClicker = restartTheGame.addEventListener("click", () => {
		pauseScreen.style.display = "none" // Hide the pause screen
		restartTheGame.removeEventListener("click", restartGameClicker);
		restartGame(state)
		
	})

	return new Promise((resolve) => {
		runAnimation((time) => {
			state = state.update(time, keyPresses)
			display.syncState(state)

			if (state.status == "playing") {
				// Update the remaining time and check if the time is up
				if (!gameVariables.isPaused) {
					remainingTime -= time
				}

				if (remainingTime <= 0) {
					setLivesToXResetScore(gameVariables.lives - 1)
					gameVariables.isBig = false
					gameVariables.posAdjustment = false
					if (gameVariables.lives <= 0) {
						state.status = "restart"
					} else {
						state = State.start(level)
					}
					// Restart the level if time is up
					remainingTime = 200 // Reset the remaining time
				}
				remainingTimeDisplay.textContent = "Time: " + Math.floor(remainingTime)
				return true
			} else if (ending > 0) {
				ending -= time
				if (counter === 0) {
					gameVariables.timeScore = Math.floor(remainingTime) * 10
					counter++
				}
				return true
			} else {
				display.clear()
				resolve(state.status)
				return false
			}
		})
	})
}

const restartTheGame = document.getElementById("restartGameButton")
const beginScreen = document.getElementById("begin-screen")
// Add a new function to hide the beginning screen
function hideBeginScreen() {
	beginScreen.style.display = "none"
}

// Attach an event listener to the "Start Game" button
const startButton = document.getElementById("start-button")
const startButtonClicker = startButton.addEventListener("click", () => {
	hideBeginScreen()
	storyStart.removeEventListener("click", startButtonClicker);
	// Call the runGame function to start the game
	runGame(GAME_LEVELS, DOMDisplay)
})



storyButton.addEventListener("click", () => {
	hideBeginScreen();
	gameVariables.isStory = true;
	storyStart.style.display = "flex"; // Show the story screen

	const innerClickListener = () => {
		storyStart.style.display = "none"; // Hide the story screen
		runGame(GAME_LEVELS, DOMDisplay); // Start the game
		storyStart.removeEventListener("click", innerClickListener); // Remove the event listener
	};

	storyStart.addEventListener("click", innerClickListener);
});



// runGame: A function for running the entire game. It takes an array of level plans and a display constructor
// and runs each level sequentially, advancing to the next level when the current level is won.
export async function runGame(plans, Display) {

	for (let level = 0; level < plans.length;) {

		displayLives.textContent = "Lives: " + gameVariables.lives
		displayCoins.textContent = "Coins: " + gameVariables.coinScore
		displayScore.textContent = "Score: " + gameVariables.score
		displayLevel.textContent = "Level: " + (level + 1)
		let status = await runLevel(new Level(plans[level]), Display)

		if (status == "won") {
			level++,
				(gameVariables.totalScore +=
					gameVariables.score + gameVariables.timeScore),
				(gameVariables.score = 0),
				(gameVariables.coinScore = 0)
		}
		// if story mode is active then it will show a story element before the final level
		if (gameVariables.isStory && level == 1) {
			gameVariables.storyCoinShown = false,
			storyMid.style.display = "flex";
			gameVariables.isPaused = true
			const storyMidClick = storyMid.addEventListener("click", () => {
				storyMid.style.display = "none"; // Hide the story screen
				gameVariables.isPaused = false
				storyMid.removeEventListener("click", storyMidClick); // Remove the event listener to prevent repeated clicks
			});
		}
		counter = 0
		if (status == "restart") {
			setLivesToXResetScore(3)
			level = 0
			gameVariables.totalScore = 0
		}
	}

		// if story mode is active then it will show a story element after the final level
	if (gameVariables.isStory) {
		storyConclusion.style.display = "flex";

		const storyConclusionClickHandler = () => {
			storyConclusion.style.display = "none"; // Hide the story screen
			storyConclusion.removeEventListener("click", storyConclusionClickHandler); // Remove the event listener
			finalTotalScore.textContent = gameVariables.totalScore;
			totalScoreScreen.style.display = "block";
			totalScoreScreen.style.marginTop = "100px";
		};

		storyConclusion.addEventListener("click", storyConclusionClickHandler);
	} else {
		finalTotalScore.textContent = gameVariables.totalScore;
		totalScoreScreen.style.display = "block";
		totalScoreScreen.style.marginTop = "100px";
	}

	gameUI.style.display = "none";

}

function restartGame(state) {
	// set lives to 1, since Mario will fall play the die animation, hit the floor of the level and lose a life
	// it'll then update the lives to show 0; setting lives to 1 made the lives display as -1 briefly
	gameVariables.lives = 1
	state.status = "restart"
	gameVariables.isPaused = false;
}

window.restartGame = restartGame
