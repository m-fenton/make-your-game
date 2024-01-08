let isMuted = false
function toggleMute() {
	isMuted = !isMuted
	if (!isMuted) {
		muteButton.textContent = "Sound Off"
	} else {
		muteButton.textContent = "Sound On"
	}
	// Get all audio elements in the game
	const audioElements = document.querySelectorAll("audio")

	if (isMuted) {
		muteButton.textContent = "Sound On"
		//audioElements.pause();
	} else {
		muteButton.textContent = "Sound Off"
		//audioElements.play();
	}

	// Loop through each audio element and set its "muted" property based on the isMuted flag
	audioElements.forEach((audio) => {
		audio.muted = isMuted
	})
}

window.toggleMute = toggleMute

// Add an event listener for the button click
const muteButton = document.getElementById("muteButton")
muteButton.addEventListener("click", toggleMute)

// Update the button text based on the isMuted flag
//muteButton.textContent = isMuted ? "Sound On" : "Mute";


// Add an event listener for the 'keydown' event on the document
document.addEventListener("keydown", (event) => {
	// Check if the pressed key is 'm' or 'M'
	if (event.key === "m" || event.key === "M") {
		// Call the toggleMute() function when 'm' or 'M' is pressed
		toggleMute()
	}
})

// Function to play the "themeMusic" sound
export function playThemeMusic() {
	themeMusic.currentTime = 0
	themeMusic.volume = 0.5
	themeMusic.loop = true
	themeMusic.play()
}

// Function to play the "thwomp" sound
export function playBlockKnock() {
	blockKnock.currentTime = 0
	blockKnock.play()
}

// Function to play the "up" sound
export function playUpSound() {
	upSound.currentTime = 0
	upSound.volume = 0.5
	upSound.play()
}

// Function to play the "coin" sound
export function playCoinGrab() {
	coinGrab.currentTime = 0
	coinGrab.volume = 0.5
	coinGrab.play()
}

// Function to play the "stomp" sound
export function playStompEnemy() {
	stompEnemy.currentTime = 0 // Rewind the sound to the beginning, so it can play on consecutive keypresses
	stompEnemy.play()
}

// Function to play the "coin" sound
export function playMushroomNoise() {
	mushroomNoise.currentTime = 0
	mushroomNoise.volume = 0.3
	mushroomNoise.play()
}

// Function to play the "star" sound
export function playstarPower() {
    // Pause themeMusic if it's playing
    if (!themeMusic.paused) {
        themeMusic.pause();
    }

    starPower.currentTime = 0;
    starPower.volume = 0.3;
    starPower.play();

    // Stop starPower after 6 seconds
    setTimeout(() => {
        starPower.pause();
        // Reset themeMusic to the beginning and resume playing
        themeMusic.currentTime = 0;
        themeMusic.play();
    }, 6000); // 6000 milliseconds = 6 seconds
}
