import {zeroFS, zeroPage} from "../route.js";
import Settings from "./settings.js";

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
		const themeJson = this.getManifest();
		let settings = {};
		for await(let setting of themeJson.settings) {
			settings[setting.name] = await this.getSetting(setting.name);
		}
		return settings;
	}


	getManifest() {
		return require("../vue_components/theme/theme.json");
	}
};

export default new Theme();