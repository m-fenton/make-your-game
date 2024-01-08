import { gameVariables, jumpSpeed } from "./gameVariables.js"
import { Vec } from "./vec.js"
import { playUpSound } from "./sounds.js"
import { setLivesToXResetScore } from "./state.js"


export class PlayerClass {
	constructor(pos, speed) {
		this.pos = pos
		this.speed = speed
		if (gameVariables.isBig) {
			this.size = new Vec(0.8, 1.7)
		} else {
			this.size = new Vec(0.8, 1)
		}
	}

	get type() {
		return "player"
	}

	static create(pos) {
		if (!gameVariables.isBig) {
			return new Player(pos.plus(new Vec(0, -0)), new Vec(0, 0))
			// if player isBig then spawns the player slightly higher at the start of a level, to stop his feet clipping into the ground
		} else if (gameVariables.isBig) {
			return new Player(pos.plus(new Vec(0, -0.7)), new Vec(0, 0))
		}
	}
}

export const Player = PlayerClass

let playerXSpeed = 7
let gravity = 30

Player.prototype.update = function (time, state, keys) {
	if (gameVariables.isPaused) {
		return new Player(this.pos, new Vec(0, 0))
	} else {

		let xSpeed = 0
		if (keys.ArrowLeft && !keys.Shift && state.status != "won") {
			; (gameVariables.isLeft = true),
				(xSpeed -= playerXSpeed),
				(this.direction = "Left")
		}
		if (keys.ArrowRight && !keys.Shift && state.status != "won") {
			; (gameVariables.isLeft = false),
				(xSpeed += playerXSpeed),
				(this.direction = "Right")
		}
		if (keys.ArrowLeft && keys.Shift && state.status != "won") {
			; (gameVariables.isLeft = true),
				(xSpeed -= playerXSpeed + 4),
				(this.direction = "Left")
		}
		if (keys.ArrowRight && keys.Shift && state.status != "won") {
			; (gameVariables.isLeft = false),
				(xSpeed += playerXSpeed + 4),
				(this.direction = "Right")
		}

		let pos = this.pos
		let movedX = pos.plus(new Vec(xSpeed * time, 0))

		if (state.status == "lost" || state.status == "restart") {
			xSpeed = 0
			gameVariables.isMoving = false
		} else if (
			!state.level.touches(movedX, this.size, "ground-bottom-left") &&
			!state.level.touches(movedX, this.size, "ground-bottom-right") &&
			!state.level.touches(movedX, this.size, "ground-bottom-body") &&
			!state.level.touches(movedX, this.size, "ground-top-right") &&
			!state.level.touches(movedX, this.size, "ground-top-body") &&
			!state.level.touches(movedX, this.size, "ground-top-left") &&
			!state.level.touches(movedX, this.size, "ground-full") &&
			!state.level.touches(movedX, this.size, "pipe-top-left") &&
			!state.level.touches(movedX, this.size, "pipe-top-right") &&
			!state.level.touches(movedX, this.size, "pipe-body-left") &&
			!state.level.touches(movedX, this.size, "pipe-body-right") &
			!state.level.touches(movedX, this.size, "block") &&
			!state.level.touches(movedX, this.size, "box-extra-life")
		) {
			pos = movedX
		}
		let ySpeed = this.speed.y + time * gravity
		let movedY = pos.plus(new Vec(0, ySpeed * time))


		let sizeAdjustment = 1

		if (gameVariables.isBig) {
			sizeAdjustment = 2
		}
		// if player hits bottom of map then they die

		if (movedY.y > state.level.height - sizeAdjustment) {
			state.status = "lost"
			gameVariables.isBig = false
			ySpeed = -jumpSpeed
			setLivesToXResetScore(gameVariables.lives - 1)
			if (gameVariables.lives <= 0) {
				state.status = "restart"
			}
			return new Player(pos, new Vec(xSpeed, ySpeed))
		}

		// cheats
		if (keys["s"]) {
			gameVariables.isBig = true
		}
		if (keys["i"]) {
			gameVariables.isInvincible = true
		}
		if (keys["f"]) {
			gameVariables.isBig = false
			gameVariables.isInvincible = false
		}
		// Cheat to skip to next level with "n", for testing purposes
		if (keys["n"]) {
			state.status = "won"
			gameVariables.coinScore = 0;
			gameVariables.score = 0;
			displayCoins.textContent = "Coins: " + gameVariables.coinScore;
			displayScore.textContent = "Score: " + gameVariables.score;
		}
		//

		if (gameVariables.jumpOverride && (keys.ArrowUp || keys[" "]) && ySpeed > 0) {
			ySpeed = -jumpSpeed
			playUpSound()
			gameVariables.jumpOverride = false
			gameVariables.isJumping = true
		} else if (
			state.level.touches(movedY, this.size, "sprint-block") &&
			keys.Shift &&
			xSpeed != 0
		) {
			ySpeed = 0
			gameVariables.isJumping = false
		} else if (
			!state.level.touches(movedY, this.size, "ground-top-body") &&
			!state.level.touches(movedY, this.size, "ground-top-right") &&
			!state.level.touches(movedY, this.size, "ground-top-left") &&
			!state.level.touches(movedY, this.size, "ground-bottom-body") &&
			!state.level.touches(movedY, this.size, "ground-bottom-right") &&
			!state.level.touches(movedY, this.size, "ground-bottom-left") &&
			!state.level.touches(movedY, this.size, "ground-full") &&
			!state.level.touches(movedY, this.size, "pipe-top-left") &&
			!state.level.touches(movedY, this.size, "pipe-top-right") &&
			!state.level.touches(movedY, this.size, "pipe-body-left") &&
			!state.level.touches(movedY, this.size, "pipe-body-right") &&
			!state.level.touches(movedY, this.size, "block") &&
			!state.level.touches(movedY, this.size, "box-extra-life")
		) {
			pos = movedY
			gameVariables.jumpOverride = false
		} else if ((keys.ArrowUp || keys[" "]) && ySpeed > 0) {
			ySpeed = -jumpSpeed
			playUpSound()
			gameVariables.isJumping = true
		} else if (state.status != "lost" && state.status != "restart") {
			ySpeed = 0
			gameVariables.isJumping = false
		} else {
			pos = movedY
		}

		if (
			state.level.touches(movedY, this.size, "flag2") ||
			state.level.touches(movedY, this.size, "flag4") ||
			state.level.touches(movedY, this.size, "pole2")
		) {
			state.status = "won"
			gameVariables.coinScore = 0;
			gameVariables.score = 0;
			displayCoins.textContent = "Coins: " + gameVariables.coinScore;
			displayScore.textContent = "Score: " + gameVariables.score;
		}
		if (xSpeed != 0) {
			gameVariables.isMoving = true
		} else {
			gameVariables.isMoving = false
		}
		return new Player(pos, new Vec(xSpeed, ySpeed))
	}
}
