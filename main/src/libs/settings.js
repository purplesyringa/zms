import {zeroFS, zeroPage} from "../route.js";

class Settings {
	async getAll() {
		let content = await zeroFS.readFile("content.json");
		content = JSON.parse(content);

		return content.settings || {};
	}

	async get(name, def) {
		let content = await zeroFS.readFile("content.json");
		content = JSON.parse(content);

		let settings = content.settings || {};
		return settings[name] || def;
	}

	async set(name, value) {
		let content = await zeroFS.readFile("content.json");
		content = JSON.parse(content);

		if(!content.settings) {
			content.settings = {};
		}

		content.settings[name] = value;

		content = JSON.stringify(content, null, 1);
		await zeroFS.writeFile("content.json", content);
		await zeroPage.publish("content.json");
	}


	async setContent(name, value) {
		let content = await zeroFS.readFile("content.json");
		content = JSON.parse(content);

		content[name] = value;

		content = JSON.stringify(content, null, 1);
		await zeroFS.writeFile("content.json", content);
		await zeroPage.publish("content.json");
	}
};

export default new Settings();