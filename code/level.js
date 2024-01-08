import { levelChars } from "./levelsChar.js"
import { Vec } from "./vec.js"

export class LevelClass {
	constructor(plan) {
		let rows = plan
			.trim()
			.split("\n")
			.map((l) => [...l])
		this.height = rows.length
		this.width = rows[0].length
		this.startActors = []

		this.rows = rows.map((row, y) => {
			return row.map((ch, x) => {
				let type = levelChars[ch]
				if (typeof type == "string") return type
				this.startActors.push(type.create(new Vec(x, y), ch))
				return "empty"
			})
		})
	}
}

export const Level = LevelClass

// touches: A method of Level for checking if an actor of a given type touches a specific position and size in the level.
Level.prototype.touches = function (pos, size, type) {
	let xStart = Math.floor(pos.x)
	let xEnd = Math.ceil(pos.x + size.x)
	let yStart = Math.floor(pos.y)
	let yEnd = Math.ceil(pos.y + size.y)

	for (let y = yStart; y < yEnd; y++) {
		for (let x = xStart; x < xEnd; x++) {
			let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height
			let here = isOutside ? "ground-top-left" : this.rows[y][x]
			if (here == type) return true
		}
	}
	return false
}
