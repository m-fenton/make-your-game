import { Vec } from "./vec.js"
import { overlap } from "./helper.js"
import { gameVariables } from "./gameVariables.js"
import { playBlockKnock } from "./sounds.js"
import { State } from "./state.js"
import { playCoinGrab, playMushroomNoise, playstarPower } from "./sounds.js"
import { storyCoin } from "./story.js"


export class Box {
	constructor(pos, size, key) {
		this.pos = pos
		this.size = size
		this.key = key
	}

	static create(pos) {
		return new this(pos)
	}

	get type() {
		return this.key
	}

	collide(state) {
		return collideAll(this, state, this.key)
	}

	update() {
		// update: A method of Enemy and Coin for updating the position and behavior of the actor over time.
		return new this.constructor(this.pos, this.size, this.key)
	}
}

export const BoxEmpty = class BoxEmpty extends Box {
	constructor(pos) {
		super(pos, new Vec(1, 1), "BoxEmpty")
	}
	get type() {
		return "BoxEmpty"
	}
}

export const BoxCoin = class BoxCoin extends Box {
	constructor(pos) {
		super(pos, new Vec(1, 1), "BoxCoin")
	}

	get type() {
		return "BoxCoin"
	}
}

export const BoxExtraLife = class BoxExtraLife extends Box {
	constructor(pos) {
		super(pos, new Vec(1, 1), "BoxExtraLife")
	}

	get type() {
		return "BoxExtraLife"
	}
}

export const BoxMushroom = class BoxMushroom extends Box {
	constructor(pos) {
		super(pos, new Vec(1, 1), "BoxMushroom")
	}
	get type() {
		return "BoxMushroom"
	}
}

export const BoxStar = class BoxStar extends Box {
	constructor(pos) {
		super(pos, new Vec(1, 1), "BoxStar")
	}

	get type() {
		return "BoxStar"
	}
}

export const BreakableBlock = class BreakableBlock extends Box {
	constructor(pos) {
		super(pos, new Vec(1, 1), "BreakableBlock")
	}

	get type() {
		return "BreakableBlock"
	}
}

export function makeInvincibleForXSeconds(seconds) {
	gameVariables.isInvincible = true

	// Set the timeout to revert gameVariables.isInvincible to false after 5 seconds
	setTimeout(() => {
		gameVariables.isInvincible = false
	}, (seconds * 1000)) // e.g. 5000 milliseconds = 5 seconds
}

function removeBlockFromListOfActors(box, state) {
	// ifBig then removes block from list of actors
	if (gameVariables.isBig) {
		let actors = state.actors
			.map((actor) => {
				if (actor === box) return null
				return actor // Keep other actors unchanged
			})
			.filter(Boolean) // Remove null values from the array
		return new State(state.level, actors, state.status)
	}
	return state
}

function replaceWithBoxEmpty(box, state) {
	// Create a new "block" object with the BoxCoin's position
	let emptyBox = new BoxEmpty(box.pos)
	// Replace the BoxCoin with the "block" object in the actors array
	let actors = state.actors.map((actor) => {
		return actor === box ? emptyBox : actor
	})
	// Return the updated state with the modified actors array
	return new State(state.level, actors, state.status)
}

function bottomCollison(box, state, boxType) {
	if (boxType !== "BoxEmpty") {
		gameVariables.score += 100
		displayScore.textContent = "Score: " + gameVariables.score
	}
	if (boxType === "BoxEmpty") {
		playBlockKnock()
	} else if (boxType === "BoxCoin") {
		gameVariables.coinScore++
		displayCoins.textContent = "Coins: " + gameVariables.coinScore
		if (
			gameVariables.coinScore == 25
		) {
			gameVariables.lives++
			displayLives.textContent = "Lives: " + gameVariables.lives
		}
		playCoinGrab()
		if (gameVariables.isStory && gameVariables.coinScore == 10 && gameVariables.storyCoinShown == false) {
			storyCoin.style.display = "flex";
			gameVariables.isPaused = true
			gameVariables.storyCoinShown = true
			const storyCoinClick = storyCoin.addEventListener("click", () => {
				storyCoin.style.display = "none"; // Hide the story screen
				gameVariables.isPaused = false
				storyCoin.removeEventListener("click", storyCoinClick); // Remove the event listener to prevent repeated clicks
			});
		}
		return replaceWithBoxEmpty(box, state)
	} else if (boxType === "BoxExtraLife") {
		gameVariables.lives++
		displayLives.textContent = "Lives: " + gameVariables.lives
		return replaceWithBoxEmpty(box, state)
	} else if (boxType === "BoxMushroom") {
		// if Mario is increasing in size then adjusts his position to make the grow appear more natural, otherwise position is unaffected
		if (!gameVariables.isBig) {
			state.player.pos.y += 0.7
		}
		gameVariables.isBig = true
		playMushroomNoise()
		return replaceWithBoxEmpty(box, state)
	} else if (boxType === "BoxStar") {
		makeInvincibleForXSeconds(6)
		playstarPower()
		return replaceWithBoxEmpty(box, state)
	} else if (boxType === "BreakableBlock") {
		playBlockKnock()
		// ifBig then removes block from list of actors
		return removeBlockFromListOfActors(box, state)
	}
	return state
}

export function collideAll(box, state, boxType) {
	// Check if the player collides with the block
	let player = state.player
	if (overlap(player, box)) {
		// Check the relative positions of the player and the block
		let playerBottom = player.pos.y + player.size.y
		let playerTop = player.pos.y
		let blockTop = box.pos.y
		let blockLeft = box.pos.x
		let playerLeft = player.pos.x
		let playerRight = player.pos.x + player.size.x
		let blockRight = box.pos.x + box.size.x

		// Check which side the player is colliding with
		if (Math.abs(playerBottom - blockTop) < 0.5) {
			// Player is colliding from the top
			player.pos.y = box.pos.y - player.size.y
			player.speed.y = 0
			gameVariables.jumpOverride = true
			gameVariables.isJumping = false
		} else if (Math.abs(playerTop - blockTop - 0.5) < 1 && player.speed.y < 0) {
			// Player is colliding from the bottom
			player.pos.y = box.pos.y + box.size.y
			player.speed.y = 1
			return bottomCollison(box, state, boxType)
		} else if (Math.abs(playerRight - blockLeft) < 1) {
			// Player is colliding from the left and moving right
			player.pos.x = box.pos.x - player.size.x
			player.speed.x = 0
		} else if (Math.abs(playerLeft - blockRight) < 1) {
			// Player is colliding from the right and moving left
			player.pos.x = box.pos.x + box.size.x
			player.speed.x = 0
		}
	}
	return state
}
