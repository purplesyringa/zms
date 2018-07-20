const      LOG_COLOR = "#3333FF";
const    DEBUG_COLOR = "#3333FF";
const     WARN_COLOR = "#FF9933";
const    ERROR_COLOR = "#FF5050";
const   NUMBER_COLOR = "#0066FF";
const  BOOLEAN_COLOR = "#9966FF";
const CONSTANT_COLOR = "#A6A6A6";
const    ARRAY_COLOR = "#33CC33";
const    COMMA_COLOR = "#A6A6A6";
const   OBJECT_COLOR = "#33CC33";


let installed = false;
let oldConsole = null;
let pre = null;

export function install() {
	installed = true;
	document.body.insertBefore(pre = $(`<pre class="console-hook"></pre>`), document.body.firstChild);

	oldConsole = {
		log: console.log,
		debug: console.debug,
		warn: console.warn,
		error: console.error
	};

	console.log = (...args) => {
		show(">", LOG_COLOR, ...args);
		oldConsole.log.call(console, ...args);
	};

	console.debug = (...args) => {
		show("i", DEBUG_COLOR, ...args);
		oldConsole.debug.call(console, ...args);
	};

	console.warn = (...args) => {
		show("!", WARN_COLOR, ...args);
		oldConsole.warn.call(console, ...args);
	};

	console.error = (...args) => {
		show("!", ERROR_COLOR, ...args);
		oldConsole.error.call(console, ...args);
	};
}

export function uninstall() {
	if(installed) {
		installed = false;
		Object.assign(console, oldConsole);
		pre.parentNode.removeChild(pre);
	}
}

function show(char, color, ...args) {
	pre.appendChild($(`
		<div>
			<span style="color: ${color};">${char} </span>
			${renderArgs(...args)}
		</div>
	`));
	setImmediate(() => {
		pre.scrollTop = 10000000;
	});
}

function renderArgs(...args) {
	return args.map(arg => {
		if(typeof arg === "string") {
			return arg
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;");
		} else if(typeof arg === "number") {
			return `<span style="color: ${NUMBER_COLOR}">${arg}</span>`;
		} else if(typeof arg === "boolean") {
			return `<span style="color: ${BOOLEAN_COLOR}">${arg}</span>`;
		} else if(typeof arg === "undefined") {
			return `<span style="color: ${CONSTANT_COLOR}">undefined</span>`;
		} else if(arg === null) {
			return `<span style="color: ${CONSTANT_COLOR}">null</span>`;
		} else if(Array.isArray(arg)) {
			return `
				<span style="color: ${ARRAY_COLOR}">[ </span>
				${arg.map(v => renderArgs(v)).join(`
					<span style="color: ${COMMA_COLOR}">, </span>
				`)}
				<span style="color: ${ARRAY_COLOR}"> ]</span>
			`;
		} else if(arg instanceof Error) {
			return `
				<span style="color: ${ERROR_COLOR}">${arg.constructor.name}: </span>
				${renderArgs(arg.message)}
			`;
		} else if(typeof arg === "object") {
			return `
				<span style="color: ${OBJECT_COLOR}">{ </span>
				${Object.keys(arg).map(key => `
					<span style="color: #080">${renderArgs(key)}: </span>
					${renderArgs(arg[key])}
				`).join(`
					<span style="color: ${COMMA_COLOR}">, </span>
				`)}
				<span style="color: ${OBJECT_COLOR}"> }</span>
			`;
		} else {
			return `<span style="color: ${CONSTANT_COLOR}">${typeof arg}</span>`;
		}
	}).join(" ");
}


function $(content) {
	content = content.split("\n").map(line => line.replace(/^\t+/, "")).filter(line => line).join("");

	const node = document.createElement("div");
	node.innerHTML = content;
	return node.children[0];
}