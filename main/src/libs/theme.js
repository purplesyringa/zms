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

		for(let name of Object.keys(settings)) {
			if(!name.startswith("theme.")) {
				continue;
			}

			name = name.replace("theme.", "");
			let setting = manifest.find(setting => setting.name === name);
			if(setting) {
				setting.value = name;
			}
		}

		return manifest;
	}


	getManifest() {
		return require("../vue_components/theme/theme.json");
	}
};

export default new Theme();