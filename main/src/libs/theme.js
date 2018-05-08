import {zeroFS, zeroPage} from "../route.js";
import Settings from "./settings.js";
import deepcopy from "deepcopy";

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

		for(let name of Object.keys(manifest)) {
			let value = settings["theme." + name];
			if(value !== undefined) {
				manifest[name].value = value;
			} else {
				manifest[name].value = manifest[name].default;
			}
		}

		return manifest;
	}


	getManifest() {
		return require("../vue_components/theme/theme.json");
	}
};

export default new Theme();