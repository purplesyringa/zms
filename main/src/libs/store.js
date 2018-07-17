import {zeroAuth, zeroDB, zeroFS, zeroPage} from "../zero";
import RemoteZeroDB from "zero-dev-lib/RemoteZeroDB";
import RemoteZeroFS from "zero-dev-lib/RemoteZeroFS";

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
		const remoteZeroFS = new RemoteZeroFS(zeroPage, this.ZMS_STORE);
		this.Themes = Themes({zeroAuth, zeroDB: remoteZeroDB, zeroFS: remoteZeroFS, zeroPage, blogZeroFS: zeroFS});
	}

	async load() {
		console.log("Loading order of chunks");
		const chunks = eval(await zeroFS.readFile(`cors-${this.ZMS_STORE}/extern/chunks.js`));

		console.log("Loading entry");
		await this._loadScript("entry");

		for(const chunk of Array.reverse(chunks)) {
			const name = Object.keys(chunk)[0];
			console.log("Loading chunk", name);
			await this._loadScript(name);
		}

		console.log("Loaded ZMS Store");
	}

	_loadScript(name) {
		return new Promise((resolve, reject) => {
			let script = document.createElement("script");
			script.src = `cors-${this.ZMS_STORE}/extern/${name}.js`;
			script.onload = resolve;
			script.onerror = reject;
			document.body.appendChild(script);
		});
	}
}

export default new Store();