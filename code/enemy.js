import { gameVariables, jumpSpeed } from "./gameVariables.js"
import { State } from "./state.js"
import { Player } from "./player.js"
import { Vec } from "./vec.js"
import { makeInvincibleForXSeconds } from "./box.js"
import { setLivesToXResetScore } from "./state.js"
import { playStompEnemy } from "./sounds.js"

export class EnemyClass {
	constructor(pos, speed, reset) {
		this.pos = pos
		this.speed = speed
		this.reset = reset
		this.size = new Vec(1, 1)
	}

	get type() {
		return "enemy"
	}

	static create(pos) {
		return new Enemy(pos, new Vec(2, 0))
	}
}

export const Enemy = EnemyClass

// collide: A method of Enemy and Coin for handling collision with other actors and returning a new game state.
Enemy.prototype.collide = function (state, keys) {
	let player = state.player
	if (keys["s"]) {
		player.size.y = 1.8
		player.pos.y -= 0.8
		this.pos.y -= 0.8
	}

	// Check if the player is above the enemy
	if (player.pos.y + player.size.y < this.pos.y + 0.5) {
		gameVariables.score += 100
		displayScore.textContent = "Score: " + gameVariables.score

		// 'jumps' off the enemy
		playStompEnemy()
		let playerSpeed = new Vec(player.speed.x, -jumpSpeed)
		let playerState = new Player(player.pos, playerSpeed)

		// Create a new array of actors with the modified player and remove the current enemy
		let actors = state.actors
			.map((actor) => {
				if (actor === this) return null // Remove the current enemy
				if (actor === player) return playerState // Modify the player (jumps)
				return actor // Keep other actors unchanged
			})
			.filter(Boolean) // Remove null values from the array

		// Return the updated game state with the modified actors array
		return new State(state.level, actors, state.status)
	} else if (gameVariables.isInvincible) {
		// Removes the enemy that collides with the player, if it collides with him whilst gameVariables.isInvincible
		return new State(
			state.level,
			state.actors.filter((actor) => actor !== this),
			state.status
		)
	} else if (!gameVariables.isBig) {
		let playerSpeed = new Vec(player.speed.x, -jumpSpeed)
		let playerState = new Player(player.pos, playerSpeed)

		// Create a new array of actors with the modified player and remove the current enemy
		let actors = state.actors
			.map((actor) => {
				if (actor === player) return playerState // Modify the player (jumps)
				return actor // Keep other actors unchanged
			})
			.filter(Boolean) // Remove null values from the array

		// Player is hit by enemy and loses the game
		setLivesToXResetScore(gameVariables.lives - 1)

		if (gameVariables.lives <= 0) {
			return new State(state.level, actors, "restart")
		} else {
			return new State(state.level, actors, "lost")
		}
	} else if (gameVariables.isBig) {
		gameVariables.isBig = false
		makeInvincibleForXSeconds(0.05)
		return new State(state.level, state.actors, state.status)
	}
}

Enemy.prototype.update = function (time, state) {
	if (gameVariables.isPaused) {
		return new Enemy(this.pos, this.speed, this.reset)
	} 
		let newPos = this.pos.plus(this.speed.times(time))
	
		// avoid walking through pipes and ground
		if (
			!state.level.touches(newPos, this.size, "pipe-top-left") &&
			!state.level.touches(newPos, this.size, "pipe-top-right") &&
			!state.level.touches(newPos, this.size, "pipe-body-left") &&
			!state.level.touches(newPos, this.size, "pipe-body-right") &&
			!state.level.touches(newPos, this.size, "enemy-block-block")
		) {
			return new Enemy(newPos, this.speed, this.reset)
		} else {
			return new Enemy(this.pos, this.speed.times(-1))
		}
	}
// }

