import {zeroFS} from "../zero";
import Settings from "./settings.js";
import deepcopy from "deepcopy";
import Store from "./store";
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
	"theme-button": "components/button.vue",
	"customizable": "components/customizable.vue"
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
		return RequireEngine.getManifest("theme/", "theme.json");
	}




	async loadPlugins() {
		await Promise.all(
			(await zeroFS.readDirectory("plugins", false)).map(async plugin => {
				await RequireEngine.rebuild(`plugins/${plugin}/`, "plugin.json", (...args) => {
					return Store.Plugins.rebuildPluginFile(unescape(plugin), ...args);
				}, async () => {
					let files = await Store.Plugins.buildPlugin(unescape(plugin), () => {});
					await Store.Plugins.savePlugin(unescape(plugin), files, () => {});
				});
			})
		);
	}

	async loadTheme() {
		await RequireEngine.rebuild("theme/", "theme.json", (...args) => {
			return Store.Themes.rebuildThemeFile(...args);
		}, async () => {
			let files = await Store.Themes.buildTheme(() => {});
			await Store.Themes.saveTheme(files, () => {});
		});

		const context = await RequireEngine.loadContext("theme/");

		for(const name of Object.keys(COMPONENTS)) {
			Vue.component(name, context.require(`/src/theme/${COMPONENTS[name]}`));
		}

		context.require("/src/theme/global.sass");
	}
};


export default new Theme();