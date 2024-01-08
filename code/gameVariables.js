export const gameVariables = {
	isStory: false,
	isPaused: false,
	pauseToggleable: true,
	isLeft: false,
	isMoving: false,
	isMovingCounter: 0,
	isJumping: false,
	isBig: false,
	isInvincible: false,
	invicibleCounter: 0,
	jumpOverride: false,
	lives: 3,
	score: 0,
	totalScore: 0,
	coinScore: 0,
	storyCoinShown: true,
	timeScore: 0,
	posAdjustment: false,
}

export const scale = 16
export let jumpSpeed = 17

export const gameUI = document.getElementById("gameUI");
const pauseScreen = document.getElementById("pauseScreen")
export const remainingTimeDisplay = document.getElementById("remainingTimeDisplay")
export const totalScoreScreen = document.getElementById("totalScoreScreen")
export const finalTotalScore = document.getElementById("finalTotalScore")

function pauseThrottle() {
	gameVariables.pauseToggleable = false

	// After time, set the pauseToggleable back to true
	setTimeout(() => {
		gameVariables.pauseToggleable = true
	}, 500) // e.g.2000 milliseconds = 2 seconds
}

export function togglePause() {
	

	if (!gameVariables.isPaused) {
		if (gameVariables.pauseToggleable) {
			pauseButton.textContent = "Continue"
			gameVariables.isPaused = !gameVariables.isPaused
			pauseScreen.style.display = "block" // Display the pause screen
			pauseThrottle()
			pauseScreen.style.display = "block"
		}
	} else {
		if (gameVariables.pauseToggleable) {
			pauseScreen.style.display = "none" // Hide the pause screen
			pauseButton.textContent = "Pause"
			gameVariables.isPaused = !gameVariables.isPaused
			pauseThrottle()
		}
	}
}

const pauseButton = document.getElementById("pauseButton")
pauseButton.addEventListener("click", togglePause)

window.togglePause = togglePause
