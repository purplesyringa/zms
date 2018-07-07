import {zeroFS, zeroPage} from "../zero";
import Settings from "./settings.js";
import deepcopy from "deepcopy";


import Vue from "vue/dist/vue.min.js";

import ThemeHeader from "../theme/header.vue";
import ThemeList from "../theme/list.vue";
import ThemePost from "../theme/post.vue";
import ThemeFooter from "../theme/footer.vue";
import NamedInput from "../theme/components/named-input.vue";
import NamedTextArea from "../theme/components/named-textarea.vue";
import ThemeButton from "../theme/components/button.vue";


class Theme {
	async getSetting(name) {
		let res = await Settings.get("theme." + name, undefined);
		if(res !== undefined) {
			return res;
		}

		const themeJson = this.getManifest();
		let setting = themeJson.settings.find(setting => setting.name === name);
		return setting.default;
	}

	async getAllSettings() {
		const manifest = deepcopy(this.getManifest().settings);
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


	getManifest() {
		return require("../theme/theme.json");
	}



	async loadTheme() {
		console.log("Loading theme");

		Vue.component("theme-header", ThemeHeader);
		Vue.component("theme-list", ThemeList);
		Vue.component("theme-post", ThemePost);
		Vue.component("theme-footer", ThemeFooter);
		Vue.component("named-input", NamedInput);
		Vue.component("named-textarea", NamedTextArea);
		Vue.component("theme-button", ThemeButton);

		require("../theme/table.sass");
	}
};

export default new Theme();