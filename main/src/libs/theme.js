import {zeroFS} from "../zero";
import Settings from "./settings.js";
import deepcopy from "deepcopy";
import normalizeComponent from "vue-loader/lib/component-normalizer";
import addStylesClient from "vue-style-loader/lib/addStylesClient";
import Store from "./store";
import RequireContext from "./require-context";
import * as RequireEngine from "./require-engine";

import Vue from "vue/dist/vue.min.js";


const COMPONENTS = {
	"theme-header": "header.vue",
	"theme-list": "list.vue",
	"theme-post": "post.vue",
	"theme-edit-post": "edit-post.vue",
	"theme-footer": "footer.vue",
	"named-input": "components/named-input.vue",
	"named-textarea": "components/named-textarea.vue",
	"theme-button": "components/button.vue"
};
const srcContext = require.context("..", true, /\.js$/);


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
		return RequireEngine.getManifest("theme/", "theme.json");
	}



	async loadTheme(tryBuild=true) {
		await RequireEngine.rebuild("theme/", "theme.json", (...args) => {
			return Store.Themes.rebuildThemeFile(...args);
		}, async () => {
			let files = await Store.Themes.buildTheme(() => {});
			await Store.Themes.saveTheme(files, () => {});
		});



		console.log("Loading theme");

		let files = {};
		for(let name of await zeroFS.readDirectory("theme/__build", true)) {
			files[`./src/theme/${name}`] = await zeroFS.readFile(`theme/__build/${name}`);
		}

		const context = new RequireContext("theme/", files, srcContext);

		for(const name of Object.keys(COMPONENTS)) {
			const compPath = COMPONENTS[name];

			if(!context.has(`./${compPath}`, "./src/theme")) {
				throw new RequireEngine.FileNotFoundError(compPath);
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

		context.require("./global.sass", "./src/theme");
	}
};


export default new Theme();