import { overlap } from "./helper.js"
import { gameVariables, togglePause } from "./gameVariables.js"

// State: A class representing the current state of the game. It stores the current level, the actors present in the level,
// and the game status ("playing", "won", or "lost"). It provides methods for creating a new game state and retrieving the player actor.
export class StateClass {
	constructor(level, actors, status) {
		this.level = level
		this.actors = actors
		this.status = status
		this.player = actors.find((a) => a.type == "player")
		this.enemy = actors.find((a) => a.type == "enemy")
	}

	static start(level) {
		return new State(level, level.startActors, "playing")
	}
}

export const State = StateClass

// update: A method of State for updating the game state based on the elapsed time and user input.
// It updates the positions of the actors, handles collisions, and determines the new game status

State.prototype.update = function (time, keys) {
	if (keys.Escape) {
		togglePause();
	}
	let actors = this.actors.map((actor) => actor.update(time, this, keys))

	let newState = new State(this.level, actors, this.status)

	if (newState.status !== "playing") return newState

	let player = newState.player

	for (let actor of actors) {
		if (actor !== player && overlap(actor, player)) {
			newState = actor.collide(newState, keys)
		}
	}
	return newState
}

export function setLivesToXResetScore(num) {
	gameVariables.lives = num
	gameVariables.score = 0
	gameVariables.coinScore = 0
	displayLives.textContent = "Lives: " + gameVariables.lives
	displayCoins.textContent = "Coins: " + gameVariables.coinScore
	displayScore.textContent = "Score: " + gameVariables.score
}
