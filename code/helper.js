import { gameVariables, scale } from "./gameVariables.js"

// elt: A helper function for creating DOM elements with attributes and children
export function elt(name, attrs, ...children) {
	let dom = document.createElement(name)
	for (let attr of Object.keys(attrs)) {
		dom.setAttribute(attr, attrs[attr])
	}
	for (let child of children) {
		dom.appendChild(child)
	}
	return dom
}

function applyPlayerAnimations(actorClass, stateStatus, actor) {
    if (gameVariables.isBig && stateStatus !== "lost") {
        actorClass += " big";
    }

    if (gameVariables.posAdjustment) {
        actor.pos.y += 0.7;
        gameVariables.posAdjustment = false;
    }
	 if (gameVariables.isBig) {
        if (!gameVariables.posAdjustment) {
            actor.pos.y -= 0.7;
            gameVariables.posAdjustment = true;
        }
    }

    if (gameVariables.isLeft) {
        actorClass += " left";
    }

    if (gameVariables.isJumping) {
        actorClass += " jump";
    } else if (gameVariables.isMoving) {
        // Simplify the logic for applying step classes
        const stepClasses = ["step1", "step3", "step2"];
        const stepIndex = Math.floor(gameVariables.isMovingCounter / 10) % 3;
        actorClass += " " + stepClasses[stepIndex];
        gameVariables.isMovingCounter++;
    }

    return actorClass;
}

let isInvincible = false;

function applyInvincibilityAnimation(actorClass) {
    if (isInvincible) {
        actorClass += " invincible";
    }
    
    return actorClass;
}

function toggleInvincibility() {
    isInvincible = !isInvincible;
    setTimeout(toggleInvincibility, 100);
}

// Start the toggle loop
toggleInvincibility();



function createActorElement(actor, scale, stateStatus) {
    let actorClass = `actor ${actor.type}`;

    if (actor.type === "player") {
        actorClass = applyPlayerAnimations(actorClass, stateStatus, actor);

        if (gameVariables.isInvincible) {
            actorClass = applyInvincibilityAnimation(actorClass);
        }
    }

    const rect = elt("div", { class: actorClass });
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;

    return rect;
}

export function drawActors(state) {
    const actors = state.actors;
    return elt(
        "div",
        {},
        ...actors.map(actor => createActorElement(actor, scale, state.status))
    );
}

// overlap: A helper function for checking if two actors overlap each other.
export function overlap(actor1, actor2) {
	return (
		actor1.pos.x + actor1.size.x > actor2.pos.x &&
		actor1.pos.x < actor2.pos.x + actor2.size.x &&
		actor1.pos.y + actor1.size.y > actor2.pos.y &&
		actor1.pos.y < actor2.pos.y + actor2.size.y
	)
}

// trackKeys: A function for tracking keyboard key events and returning an object representing the current state of tracked keys
function trackKeys(keys) {
	let down = Object.create(null)
	function track(event) {
		if (keys.includes(event.key)) {
			down[event.key] = event.type == "keydown"
			event.preventDefault()
		}
	}
	window.addEventListener("keydown", track)
	window.addEventListener("keyup", track)
	return down
}

export const keyPresses = trackKeys([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"Escape",
	"Shift",
	" ",
	"s",
	"f",
	"i",
	"n",
	"p",
])
