import {zeroFS, zeroPage} from "./zero";


export default class XMLHTTPRequest {
	constructor() {
	}

	open(method, url, async) {
		if(
			url.startsWith("http:") ||
			url.startsWith("https:") ||
			url.startsWith("ftp:") ||
			url.startsWith("data:") ||
			url.startsWith("file:")
		) {
			this._xhr = new XMLHTTPRequest();
			this._xhr.onreadystatechange = this.onreadystatechange;
			this._xhr.onload = this.onload;
			return this._xhr.open(method, url, async);
		}

		this._url = url;
	}

	send(...args) {
		if(this._xhr) {
			this._xhr.responseType = this.responseType;
			this._xhr.send(...args);
			this._xhr.onreadystatechange = () => {
				this.readyState = this._xhr.readyState;
				this.status = this._xhr.status;
				this.statusText = this._xhr.statusText;
				this.response = this._xhr.response;
				this.responseText = this._xhr.responseText;
				if(this.onreadystatechange) {
					this.onreadystatechange();
				}
			};
			delete this._xhr;
			return;
		}


		setImmediate(async () => {
			if(this.responseType === "" || this.responseType === "text") {
				this.response = await zeroFS.readFile(this._url, false);
			} else if(this.responseType === "json") {
				this.response = JSON.parse(await zeroFS.readFile(this._url, false));
			} else if(this.responseType === "arraybuffer") {
				this.response = new ArrayBuffer(await zeroFS.readFile(this._url, "arraybuffer"));
			} else if(this.responseType === "blob") {
				this.response = new Blob([new Uint8Array(await zeroFS.readFile(this._url, "arraybuffer"))]);
			}
			this.responseText = await zeroFS.readFile(this._url, false);

			this.status = 200;
			this.statusText = "OK";

			await this._emitReadyState(1);
			await this._emitReadyState(2);
			await this._emitReadyState(3);
			await this._emitReadyState(4);
			if(this.onload) {
				this.onload();
			}
		});
	}

	_emitReadyState(state) {
		return new Promise((resolve, reject) => {
			setImmediate(resolve);

			this.readyState = state;
			if(this.onreadystatechange) {
				this.onreadystatechange();
			}
		});
	}
};