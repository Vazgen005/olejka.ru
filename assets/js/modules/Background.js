import Logger from "./Logger.js";
import { getTheme } from "./Theme.js";

const logger = new Logger("Background");

let SNOW_MODE = false;
let FIRE_TRAIL = true;
let FIRE = true;
let SPEED = 1;

const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8,
		STAR_SIZE = 3,
		SNOW_SIZE = 5,
		STAR_MIN_SCALE = 0.2,
		OVERFLOW_THRESHOLD = 50,
		EMBER_COUNT = 140;

const stars = [];
const embers = [];

const pointer = {x: 0, y: 0, startX: 0, startY: 0}

const velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };
let gyroscopeInput = false;

let canvas, context, width, height, scale = 1;
let time = 0;

function generate() {
	for(let i = 0; i < STAR_COUNT; i++) {
		stars.push({
			x: 0,
			y: 0,
			z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
			twinkle: Math.random() * Math.PI * 2
		});
	 }
}

function placeStar(star) {
	star.x = Math.random() * width;
	star.y = Math.random() * height;
}

function recycleStar(star) {
	let direction = "z";

	let vx = Math.abs(velocity.x),
		vy = Math.abs(velocity.y);

	if(vx > 1 || vy > 1) {
		let axis;

		if(vx > vy) {
			axis = Math.random() < vx / (vx + vy) ? "h" : "v";
		} else {
			axis = Math.random() < vy / (vx + vy) ? "v" : "h";
		}
		
		if(axis === "h") {
			direction = velocity.x > 0 ? "l" : "r";
		} else {
			direction = velocity.y > 0 ? "t" : "b";
		}
	}
	
	star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);
	star.twinkle = Math.random() * Math.PI * 2;

	switch(direction) {
		case "z":
			star.z = 0.1;
			star.x = Math.random() * width;
			star.y = Math.random() * height;
			break;
		case "l":
			star.x = -OVERFLOW_THRESHOLD;
			star.y = height * Math.random();
			break;
		case "r":
			star.x = width + OVERFLOW_THRESHOLD;
			star.y = height * Math.random();
			break;
		case "t":
			star.x = width * Math.random();
			star.y = -OVERFLOW_THRESHOLD;
			break;
		case "b":
			star.x = width * Math.random();
			star.y = height + OVERFLOW_THRESHOLD;
			break;
	}
}

function spawnEmber() {
	embers.push({
		x: Math.random() * width,
		y: height + Math.random() * 40,
		vx: (Math.random() - 0.5) * 0.8,
		vy: -(0.5 + Math.random() * 2.5),
		size: 2 + Math.random() * 8,
		life: Math.random(),
		hue: 15 + Math.random() * 45
	});
}

function updateEmbers() {
	if (!FIRE) {
		embers.length = 0;
		return;
	}
	while (embers.length < EMBER_COUNT) spawnEmber();

	for (let i = embers.length - 1; i >= 0; i--) {
		const e = embers[i];
		e.x += e.vx * SPEED;
		e.y += e.vy * SPEED;
		e.vx += (Math.random() - 0.5) * 0.15;
		e.life -= 0.004;
		if (e.life <= 0 || e.y < -20) {
			embers.splice(i, 1);
		}
	}
}

function renderEmbers() {
	context.save();
	context.globalCompositeOperation = "lighter";
	embers.forEach((e) => {
		const a = Math.max(0, e.life) * 0.6;
		const g = context.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size);
		g.addColorStop(0, `hsla(${e.hue}, 100%, 70%, ${a})`);
		g.addColorStop(0.4, `hsla(${e.hue}, 100%, 50%, ${a * 0.6})`);
		g.addColorStop(1, `hsla(${e.hue}, 100%, 40%, 0)`);
		context.fillStyle = g;
		context.beginPath();
		context.arc(e.x, e.y, e.size, 0, Math.PI * 2);
		context.fill();
	});
	context.restore();
}

function resize() {
	scale = window.devicePixelRatio || 1;

	width = window.innerWidth * scale;
	height = window.innerHeight * scale;

	canvas.width = width;
	canvas.height = height;

	stars.forEach(placeStar);
}

function trailFill() {
	if (FIRE_TRAIL) return "rgba(5, 0, 0, 0.16)";
	return getTheme() === "light" ? "rgba(254, 254, 254, 0.15)" : "rgba(10, 10, 10, 0.15)";
}

function step() {
	if (FIRE_TRAIL) {
		context.globalCompositeOperation = "source-over";
		context.fillStyle = trailFill();
		context.fillRect(0, 0, width, height);
	} else {
		context.clearRect(0, 0, width, height);
	}

	update();
	render();
	renderEmbers();
	requestAnimationFrame(step);
}

function update() {
	time += 0.02;

	velocity.tx *= SNOW_MODE ? 0.90 : 0.96;
	velocity.ty *= SNOW_MODE ? 1 : 0.96;

	velocity.x += (velocity.tx - velocity.x) * 0.8;
	velocity.y += SNOW_MODE ? -velocity.y + 2.5 : (velocity.ty - velocity.y) * 0.8;

	stars.forEach((star) => {
		star.x += velocity.x * star.z * SPEED;
		star.y += velocity.y * star.z * SPEED;
		
		// Parallax 
		if (SNOW_MODE) {
			!star.snowParallax && (star.snowParallax = {mul: 1, val: Math.random() * 2 - 1});
			star.snowParallax.val += Math.random() * .05 * star.snowParallax.mul;
			Math.abs(star.snowParallax.val) > 1 && (star.snowParallax.mul *= -1); 
			star.x += star.snowParallax.val * .5 * star.z;
		} else {
			star.x += (star.x - width/2) * velocity.z * star.z;
			star.y += (star.y - height/2) * velocity.z * star.z;
			star.z += velocity.z;
		}

		
		if(star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD) {
			recycleStar(star);
		}
	});

	updateEmbers();
}

function render() {
	context.save();
	if (FIRE_TRAIL) context.globalCompositeOperation = "lighter";

	stars.forEach((star) => {
		context.lineCap = "round";
		context.lineWidth = (SNOW_MODE ? SNOW_SIZE : STAR_SIZE) * star.z * scale;

		let tailX = SNOW_MODE ? 0 : velocity.x * 2,
			tailY = SNOW_MODE ? 0 : velocity.y * 2;
		
		if(Math.abs(tailX) < 0.1) tailX = 0.5;
		if(Math.abs(tailY) < 0.1) tailY = 0.5;

		const a = 0.5 + 0.5 * Math.sin(time + star.twinkle);

		if (FIRE_TRAIL) {
			const grad = context.createLinearGradient(star.x, star.y, star.x + tailX, star.y + tailY);
			grad.addColorStop(0, `rgba(255, 255, 210, ${a})`);
			grad.addColorStop(0.5, `rgba(255, 140, 0, ${a * 0.85})`);
			grad.addColorStop(1, "rgba(255, 20, 0, 0)");
			context.strokeStyle = grad;
		} else {
			const theme = getTheme();
			const color = theme === "light" ? "0, 0, 0," : "255, 255, 255,";
			context.strokeStyle = "rgba(" + color + a + ")";
		}

		context.beginPath();
		context.moveTo(star.x, star.y);
		context.lineTo(star.x + tailX, star.y + tailY);
		context.stroke();
	});

	context.restore();
}

function movePointer(x, y) {
	x -= pointer.startX;
	y -= pointer.startY;

	if(typeof pointer.x === "number" && typeof pointer.y === "number") {
		let ox = x - pointer.x,
			oy = y - pointer.y;
		velocity.tx = velocity.tx + (ox / 8*scale) * (gyroscopeInput ? 1 : -1);
		velocity.ty = velocity.ty + (oy / 8*scale) * (gyroscopeInput ? 1 : -1);
	}

	pointer.x = x;
	pointer.y = y;
}


function onMouseMove(event) {
	if (gyroscopeInput) return;
	movePointer(event.clientX, event.clientY);
}

function onMouseEnter(event) {
	if (gyroscopeInput) return;
	pointer.startX = event.clientX;
	pointer.startY = event.clientY;
}

function onMouseLeave() {
	if (gyroscopeInput) return;
	pointer.x = null;
	pointer.y = null;
}

let lastGyro;
function onDeviceOrientation(event) {
	lastGyro = Date.now();
	gyroscopeInput = true;

	movePointer(event.gamma * 2, event.beta * 2);
	
	setTimeout(() => {
		if (Date.now() - lastGyro > 500) gyroscopeInput = false;
	}, 1000);
}

function setFireTrail(on) { FIRE_TRAIL = !!on; }
function setFire(on) { FIRE = !!on; }
function setSpeed(mult) { SPEED = mult; }


function runCanvas(_canvas, _SNOW_MODE) {
	SNOW_MODE = _SNOW_MODE;
	canvas = _canvas;
	context = canvas.getContext("2d");

	generate();
	resize();
	step();
	
	window.onresize = resize;
	window.onmousemove = onMouseMove;
	window.ondeviceorientation = onDeviceOrientation;
	document.onmouseenter = onMouseEnter;
	document.onmouseleave = onMouseLeave;
	
	logger.log("Started canvas!");
}

export {runCanvas, setFireTrail, setFire, setSpeed};
