import path from "path";

export default class RequireContext {
	constructor(prefix, files, srcContext) {
		this.prefix = prefix;
		this.files = files;
		this.srcContext = srcContext;
		this.srcContextKeys = srcContext.keys();
	}

	require(reqPath, origin) {
		const absPath = "." + path.resolve(origin, reqPath);

		if(absPath.startsWith(`./src/${this.prefix}`)) {
			if(!this.files.hasOwnProperty(absPath)) {
				throw new TypeError(`require(): ${absPath} cannot be found`);
			}

			const code = this.files[absPath];

			if(absPath.endsWith(".json")) {
				return JSON.parse(code);
			}

			const func = new Function("require", "module", "exports", code);

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
			return moduleModule.exports;
		} else if(absPath.startsWith("./src/")) {
			const srcPath = absPath.replace("./src/", "./");
			if(this.srcContextKeys.indexOf(srcPath) > -1) {
				return this.srcContext(srcPath);
			} else if(this.srcContextKeys.indexOf(`${srcPath}.js`) > -1) {
				return this.srcContext(`${srcPath}.js`);
			} else {
				throw new TypeError(`require(): ${absPath} cannot be found`);
			}
		} else {
			throw new TypeError(`require(): ${absPath} is not a valid path`);
		}
	}

	has(reqPath, origin) {
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
};