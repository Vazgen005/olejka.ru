import Logger from "./Logger.js";
import { setFireTrail, setFire, setSpeed } from "./Background.js";
import { textBrute } from "./Animations.js";

const logger = new Logger("Chaos");

const EMOTES = ["🤡","🎪","🎈","🤹","🍌","🦄","🌈","💥","🔥","🎺","🥳","🃏","🎠","🍿","🎡"];
const CONFETTI = ["#ff004d","#ffdd00","#00ff7f","#00c8ff","#c800ff","#ff6600"];

const body = document.body;
const main = document.querySelector("main");
const h1 = document.querySelector("main h1");

let on = true;
let speedAcc = 1;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const addClass = (cls) => body.classList.add(cls);
const removeClass = (cls) => body.classList.remove(cls);

function every(fn, ms) {
	const id = setInterval(fn, ms);
	return id;
}

function rand(n) { return Math.floor(Math.random() * n); }
function pick(arr) { return arr[rand(arr.length)]; }

function spawnFalling(char, cls) {
	const el = document.createElement("span");
	el.className = cls;
	el.textContent = char;
	el.style.left = Math.random() * 100 + "vw";
	el.style.animationDuration = (2 + Math.random() * 4) + "s";
	el.style.fontSize = (14 + Math.random() * 30) + "px";
	layer().appendChild(el);
	setTimeout(() => el.remove(), 6500);
}

function layer() {
	let l = document.getElementById("party-layer");
	if (!l) {
		l = document.createElement("div");
		l.id = "party-layer";
		body.appendChild(l);
	}
	return l;
}

// ---------------------------------------------------------------------------
// 3D spin loop
// ---------------------------------------------------------------------------

let spinRX = 0, spinRY = 0, spinRXt = 0, spinRYt = 0;
let spinOn = false;

function spinLoop() {
	if (!spinOn) return;
	spinRX += (spinRXt - spinRX) * 0.08;
	spinRY += (spinRYt - spinRY) * 0.08;
	body.style.transform = `rotateX(${spinRX}deg) rotateY(${spinRY}deg)`;
	requestAnimationFrame(spinLoop);
}

function spinMove(e) {
	const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
	spinRYt = ((e.clientX - cx) / cx) * 25;
	spinRXt = ((cy - e.clientY) / cy) * 25;
}

// ---------------------------------------------------------------------------
// Effects (30)
// ---------------------------------------------------------------------------

const effects = [
	{
		id: "3d-spin", name: "3D вращение страницы",
		on: () => { addClass("fx-3d"); window.addEventListener("mousemove", spinMove); spinOn = true; spinLoop(); },
		off: () => { removeClass("fx-3d"); spinOn = false; window.removeEventListener("mousemove", spinMove); body.style.transform = ""; }
	},
	{
		id: "fire-trail", name: "Огненный след звёзд",
		on: () => { setFireTrail(true); addClass("fx-fire"); },
		off: () => { setFireTrail(false); removeClass("fx-fire"); }
	},
	{
		id: "fire", name: "Огонь",
		on: () => { setFire(true); addClass("fx-fire"); },
		off: () => { setFire(false); removeClass("fx-fire"); }
	},
	{
		id: "invert", name: "Перевёрнутый сайт",
		on: () => addClass("fx-invert"),
		off: () => removeClass("fx-invert")
	},
	{
		id: "shake", name: "Тряска экрана",
		on: () => addClass("fx-shake"),
		off: () => removeClass("fx-shake")
	},
	{
		id: "rainbow", name: "Радуга",
		on: () => addClass("fx-rainbow"),
		off: () => removeClass("fx-rainbow")
	},
	{
		id: "meteor", name: "Метеоритный дождь",
		on: () => { speedAcc *= 2; setSpeed(speedAcc); },
		off: () => { speedAcc /= 2; setSpeed(speedAcc); }
	},
	{
		id: "bouncy-links", name: "Прыгающие ссылки",
		on: () => addClass("fx-bouncy"),
		off: () => removeClass("fx-bouncy")
	},
	{
		id: "spin-title", name: "Вращающийся заголовок",
		on: () => addClass("fx-spin-title"),
		off: () => removeClass("fx-spin-title")
	},
	{
		id: "emoji-cursor", name: "Смайлик вместо курсора",
		on: () => {
			const c = document.createElement("div");
			c.id = "emoji-cursor";
			body.appendChild(c);
			c._m = (e) => {
				c.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
				if (!c._t) { c.textContent = pick(EMOTES); c._t = setInterval(() => c.textContent = pick(EMOTES), 250); }
			};
			window.addEventListener("mousemove", c._m);
		},
		off: () => { const c = document.getElementById("emoji-cursor"); if (c) { clearInterval(c._t); window.removeEventListener("mousemove", c._m); c.remove(); } }
	},
	{
		id: "target-cursor", name: "Курсор-мишень",
		on: () => addClass("fx-target"),
		off: () => removeClass("fx-target")
	},
	{
		id: "gravity", name: "Гравитация вниз",
		on: () => addClass("fx-gravity"),
		off: () => removeClass("fx-gravity")
	},
	{
		id: "zoom-pulse", name: "Пульс-зум",
		on: () => addClass("fx-zoom"),
		off: () => removeClass("fx-zoom")
	},
	{
		id: "neon", name: "Неоновое свечение",
		on: () => addClass("fx-neon"),
		off: () => removeClass("fx-neon")
	},
	{
		id: "matrix", name: "Матрица",
		on: () => {
			const c = document.createElement("canvas");
			c.id = "matrix";
			body.appendChild(c);
			const ctx = c.getContext("2d");
			c.width = window.innerWidth; c.height = window.innerHeight;
			const cols = Math.floor(c.width / 18);
			const drops = new Array(cols).fill(1);
			const glyphs = "アカサタナハマヤラワ01";
			c._loop = setInterval(() => {
				ctx.fillStyle = "rgba(0,0,0,0.05)";
				ctx.fillRect(0, 0, c.width, c.height);
				ctx.fillStyle = "#0f0"; ctx.font = "18px monospace";
				for (let i = 0; i < cols; i++) {
					ctx.fillText(glyphs[rand(glyphs.length)], i * 18, drops[i] * 18);
					if (drops[i] * 18 > c.height && Math.random() > 0.975) drops[i] = 0;
					drops[i]++;
				}
			}, 60);
		},
		off: () => { const c = document.getElementById("matrix"); if (c) { clearInterval(c._loop); c.remove(); } }
	},
	{
		id: "cursor-paint", name: "След краски за курсором",
		on: () => {
			const fn = (e) => {
				const d = document.createElement("i");
				d.className = "paint-dot";
				d.style.left = e.clientX + "px";
				d.style.top = e.clientY + "px";
				d.style.background = pick(CONFETTI);
				body.appendChild(d);
				setTimeout(() => d.remove(), 1200);
			};
			window.addEventListener("mousemove", fn);
			effects.find(x => x.id === "cursor-paint")._fn = fn;
		},
		off: () => { window.removeEventListener("mousemove", effects.find(x => x.id === "cursor-paint")._fn); }
	},
	{
		id: "retype-title", name: "Печатающийся заголовок",
		on: () => { if (h1) textBrute(h1, "Oleg Logvinov", 2000); },
		off: () => {}
	},
	{
		id: "emoji-rain", name: "Дождь из эмодзи",
		on: () => {
			const t = every(() => spawnFalling(pick(EMOTES), "faller"), 300);
			effects.find(x => x.id === "emoji-rain")._t = t;
			layer();
		},
		off: () => clearInterval(effects.find(x => x.id === "emoji-rain")._t)
	},
	{
		id: "wave", name: "Волна",
		on: () => addClass("fx-wave"),
		off: () => removeClass("fx-wave")
	},
	{
		id: "strobe", name: "Стробоскоп",
		on: () => addClass("fx-strobe"),
		off: () => removeClass("fx-strobe")
	},
	{
		id: "letters-fly", name: "Разлетающиеся буквы",
		on: () => {
			if (!h1) return;
			const text = h1.textContent;
			h1.innerHTML = "";
			[...text].forEach((ch, i) => {
				const s = document.createElement("span");
				s.textContent = ch;
				s.style.setProperty("--i", i);
				h1.appendChild(s);
			});
			addClass("fx-letters");
		},
		off: () => { removeClass("fx-letters"); if (h1) h1.textContent = "Oleg Logvinov"; }
	},
	{
		id: "confetti", name: "Конфетти",
		on: () => {
			const t = every(() => spawnFalling(pick(["🎉","🎊","✨","💫","🎈"]), "faller-confetti"), 200);
			effects.find(x => x.id === "confetti")._t = t;
			layer();
		},
		off: () => clearInterval(effects.find(x => x.id === "confetti")._t)
	},
	{
		id: "hyperspeed", name: "Гипер-скорость",
		on: () => { speedAcc *= 3; setSpeed(speedAcc); },
		off: () => { speedAcc /= 3; setSpeed(speedAcc); }
	},
	{
		id: "blackhole", name: "Чёрная дыра",
		on: () => addClass("fx-blackhole"),
		off: () => removeClass("fx-blackhole")
	},
	{
		id: "hearts", name: "Ссылки-сердечки",
		on: () => addClass("fx-hearts"),
		off: () => removeClass("fx-hearts")
	},
	{
		id: "drunk-cursor", name: "Пьяный курсор",
		on: () => addClass("fx-drunk"),
		off: () => removeClass("fx-drunk")
	},
	{
		id: "mirror-text", name: "Зеркальный текст",
		on: () => addClass("fx-mirror"),
		off: () => removeClass("fx-mirror")
	},
	{
		id: "flash-bg", name: "Вспышки фона",
		on: () => {
			const t = every(() => body.style.background = pick(CONFETTI), 700);
			effects.find(x => x.id === "flash-bg")._t = t;
		},
		off: () => { clearInterval(effects.find(x => x.id === "flash-bg")._t); body.style.background = ""; }
	},
	{
		id: "dino-bounce", name: "Режим динозавра",
		on: () => addClass("fx-bounce"),
		off: () => removeClass("fx-bounce")
	},
	{
		id: "slow-mo", name: "Замедленная съёмка",
		on: () => { speedAcc *= 0.5; setSpeed(speedAcc); },
		off: () => { speedAcc *= 2; setSpeed(speedAcc); }
	}
];

// ---------------------------------------------------------------------------
// Easter eggs (30)
// ---------------------------------------------------------------------------

let clickCounts = {};

function onKeySequence(seq, fn) {
	let buf = "";
	return (e) => {
		buf = (buf + e.key).slice(-seq.length);
		if (buf.toLowerCase() === seq.toLowerCase()) { buf = ""; fn(); }
	};
}

function onHash(hash, fn) {
	return () => { if (location.hash === hash) fn(); };
}

// ---------------------------------------------------------------------------
// Click / tap tracking (Pointer Events — works for mouse AND touch)
// ---------------------------------------------------------------------------

const TAPS = [];
const CORNER_ORDER = ["TL", "TR", "BR", "BL"];
let totalTaps = 0;
let lastTap = null;
let sameSpot = 0;
let cornerSeq = 0;
let holdTimer = null;

function tapsWithin(ms) {
	const now = Date.now();
	return TAPS.filter((t) => now - t < ms).length;
}

function cornerAt(x, y) {
	const m = 60;
	if (x < m && y < m) return "TL";
	if (x > innerWidth - m && y < m) return "TR";
	if (x > innerWidth - m && y > innerHeight - m) return "BR";
	if (x < m && y > innerHeight - m) return "BL";
	return null;
}

function edgeAt(x, y) {
	if (y < 20) return "top";
	if (y > innerHeight - 20) return "bottom";
	if (x < 20) return "left";
	if (x > innerWidth - 20) return "right";
	return null;
}

function trackTap(e) {
	const x = e.clientX, y = e.clientY, now = Date.now();
	totalTaps++;
	TAPS.push(now);
	while (TAPS.length && now - TAPS[0] > 5000) TAPS.shift();

	if (lastTap && Math.abs(x - lastTap.x) < 20 && Math.abs(y - lastTap.y) < 20) sameSpot++;
	else sameSpot = 1;

	const c = cornerAt(x, y);
	if (c) {
		if (c === CORNER_ORDER[cornerSeq]) cornerSeq++;
		else cornerSeq = (c === CORNER_ORDER[0]) ? 1 : 0;
	} else cornerSeq = 0;

	lastTap = { x, y, t: now, button: e.button, ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, target: e.target, type: e.pointerType };
}

const tapHandlers = [];
const holdHandlers = [];

function onTap(fn) { tapHandlers.push(fn); }
function onHold(fn) { holdHandlers.push(fn); }

function tempClass(cls, ms = 2000) { addClass(cls); setTimeout(() => removeClass(cls), ms); }
function toggleClass(cls) { body.classList.toggle(cls); }

window.addEventListener("pointerdown", (e) => {
	trackTap(e);
	tapHandlers.forEach((fn) => { try { fn(e); } catch (err) {} });
	clearTimeout(holdTimer);
	holdTimer = setTimeout(() => {
		holdHandlers.forEach((fn) => { try { fn(); } catch (err) {} });
	}, 5000);
});
window.addEventListener("pointerup", () => clearTimeout(holdTimer));
window.addEventListener("pointercancel", () => clearTimeout(holdTimer));

const eggs = [
	{ name: "Konami-код", hint: "Легендарный код из старых игр: стрелки и буквы B, A", bind: () => window.addEventListener("keydown", onKeySequence("ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba", ultimate)) },
	{ name: "Ник автора", hint: "Просто напечатай ник автора этого сайта", bind: () => window.addEventListener("keydown", onKeySequence("olejka", confettiBurst)) },
	{ name: "Стойкий заголовок", hint: "Покликай по имени наверху… раз десять", bind: () => h1 && h1.addEventListener("click", countClicks("h1", 10, flyAway)) },
	{ name: "Консоль: clown()", hint: "Загляни в консоль браузера (F12) и введи clown()", bind: () => { window.clown = toggle; } },
	{ name: "Вечеринка", hint: "Добавь #party в адресную строку", bind: () => window.addEventListener("hashchange", onHash("#party", () => { addClass("fx-rainbow"); confettiBurst(); })) },
	{ name: "Огонь в адресе", hint: "Хочешь огонька? Допиши #fire к адресу", bind: () => window.addEventListener("hashchange", onHash("#fire", () => { setFire(true); addClass("fx-fire"); })) },
	{ name: "Тройной клик", hint: "Трижды кликни по иконке соцсети", bind: () => document.addEventListener("click", (e) => { if (e.target.closest(".links a")) countClicks(e.target.closest(".links a"), 3, () => e.target.closest(".links a").classList.add("fx-o"))(); }) },
	{ name: "Долгое нажатие", hint: "Зажми кнопку мыши и не отпускай", bind: () => window.addEventListener("mousedown", () => { setTimeout(() => { if (mouseDown) addClass("fx-gravity"); }, 1500); }) },
	{ name: "Секрет", hint: "Есть тайный URL… попробуй #secret", bind: () => window.addEventListener("hashchange", onHash("#secret", memeOverlay)) },
	{ name: "Двойной клик", hint: "Дважды кликни по фону", bind: () => window.addEventListener("dblclick", starBurst) },
	{ name: "Пропавшая страница", hint: "Набери число той самой пропавшей страницы", bind: () => window.addEventListener("keydown", onKeySequence("404", mini404)) },
	{ name: "Консоль: destroy()", hint: "В консоли введи destroy()", bind: () => { window.destroy = () => addClass("fx-destroy"); } },
	{ name: "Почти Konami", hint: "Напиши #konami в адресе — получишь намёк", bind: () => window.addEventListener("hashchange", onHash("#konami", () => alert("Почти! Попробуй стрелками ↑↑↓↓←→←→BA")) ) },
	{ name: "Футер", hint: "Кликни по копирайту внизу страницы", bind: () => { const f = document.querySelector("footer"); f && f.addEventListener("click", () => { addClass("fx-shake"); setTimeout(() => removeClass("fx-shake"), 1500); }); } },
	{ name: "Shift-клик", hint: "Зажми Shift и кликни в любом месте", bind: () => window.addEventListener("click", (e) => { if (e.shiftKey) addClass("fx-rainbow"); }) },
	{ name: "Фейерверк", hint: "Напечатай слово fire", bind: () => window.addEventListener("keydown", onKeySequence("fire", firework)) },
	{ name: "Рик", hint: "Напиши #rick в адресной строке", bind: () => window.addEventListener("hashchange", onHash("#rick", rick)) },
	{ name: "Угол", hint: "Загони курсор в самый верхний левый угол", bind: () => window.addEventListener("mousemove", cornerEmoji) },
	{ name: "Приветствие", hint: "Поздоровайся — набери hello", bind: () => window.addEventListener("keydown", onKeySequence("hello", () => { if (h1) { h1.textContent = "Привет! 👋"; setTimeout(() => h1.textContent = "Oleg Logvinov", 2000); } })) },
	{ name: "Снег", hint: "Хочешь снега? Допиши #snow к адресу", bind: () => window.addEventListener("hashchange", onHash("#snow", () => addClass("fx-snow"))) },
	{ name: "Копирование", hint: "Попробуй что-нибудь скопировать (Ctrl+C)", bind: () => window.addEventListener("copy", () => alert("Скопировано! (нет)")) },
	{ name: "Смех", hint: "Посмейся — набери lol", bind: () => window.addEventListener("keydown", onKeySequence("lol", () => { if (h1) { h1.textContent = "ХАХАХАХАХА"; setTimeout(() => h1.textContent = "Oleg Logvinov", 2000); } })) },
	{ name: "Матрица", hint: "Добавь #matrix в адресную строку", bind: () => window.addEventListener("hashchange", onHash("#matrix", () => effects.find(x => x.id === "matrix").on())) },
	{ name: "Лень", hint: "Просто не трогай ничего 30 секунд", bind: () => { idleTimer(); } },
	{ name: "Единорог", hint: "Немного магии — добавь #unicorn к адресу", bind: () => window.addEventListener("hashchange", onHash("#unicorn", () => spawnFalling("🦄", "faller"))) },
	{ name: "UwU", hint: "Набери uwu", bind: () => window.addEventListener("keydown", onKeySequence("uwu", () => { if (h1) h1.textContent = "UwU Logvinov"; addClass("fx-uwu"); })) },
	{ name: "Правая кнопка", hint: "Кликни правой кнопкой мыши", bind: () => window.addEventListener("contextmenu", (e) => { e.preventDefault(); popup("Ага! 👀"); }) },
	{ name: "Вайб", hint: "Включи вайб — добавь #vibe к адресу", bind: () => window.addEventListener("hashchange", onHash("#vibe", () => addClass("fx-vibe"))) },
	{ name: "Бананы", hint: "Набери banana", bind: () => window.addEventListener("keydown", onKeySequence("banana", () => { for (let i = 0; i < 20; i++) setTimeout(() => spawnFalling("🍌", "faller"), i * 100); })) },
	{ name: "Полный хаос", hint: "Добавь #chaos к адресу — и всё сразу", bind: () => window.addEventListener("hashchange", onHash("#chaos", enableAll)) },

	// ---- 30 click / tap eggs (mouse + mobile) ----
	{ name: "5 тапов", hint: "Тапни в любом месте 5 раз подряд", bind: () => onTap(() => { if (totalTaps === 5) { tempClass("fx-rainbow", 3000); popup("Радуга! 🌈"); } }) },
	{ name: "10 тапов", hint: "Тапни в любом месте 10 раз подряд", bind: () => onTap(() => { if (totalTaps === 10) confettiBurst(); }) },
	{ name: "25 тапов", hint: "Тапни в любом месте 25 раз подряд", bind: () => onTap(() => { if (totalTaps === 25) popup("Клик-мастер 🖱️"); }) },
	{ name: "50 тапов", hint: "Тапни в любом месте 50 раз подряд", bind: () => onTap(() => { if (totalTaps === 50) { tempClass("fx-invert", 2000); popup("Мир перевернулся! 🙃"); } }) },
	{ name: "100 тапов", hint: "Тапни в любом месте 100 раз подряд", bind: () => onTap(() => { if (totalTaps === 100) { firework(); popup("Ты кликал 100 раз! 🎉"); } }) },
	{ name: "3 быстрых тапа", hint: "Трижды быстро тапни (менее чем за полсекунды)", bind: () => onTap(() => { if (tapsWithin(500) >= 3) tempClass("fx-zoom", 1500); }) },
	{ name: "5 быстрых тапов", hint: "Пять раз быстро тапни", bind: () => onTap(() => { if (tapsWithin(500) >= 5) { tempClass("fx-blackhole", 2000); popup("Чёрная дыра! 🕳️"); } }) },
	{ name: "10 быстрых тапов", hint: "Десять раз очень быстро тапни", bind: () => onTap(() => { if (tapsWithin(500) >= 10) popup("Ультра-скорость! 🚀"); }) },
	{ name: "Верхняя кромка", hint: "Тапни по самому верху экрана", bind: () => onTap((e) => { if (edgeAt(e.clientX, e.clientY) === "top") spawnFalling(pick(EMOTES), "faller"); }) },
	{ name: "Нижняя кромка", hint: "Тапни по самому низу экрана", bind: () => onTap((e) => { if (edgeAt(e.clientX, e.clientY) === "bottom") { spawnFalling("🔥", "faller"); popup("Огонь! 🔥"); } }) },
	{ name: "Левая кромка", hint: "Тапни по левому краю экрана", bind: () => onTap((e) => { if (edgeAt(e.clientX, e.clientY) === "left" && !document.getElementById("matrix")) effects.find(x => x.id === "matrix").on(); }) },
	{ name: "Правая кромка", hint: "Тапни по правому краю экрана", bind: () => onTap((e) => { if (edgeAt(e.clientX, e.clientY) === "right") spawnFalling(pick(EMOTES), "faller"); }) },
	{ name: "Все 4 угла", hint: "Тапни по углам по порядку: вверх-лево → вверх-право → вниз-право → вниз-лево", bind: () => onTap(() => { if (cornerSeq === 4) { cornerSeq = 0; popup("Все углы! 🤡"); enableAll(); } }) },
	{ name: "Средняя кнопка", hint: "Нажми среднюю кнопку мыши (колесо)", bind: () => onTap((e) => { if (e.button === 1) toggleClass("fx-gravity"); }) },
	{ name: "5 ПКМ", hint: "Пять раз кликни правой кнопкой мыши", bind: () => { let n = 0; onTap((e) => { if (e.button === 2) { n++; if (n >= 5) { n = 0; tempClass("fx-neon", 2000); } } }); } },
	{ name: "Ctrl+тап", hint: "Зажми Ctrl и тапни", bind: () => onTap((e) => { if (e.ctrlKey) toggleClass("fx-invert"); }) },
	{ name: "Alt+тап", hint: "Зажми Alt и тапни", bind: () => onTap((e) => { if (e.altKey) toggleClass("fx-mirror"); }) },
	{ name: "Shift+двойной тап", hint: "Зажми Shift и быстро тапни дважды", bind: () => onTap((e) => { if (e.shiftKey && tapsWithin(300) >= 2) tempClass("fx-strobe", 1500); }) },
	{ name: "Танец футера", hint: "Дважды быстро тапни по копирайту внизу", bind: () => { let last = 0; onTap((e) => { if (!e.target.closest("footer")) return; const now = Date.now(); if (now - last < 300) { const f = document.querySelector("footer"); f.classList.add("fx-dance"); setTimeout(() => f.classList.remove("fx-dance"), 2000); last = 0; } else last = now; }); } },
	{ name: "Тройной тап по имени", hint: "Трижды быстро тапни по заголовку", bind: () => { let last = 0, cnt = 0; onTap((e) => { if (!e.target.closest("main h1")) { cnt = 0; return; } const now = Date.now(); cnt = (now - last < 400) ? cnt + 1 : 1; last = now; if (cnt >= 3) { cnt = 0; effects.find(x => x.id === "letters-fly").on(); } }); } },
	{ name: "Первая буква", hint: "Тапни по первой букве «O» заголовка", bind: () => onTap((e) => { if (!h1) return; const r = h1.getBoundingClientRect(); if (e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left && e.clientX <= r.left + 40) { h1.classList.add("fx-o"); setTimeout(() => h1.classList.remove("fx-o"), 1600); popup("O! 🅾️"); } }) },
	{ name: "7 тапов по иконке", hint: "Семь раз тапни по одной и той же иконке соцсети", bind: () => onTap((e) => { const a = e.target.closest(".links a"); if (!a) return; clickCounts[a] = (clickCounts[a] || 0) + 1; if (clickCounts[a] >= 7) { clickCounts[a] = 0; a.classList.add("fx-flyaway"); } }) },
	{ name: "Нетерпение", hint: "Тапни 10 раз в одну и ту же точку", bind: () => onTap(() => { if (sameSpot >= 10) { sameSpot = 0; popup("Ты нетерпелив 😤"); } }) },
	{ name: "Просыпайся", hint: "Дождись, пока звёзды «заснут» (30с без действий), и тапни", bind: () => onTap(() => { if (body.classList.contains("fx-sleepy")) { removeClass("fx-sleepy"); popup("Просыпайся! ⏰"); } }) },
	{ name: "Путешествие во времени", hint: "Пять раз тапни по футеру", bind: () => { let n = 0; onTap((e) => { if (e.target.closest("footer")) { n++; if (n >= 5) { n = 0; popup("Путешествие во времени ⏳"); } } }); } },
	{ name: "Все иконки", hint: "Тапни по каждой иконке соцсети по одному разу", bind: () => { const seen = new Set(); onTap((e) => { const a = e.target.closest(".links a"); if (!a) return; seen.add(a); const all = document.querySelectorAll(".links a").length; if (all > 0 && seen.size >= all) { seen.clear(); confettiBurst(); popup("Все иконки собраны! 🏆"); } }); } },
	{ name: "Долгое нажатие 5с", hint: "Зажми и удерживай палец/кнопку 5 секунд", bind: () => onHold(() => { tempClass("fx-invert", 2500); popup("Мега-переворот! 🙃"); }) },
	{ name: "Центр экрана", hint: "Тапни точно в центр экрана", bind: () => onTap((e) => { if (Math.abs(e.clientX - innerWidth / 2) < 50 && Math.abs(e.clientY - innerHeight / 2) < 50) popup("Ты нашёл центр! 🎯"); }) },
	{ name: "Убегающая кнопка", hint: "Трижды тапни по кнопке подсказок 🔍", bind: () => { let n = 0; onTap((e) => { if (e.target.closest("#clown-hints")) { n++; if (n >= 3) { n = 0; const b = document.querySelector("#clown-hints"); b.classList.add("fx-runaway"); } } }); } },
	{ name: "Взрыв конфетти", hint: "Тапни по падающему эмодзи или конфетти", bind: () => onTap((e) => { document.querySelectorAll(".faller, .faller-confetti").forEach((el) => { const r = el.getBoundingClientRect(); if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) { el.style.transform = "scale(3)"; el.style.opacity = "0"; el.style.transition = ".2s"; setTimeout(() => el.remove(), 200); } }); }) }
];

// --- egg helpers ---

function ultimate() { enableAll(); confettiBurst(); addClass("fx-strobe"); popup("ULTIMATE CLOWN MODE 🤡"); }
function confettiBurst() { for (let i = 0; i < 40; i++) setTimeout(() => spawnFalling(pick(["🎉","🎊","✨"]), "faller-confetti"), i * 40); layer(); }
function countClicks(key, n, fn) { return () => { clickCounts[key] = (clickCounts[key] || 0) + 1; if (clickCounts[key] >= n) { clickCounts[key] = 0; fn(); } }; }
function flyAway() { if (h1) { h1.classList.add("fx-flyaway"); setTimeout(() => { h1.classList.remove("fx-flyaway"); h1.textContent = "Oleg Logvinov"; }, 2000); } }
function memeOverlay() { const d = document.createElement("div"); d.id = "meme"; d.textContent = "😏 SECRET FOUND"; body.appendChild(d); setTimeout(() => d.remove(), 3000); }
function starBurst() { for (let i = 0; i < 30; i++) setTimeout(() => spawnFalling("⭐", "faller-confetti"), i * 30); layer(); }
function mini404() { popup("404: Ты потерялся 🧭"); }
function firework() { for (let i = 0; i < 60; i++) setTimeout(() => spawnFalling(pick(["🎆","🧨","✨","💥"]), "faller-confetti"), i * 50); layer(); }
function rick() { const d = document.createElement("div"); d.id = "rick"; d.textContent = "🕺 You just got rickrolled... NO? 👀"; body.appendChild(d); setTimeout(() => d.remove(), 4000); }
function popup(txt) { const d = document.createElement("div"); d.className = "chaos-popup"; d.textContent = txt; body.appendChild(d); setTimeout(() => d.remove(), 2500); }

let idleTimerSet = false;
function idleTimer() {
	if (idleTimerSet) return; idleTimerSet = true;
	let t;
	const reset = () => { clearTimeout(t); t = setTimeout(() => addClass("fx-sleepy"), 30000); removeClass("fx-sleepy"); };
	window.addEventListener("mousemove", reset);
	window.addEventListener("keydown", reset);
	window.addEventListener("pointerdown", reset);
	window.addEventListener("touchstart", reset);
	reset();
}

function cornerEmoji(e) {
	const m = 30;
	if (e.clientX < m && e.clientY < m) { const c = document.createElement("span"); c.className = "corner-emoji"; c.textContent = "😀"; body.appendChild(c); setTimeout(() => c.remove(), 1200); }
}

let mouseDown = false;
window.addEventListener("mousedown", () => mouseDown = true);
window.addEventListener("mouseup", () => mouseDown = false);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function enableAll() {
	effects.forEach(fx => { try { fx.on(); } catch (e) { logger.warn("fx fail " + fx.id); } });
	on = true;
}

function disableAll() {
	effects.forEach(fx => { try { fx.off && fx.off(); } catch (e) {} });
	on = false;
}

function toggle() { on ? disableAll() : enableAll(); return on; }

function toggleHints() {
	let panel = document.getElementById("hints-panel");
	if (panel) { panel.classList.toggle("open"); return; }

	panel = document.createElement("div");
	panel.id = "hints-panel";
	panel.className = "open";
	panel.innerHTML =
		`<div class="hints-head">Пасхалки 🔍 <span>${eggs.length} штук</span><button id="hints-close">✕</button></div>` +
		`<ul>` + eggs.map((e) => `<li><b>${e.name}</b> — ${e.hint}</li>`).join("") + `</ul>`;
	body.appendChild(panel);
	panel.querySelector("#hints-close").addEventListener("click", () => panel.classList.remove("open"));
}

function initHintsButton() {
	const btn = document.createElement("button");
	btn.id = "clown-hints";
	btn.title = "Подсказки к пасхалкам";
	btn.textContent = "🔍";
	btn.addEventListener("click", toggleHints);
	body.appendChild(btn);
}

function initChaos() {
	logger.log("Инициализация клоунады...");
	effects.forEach(fx => { try { fx.on(); } catch (e) { logger.warn("fx fail " + fx.id); } });
	eggs.forEach(egg => { try { egg.bind(); } catch (e) { logger.warn("egg fail " + egg.name); } });

	initHintsButton();

	window.addEventListener("keydown", (e) => { if (e.key === "Escape") { disableAll(); const p = document.getElementById("hints-panel"); p && p.classList.remove("open"); } });

	logger.log(`${effects.length} эффектов и ${eggs.length} пасхалок включены!`);
}

export { initChaos, toggle, enableAll, disableAll };
