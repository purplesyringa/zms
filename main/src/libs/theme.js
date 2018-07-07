import {zeroFS, zeroPage} from "../zero";
import Settings from "./settings.js";
import deepcopy from "deepcopy";
import path from "path";
import normalizeComponent from "vue-loader/lib/component-normalizer";

import Vue from "vue/dist/vue.min.js";


const COMPONENTS = {
	"theme-header": "header.vue",
	"theme-list": "list.vue",
	"theme-post": "post.vue",
	"theme-footer": "footer.vue",
	"named-input": "components/named-input.vue",
	"named-textarea": "components/named-textarea.vue",
	"theme-button": "components/button.vue"
};
const srcContext = require.context("..", true, /\.js$/);
const srcContextKeys = srcContext.keys();


import ThemeHeader from "../theme/header.vue";
import ThemeList from "../theme/list.vue";
import ThemePost from "../theme/post.vue";
import ThemeFooter from "../theme/footer.vue";
import NamedInput from "../theme/components/named-input.vue";
import NamedTextArea from "../theme/components/named-textarea.vue";
import ThemeButton from "../theme/components/button.vue";


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

		for(let setting of manifest) {
			if(!setting.name) {
				continue;
			}

			let value = settings["theme." + setting.name];
			if(value !== undefined) {
				setting.value = value;
			} else {
				setting.value = setting.default;
			}
		}

		return manifest;
	}

	async applySettings(obj) {
		let obj2 = {};
		for(let name of Object.keys(obj)) {
			obj2["theme." + name] = obj[name];
		}

		await Settings.applyPack(obj2);
	}


	getManifest() {
		return require("../theme/theme.json");
	}



	async loadTheme() {
		console.log("Loading theme");

		let files = {};
		for(let name of await zeroFS.readDirectory("theme/__build", true)) {
			files[name] = await zeroFS.readFile(`theme/__build/${name}`);
		}

		for(const name of Object.keys(COMPONENTS)) {
			const compPath = COMPONENTS[name];
			const code = files[compPath];

			const func = new Function("require", "module", "exports", code);

			const moduleRequire = reqPath => {
				const origin = path.dirname(path.resolve("./theme", compPath));
				const absPath = "." + path.resolve(origin, reqPath);

				if(srcContextKeys.indexOf(absPath) > -1) {
					return srcContext(absPath);
				} else {
					return srcContext(absPath + ".js");
				}
			};
			const moduleExports = {
				default: {}
			};
			const moduleModule = {
				exports: moduleExports
			};

			func(moduleRequire, moduleModule, moduleExports);
			const ex = moduleModule.exports.default;

			const injectStyle = () => {
				console.log("inject");
				/*var content = __webpack_require__(1375);
				if(typeof content === 'string') content = [[module.i, content, '']];
				if(content.locals) module.exports = content.locals;
				// add the styles to the DOM
				var update = __webpack_require__(8)("3bf82bd2", content, false, {});
				// Hot Module Replacement
				if(false) {
				// When the styles change, update the <style> tags
				if(!content.locals) {
				module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5bfbb8de\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/sass-loader/lib/loader.js?indentedSyntax!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./root.vue", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5bfbb8de\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/sass-loader/lib/loader.js?indentedSyntax!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./root.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
				});
				}
				// When the module is disposed, remove the <style> tags
				module.hot.dispose(function() { update(); });
				}*/
			};
			const Component = normalizeComponent(
				ex.mExports,
				{
					render: ex.render,
					staticRenderFns: ex.staticRenderFns
				},
				false,
				injectStyle,
				ex.options.scopeId,
				null
			);

			console.log(Component);
			Vue.component(name, Component.exports);
		}

		require("../theme/table.sass");
	}
};

export default new Theme();