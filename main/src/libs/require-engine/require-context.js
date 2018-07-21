import path from "path";

export class FileNotFoundError extends Error {
};

export default class RequireContext {
	constructor(prefix, files, srcContext) {
		this.prefix = prefix;
		this.files = files;
		this.srcContext = srcContext;
		this.srcContextKeys = srcContext.keys();

		this.postHandlers = [];
	}

	registerPostHandler(regExp, f, src=false) {
		this.postHandlers.push({regExp, f, src});
	}

	require(reqPath, origin="/") {
		let absPath;
		if(
			!reqPath.startsWith("./") &&
			!reqPath.startsWith("../") &&
			!reqPath.startsWith("/")
		) {
			absPath = `./src/libs/${reqPath}`;
		} else {
			absPath = "." + path.resolve(origin, reqPath);
		}

		if(absPath.startsWith(`./src/${this.prefix}`)) {
			if(!this.files.hasOwnProperty(absPath)) {
				throw new FileNotFoundError(absPath);
			}

			const code = this.files[absPath];

			if(absPath.endsWith(".json")) {
				return JSON.parse(code);
			}

			let func;
			try {
				func = new Function("require", "module", "exports", code);
			} catch(e) {
				console.error("Error at", absPath);
				throw e;
			}

			const moduleRequire = reqPath => {
				return this.require(reqPath, path.dirname(absPath));
			};
			const moduleExports = {
				default: {}
			};
			const moduleModule = {
				exports: moduleExports
			};

			func(moduleRequire, moduleModule, moduleExports);

			let result = moduleModule.exports;
			for(const {regExp, f} of this.postHandlers) {
				if(typeof regExp === "string") {
					if(regExp === absPath) {
						result = f.call(this, result);
					}
				} else {
					if(regExp.test(absPath)) {
						result = f.call(this, result);
					}
				}
			}
			return result;
		} else if(absPath.startsWith("./src/")) {
			const srcPath = absPath.replace("./src/", "./");
			let result;
			if(this.srcContextKeys.indexOf(srcPath) > -1) {
				result = this.srcContext(srcPath);
			} else if(this.srcContextKeys.indexOf(`${srcPath}.js`) > -1) {
				result = this.srcContext(`${srcPath}.js`);
			} else {
				throw new FileNotFoundError(absPath);
			}

			for(const {regExp, f, src} of this.postHandlers) {
				if(!src) {
					continue;
				}

				if(typeof regExp === "string") {
					if(regExp === absPath) {
						result = f.call(this, result);
					}
				} else {
					if(regExp.test(absPath)) {
						result = f.call(this, result);
					}
				}
			}
			return result;
		} else {
			throw new FileNotFoundError(absPath);
		}
	}

	has(reqPath, origin="/") {
		const absPath = "." + path.resolve(origin, reqPath);

		if(absPath.startsWith(`./src/${this.prefix}`)) {
			return this.files.hasOwnProperty(absPath);
		} else if(absPath.startsWith("./src/")) {
			const srcPath = absPath.replace("./src/", "./");
			return (
				this.srcContextKeys.indexOf(srcPath) > -1 ||
				this.srcContextKeys.indexOf(`${srcPath}.js`) > -1
			);
		}

		return false;
	}

	readDirectory(absPath) {
		let result = {};
		for(let fileName of Object.keys(this.files)) {
			if(fileName.startsWith(absPath + "/")) {
				result[fileName.replace(absPath + "/", "")] = this.require(fileName);
			}
		}
		return result;
	}
};