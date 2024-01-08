// Vec: A class representing a 2D vector with x and y coordinates. It provides methods for performing vector arithmetic
// such as addition and scaling.
export class VecClass {
	constructor(x, y) {
		// x is speed
		this.x = x
		this.y = y
	}
	plus(other) {
		return new Vec(this.x + other.x, this.y + other.y)
	}
	times(factor) {
		return new Vec(this.x * factor, this.y * factor)
	}
}

export const Vec = VecClass
