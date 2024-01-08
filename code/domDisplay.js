import { elt, drawActors, keyPresses } from "./helper.js"
import { Vec } from "./vec.js"
import { scale } from "./gameVariables.js"

function drawGrid(level) {
	return elt(
		"table",
		{
			class: "background",
			style: `width: ${3200}px`,
		},
		...level.rows.map((row) =>
			elt(
				"tr",
				{ style: `height: ${16}px` },
				...row.map((type) => elt("td", { class: type }))
			)
		)
	)
}

// DOMDisplay: A class representing the game's graphical display using HTML DOM elements.
// It initializes the game container and provides methods for updating and synchronizing the display with the game state.
export class DOMDisplayClass {
	constructor(parent, level) {
		this.dom = elt("div", { class: "game" }, drawGrid(level))
		this.actorLayer = null
		parent.appendChild(this.dom)
	}

	clear() {
		this.dom.remove()
	}
}

export const DOMDisplay = DOMDisplayClass


// syncState: A method of DOMDisplay for synchronizing the display with the game state
// It clears the previous actor layer, creates a new actor layer, and updates the class and scroll position of the game container.

DOMDisplay.prototype.syncState = function (state) {
	if (this.actorLayer) this.actorLayer.remove()
	this.actorLayer = drawActors(state, keyPresses)
	this.dom.appendChild(this.actorLayer)
	this.dom.className = `game ${state.status}`
	this.scrollPlayerIntoView(state)
}

// scrollPlayerIntoView: A method of DOMDisplay for scrolling the game container to keep the player in view.

DOMDisplay.prototype.scrollPlayerIntoView = function (state) {
	let width = 600
	let margin = width / 2

	// The viewport
	let left = this.dom.scrollLeft,
		right = left + width
		
	let player = state.player
	let playerWidth = 12.8 // Width of the player in pixels
	let center = player.pos
		.plus(new Vec(playerWidth / 2, player.size.y / 2))
		.times(scale)
	if (center.x < left + margin) {
		this.dom.scrollLeft = center.x - margin
	} else if (center.x > right - margin) {
		this.dom.scrollLeft = center.x + margin - width
	}

}
