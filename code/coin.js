import { Vec } from "./vec.js"
import { State } from "./state.js"
import { gameVariables } from "./gameVariables.js"
import { playCoinGrab } from "./sounds.js"
import { storyCoin } from "./story.js"

export class CoinClass {
	constructor(pos, basePos, wobble) {
		this.pos = pos
		this.basePos = basePos
		this.wobble = wobble
		this.size = new Vec(1, 1)
	}

	get type() {
		return "coin"
	}

	static create(pos) {
		let basePos = pos.plus(new Vec(0.2, -0.5))
		return new Coin(basePos, basePos, Math.random() * Math.PI * 2)
	}
}

export const Coin = CoinClass


Coin.prototype.collide = function (state) {
	let filtered = state.actors.filter((a) => a != this)
	let status = state.status
	gameVariables.coinScore++
	displayCoins.textContent = "Coins: " + gameVariables.coinScore;
	gameVariables.score += 100
	displayScore.textContent = "Score: " + gameVariables.score;

	if (gameVariables.coinScore == 25) {
		gameVariables.lives++
		displayLives.textContent = "Lives: " + gameVariables.lives;
	}
	playCoinGrab()
	
	if (gameVariables.isStory && gameVariables.coinScore == 10 && gameVariables.storyCoinShown == false) {
		storyCoin.style.display = "flex";
		gameVariables.isPaused = true
		gameVariables.storyCoinShown = true
	const storyCoinClick =	storyCoin.addEventListener("click", () => {
			storyCoin.style.display = "none"; // Hide the story screen
			gameVariables.isPaused = false
			storyCoin.removeEventListener("click", storyCoinClick); // Remove the event listener to prevent repeated clicks
		});
	}
	return new State(state.level, filtered, status)
}

const wobbleSpeed = 8,
	wobbleDist = 0.07

Coin.prototype.update = function (time) {
	let wobble = this.wobble + time * wobbleSpeed
	let wobblePos = Math.sin(wobble) * wobbleDist
	return new Coin(
		this.basePos.plus(new Vec(0, wobblePos)),
		this.basePos,
		wobble
	)
}

