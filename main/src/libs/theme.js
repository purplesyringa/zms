import {zeroFS, zeroPage} from "../zero";
import Settings from "./settings.js";
import deepcopy from "deepcopy";
import path from "path";
import crypto from "crypto";
import {Buffer} from "buffer";
import normalizeComponent from "vue-loader/lib/component-normalizer";
import addStylesClient from "vue-style-loader/lib/addStylesClient";
import Store from "./store";

import Vue from "vue/dist/vue.min.js";


const COMPONENTS = {
	"theme-header": "header.vue",
	"theme-list": "list.vue",
	"theme-post": "post.vue",
	"theme-footer": "footer.vue",
	"named-input": "components/named-input.vue",
	"named-textarea": "components/named-textarea.vue",
	"theme-button": "components/button.vue"
};
const srcContext = require.context("..", true, /\.js$/);


export class ThemeFileNotFoundError extends Error {
};


class Theme {
	async getSetting(name) {
		let res = await Settings.get("theme." + name, undefined);
		if(res !== undefined) {
			return res;
		}

		const themeJson = await this.getManifest();
		let setting = themeJson.settings.find(setting => setting.name === name);
		return setting.default;
	}

	async getAllSettings() {
		const manifest = deepcopy((await this.getManifest()).settings);
		const settings = await Settings.getAll();

		for(let setting of manifest) {
			if(!setting.name) {
				continue;
			}

			let value = settings["theme." + setting.name];
			if(value !== undefined) {
				setting.value = value;
			} else {
				setting.value = setting.default;
			}
		}

		return manifest;
	}

	async applySettings(obj) {
		let obj2 = {};
		for(let name of Object.keys(obj)) {
			obj2["theme." + name] = obj[name];
		}

		await Settings.applyPack(obj2);
	}


	async getManifest() {
		const context = new ThemeContext({
			"./src/theme/theme.json": await zeroFS.readFile("theme/__build/theme.json")
		}, srcContext);
		return context.require("./src/theme/theme.json", "");
	}



	async loadTheme() {
		if((await zeroPage.getSiteInfo()).settings.own) {
			console.log("Checking theme for file changes");

			let manifest;
			try {
				manifest = await this.getManifest();
			} catch(e) {
				// Malformed manifest
				return;
			}
			const hashes = manifest._hashes;
			let newHashes = {};
			let changes = [];

			for(const fileName of Object.keys(hashes)) {
				let content;
				try {
					content = await zeroFS.readFile(`theme/${fileName}`, "arraybuffer");
				} catch(e) {
					console.log(fileName, "deleted");
					changes.push([
						fileName,
						"deleted"
					]);
					continue;
				}

				const newHash = crypto.createHash("md5").update(Buffer.from(content)).digest("hex");
				const oldHash = hashes[fileName];

				if(newHash != oldHash) {
					console.log(fileName, "changed");
					changes.push([
						fileName,
						"changed"
					]);
					newHashes[fileName] = newHash;
				} else {
					newHashes[fileName] = newHash;
				}
			}

			for(const fileName of await zeroFS.readDirectory("theme", true)) {
				if(fileName.startsWith("__build/")) {
					continue;
				}

				if(!hashes[fileName]) {
					console.log(fileName, "added");
					changes.push([
						fileName,
						"added"
					]);

					const content = await zeroFS.readFile(`theme/${fileName}`, "arraybuffer");
					const newHash = crypto.createHash("md5").update(Buffer.from(content)).digest("hex");
					newHashes[fileName] = newHash;
				}
			}

			if(changes.length) {
				for(let i = 0; i < changes.length; i++) { // Don't optimize!
					const [fileName, action] = changes[i];
					if(manifest._dependents[fileName]) {
						changes = changes.concat(manifest._dependents[fileName].map(dependency => {
							return [dependency, "dependency"];
						}));
					}
				}

				console.log("Rebuilding", changes);

				let newDependents = {};
				for(const [fileName, action] of changes) {
					if(action === "deleted") {
						try {
							await zeroFS.deleteFile(`theme/__build/${fileName}`);
						} catch(e) {
							console.warn("[rebuild error]", "Could not delete theme file", fileName);
						}
					} else {
						await Store.mount();
						const {result: compiled, dependents} = await Store.Themes.rebuildThemeFile(fileName);
						await zeroFS.writeFile(`theme/__build/${fileName}`, compiled);

						for(const dependentName of Object.keys(dependents)) {
							if(!newDependents[dependentName]) {
								newDependents[dependentName] = [];
							}
							newDependents[dependentName] = newDependents[dependentName].concat(dependents[dependentName]);
						}
					}
				}

				const newManifest = Object.assign({}, manifest, {
					_hashes: newHashes,
					_dependents: Object.assign({}, manifest._dependents, newDependents)
				});
				await zeroFS.writeFile("theme/__build/theme.json", JSON.stringify(newManifest, null, "\t"));
			}
		}



		console.log("Loading theme");

		let files = {};
		for(let name of await zeroFS.readDirectory("theme/__build", true)) {
			files[`./src/theme/${name}`] = await zeroFS.readFile(`theme/__build/${name}`);
		}

		const context = new ThemeContext(files, srcContext);

		for(const name of Object.keys(COMPONENTS)) {
			const compPath = COMPONENTS[name];

			if(!context.has(`./${compPath}`, "./src/theme")) {
				throw new ThemeFileNotFoundError(compPath);
			}

			const ex = context.require(`./${compPath}`, "./src/theme").default;

			const injectStyle = () => {
				addStylesClient(ex.options.scopeId, ex.allCss, true, ex.options);
			};
			const Component = normalizeComponent(
				ex.mExports,
				{
					render: ex.render,
					staticRenderFns: ex.staticRenderFns
				},
				false,
				injectStyle,
				ex.options.scopeId,
				null
			);

			Vue.component(name, Component.exports);
		}

		context.require("./table.sass", "./src/theme");
	}
};


class ThemeContext {
	constructor(themeFiles, srcContext) {
		this.themeFiles = themeFiles;
		this.srcContext = srcContext;
		this.srcContextKeys = srcContext.keys();
	}

	require(reqPath, origin) {
		const absPath = "." + path.resolve(origin, reqPath);

		if(absPath.startsWith("./src/theme/")) {
			if(!this.themeFiles.hasOwnProperty(absPath)) {
				throw new TypeError(`require(): ${absPath} cannot be found`);
			}

			const code = this.themeFiles[absPath];

			if(absPath.endsWith(".json")) {
				return JSON.parse(code);
			}

			const func = new Function("require", "module", "exports", code);

			const moduleRequire = reqPath => {
				return this.require(reqPath, path.dirname(absPath));
			};
			const moduleExports = {
				default: {}
			};
			const moduleModule = {
				exports: moduleExports
			};

			func(moduleRequire, moduleModule, moduleExports);
			return moduleModule.exports;
		} else if(absPath.startsWith("./src/")) {
			const srcPath = absPath.replace("./src/", "./");
			if(this.srcContextKeys.indexOf(srcPath) > -1) {
				return this.srcContext(srcPath);
			} else if(this.srcContextKeys.indexOf(`${srcPath}.js`) > -1) {
				return this.srcContext(`${srcPath}.js`);
			} else {
				throw new TypeError(`require(): ${absPath} cannot be found`);
			}
		} else {
			throw new TypeError(`require(): ${absPath} is not a valid path`);
		}
	}

	has(reqPath, origin) {
		const absPath = "." + path.resolve(origin, reqPath);

		if(absPath.startsWith("./src/theme/")) {
			return this.themeFiles.hasOwnProperty(absPath);
		} else if(absPath.startsWith("./src/")) {
			const srcPath = absPath.replace("./src/", "./");
			return (
				this.srcContextKeys.indexOf(srcPath) > -1 ||
				this.srcContextKeys.indexOf(`${srcPath}.js`) > -1
			);
		}

		return false;
	}
};

export default new Theme();