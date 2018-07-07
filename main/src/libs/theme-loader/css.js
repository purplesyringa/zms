import {zeroPage, zeroFS} from "../../route.js";
import Sass from "sass.js/dist/sass.sync.js";
import httpVueLoader from "http-vue-loader";

function process(lang) {
	return code => {
		// First, remove empty lines
		code = code.split("\n").filter(line => line.trim()).join("\n");
		// Now, find out smallest padding
		let padding = code
			.split("\n") // Split into lines
			.map(line => line.match(/^(\s*)/)[0]) // Get padding
			.map(spaces => spaces.length) // Get padding width
			.reduce((a, b) => Math.min(a, b), Infinity); // Find least width
		// If no spaces were found, think of them as 0
		if(padding === Infinity) {
			padding = 0;
		}
		// Remove spaces
		code = code.split("\n").map(line => line.substr(padding)).join("\n");
		// Yay! We need those 10 lines of code to fix stupid {} error!

		let id = Math.random().toString(36).substr(2);

		return new Promise((resolve, reject) => {
			Sass.writeFile(`.${id}.${lang}`, code, () => {
				Sass.compileFile(`.${id}.${lang}`, result => {
					if(result.status) {
						return reject(new Error(result.formatted));
					}

					resolve(result.text);
				});
			});
		});
	};
}

// Upload all CSS files to Sass
export async function configCss() {
	let cssFiles = await zeroFS.readDirectory("theme");
	cssFiles = cssFiles.filter(name => /\.(css|sass|scss)$/.test(name));
	await new Promise(resolve => Sass.preloadFiles("theme", "", cssFiles, resolve));

	httpVueLoader.langProcessor.sass = process("sass");
	httpVueLoader.langProcessor.scss = process("scss");
}