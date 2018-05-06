import {zeroFS, zeroPage} from "../route.js";

class Settings {
	async get(name, def) {
		let content = await zeroFS.readFile("content.json");
		content = JSON.parse(content);

		let settings = content.settings || {};
		return settings[name] || def;
	}
};

export default new Settings();