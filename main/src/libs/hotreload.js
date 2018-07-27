import {zeroPage, zeroFS} from "../zero";
import limit from "limit-concurrency-decorator";

class HotReload {
	constructor() {
		zeroPage.on("setSiteInfo", this.onSetSiteInfo.bind(this));

		this.hotreloads = [];
		this.dbschema = null;
	}

	@limit(1)
	async getDbschema() {
		if(this.dbschema) {
			return this.dbschema;
		}

		this.dbschema = JSON.parse(await zeroFS.readFile("dbschema.json"));
		return this.dbschema;
	}


	register(tableName, f) {
		if(!this.hotreloads[tableName]) {
			this.hotreloads[tableName] = [];
		}
		this.hotreloads[tableName].push(f);
	}

	patchArray(oldArray, newArray, idFunc) {
		if(typeof idFunc === "string") {
			const idProp = idFunc;
			idFunc = obj => obj[idProp];
		}

		let ids = {};
		for(const obj of oldArray) {
			ids[idFunc(obj)] = obj;
		}

		let newArrayIds = newArray.map(idFunc);

		for(const newObj of newArray) {
			const oldObj = ids[idFunc(newObj)];
			if(!oldObj) {
				// Add
				oldArray.push(newObj);
			} else {
				// Change
				this.patchObject(oldObj, newObj);
			}
		}

		for(const oldId of Object.keys(ids)) {
			if(newArrayIds.indexOf(oldId) === -1) {
				// Remove
				oldArray.splice(oldArray.indexOf(ids[oldId]), 1);
			}
		}

		// Sort to correct order, like in new array
		oldArray.sort((a, b) => {
			return newArrayIds.indexOf(idFunc(a)) - newArrayIds.indexOf(idFunc(b));
		});
	}

	patchObject(oldObj, newObj) {
		for(const prop of Object.keys(oldObj)) {
			if(!newObj.hasOwnProperty(prop)) {
				// Delete property
				delete oldObj[prop];
			} else {
				// Change property
				if(typeof oldObj[prop] === "object" && typeof newObj[prop] === "object") {
					const hotreloader = oldObj[prop]._hotreload || newObj[prop]._hotreload;
					if(hotreloader) {
						// This is a hot-reloadable array
						this.patchArray(oldObj[prop], newObj[prop], hotreloader);
					} else if(Array.isArray(oldObj[prop])) {
						// This is an array, but it's not hot-reloadable
						// We don't use splice() here because of argument
						// count limitations
						oldObj[prop].length = 0;
						for(const value of newObj[prop]) {
							oldObj[prop].push(value);
						}
					} else {
						// This is an object
						this.patchObject();
					}
				}
			}
		}

		for(const prop of Object.keys(newObj)) {
			if(!oldObj.hasOwnProperty(prop)) {
				// Add property
				oldObj[prop] = newObj[prop];
			}
		}
	}

	async emit(filePath) {
		await this.onSetSiteInfo({
			params: {
				event: ["file_done", filePath]
			}
		});
	}


	async onSetSiteInfo({params: {event}}) {
		if(event && (event[0] === "file_done" || event[0] === "file_added")) {
			const file = event[1];

			const dbschema = await this.getDbschema();
			for(const map of Object.keys(dbschema.maps)) {
				// Find maps matching updated file
				if(new RegExp("^" + map + "$").test(file) && dbschema.maps[map].to_table) {
					for(const tableName of dbschema.maps[map].to_table) {
						if(typeof tableName !== "string") {
							continue;
						}

						if(this.hotreloads[tableName]) {
							this.hotreloads[tableName].forEach(f => f());
						}
					}
				}
			}
		}
	}

}

export default new HotReload();