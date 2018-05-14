import {zeroAuth, zeroDB, zeroFS, zeroPage} from "../route.js";
import RemoteZeroDB from "zero-dev-lib/RemoteZeroDB";

class Store {
	ZMS_STORE = "1StoREUtoyQjPCH7BXVqFC4LDLsEJt6gE";

	async mount() {
		// Request CORS permission
		await zeroPage.cmd("corsPermission", [this.ZMS_STORE]);

		// Load script
		await this.load();

		// Save
		let {Themes} = await System.import("ZMSStore");
		const remoteZeroDB = new RemoteZeroDB(zeroPage, this.ZMS_STORE);
		this.Themes = Themes({zeroAuth, zeroDB: remoteZeroDB, zeroFS, zeroPage});
	}

	load() {
		return new Promise((resolve, reject) => {
			let script = document.createElement("script");
			script.src = `cors-${this.ZMS_STORE}/extern.js`;
			script.onload = resolve;
			script.onerror = reject;
			document.body.appendChild(script);
		});
	}
}

export default new Store();