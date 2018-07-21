import {zeroFS, zeroPage} from "../zero";
import Settings from "./settings.js";
import deepcopy from "deepcopy";
import Store from "./store";
import Customizable from "./customizable";
import * as RequireEngine from "./require-engine";
import limit from "limit-concurrency-decorator";

import Vue from "vue/dist/vue.min.js";


const COMPONENTS = {
	"theme-header": "header.vue",
	"theme-list": "list.vue",
	"theme-post": "post.vue",
	"theme-edit-post": "edit-post.vue",
	"theme-footer": "footer.vue",
	"named-input": "components/named-input.vue",
	"named-textarea": "components/named-textarea.vue",
	"theme-button": "components/button.vue"
};


function getPluginTableName(plugin, tableName) {
	const escapedPluginName = escape(plugin).replace(/_/g, "5f").replace(/%/g, "_");
	return `plugin__${escapedPluginName}__${tableName}`;
}


class Theme {
	async getSetting(name) {
		let res = await Settings.get("theme." + name, undefined);
		if(res !== undefined) {
			return res;
		}

		const themeJson = await this.getManifest();
		let setting = themeJson.settings.find(setting => setting.name === name);
		return setting.default;
	}

	async getAllSettings() {
		const manifest = deepcopy((await this.getManifest()).settings);
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


	async getManifest() {
		return RequireEngine.getManifest("theme/", "theme.json");
	}




	async loadPlugins() {
		const plugins = (await zeroFS.readDirectory("plugins", false)).map(fileName => unescape(fileName));

		// We update plugins synchronously, and we need context, so it
		// doesn't make sense to load context twice - hence the if
		if((await zeroPage.getSiteInfo()).settings.own) {
			let dbschemaChanged = false;
			for(const plugin of plugins) {
				// Rebuild
				await RequireEngine.rebuild(`plugins/${escape(plugin)}/`, "plugin.json", async fileName => {
					if(fileName === "plugin.json") {
						await this.rebuildPluginJson(plugin);
						dbschemaChanged = true;
					}

					return await Store.Plugins.rebuildPluginFile(plugin, fileName);
				}, async () => {
					await this.rebuildPluginJson(plugin);
					dbschemaChanged = true;

					let files = await Store.Plugins.buildPlugin(plugin, () => {});
					await Store.Plugins.savePlugin(plugin, files, () => {});
				});

				const context = await RequireEngine.loadContext(`plugins/${escape(plugin)}/`);
				registerContext(plugin, context);
			}

			if(dbschemaChanged) {
				await zeroPage.publish("content.json");
			}
		} else {
			await Promise.all(
				plugins.map(async plugin => {
					const context = await RequireEngine.loadContext(`plugins/${escape(plugin)}/`);
					registerContext(plugin, context);
				})
			);
		}

		function registerContext(plugin, context) {
			const widgets = context.readDirectory(`./src/plugins/${escape(plugin)}/widgets`);
			for(const fileName of Object.keys(widgets)) {
				Customizable.registerWidget(plugin, widgets[fileName], fileName);
			}

			const pluginPath = `./src/plugins/${escape(plugin)}/plugin.js`;
			if(context.has(pluginPath)) {
				context.require(pluginPath);
			}
		}
	}

	@limit(1)
	async rebuildPluginJson(plugin) {
		const manifest = JSON.parse(await zeroFS.readFile(`plugins/${escape(plugin)}/plugin.json`));

		let dbschema = JSON.parse(await zeroFS.readFile("dbschema.json"));

		// Remove all old tables
		for(const tableName of Object.keys(dbschema.tables)) {
			if(tableName.startsWith(getPluginTableName(plugin, ""))) {
				delete dbschema.tables[tableName];
			}
		}
		// Remove all old mappings
		for(const mappingName of Object.keys(dbschema.maps)) {
			let mapping = dbschema.maps[mappingName];

			if(mapping.to_table) {
				mapping.to_table = mapping.to_table.filter(table => {
					return !(
						typeof table === "string" &&
						table.startsWith(getPluginTableName(plugin, ""))
					);
				});
			}
		}

		// Add new tables (if they exist)
		for(const tableName of Object.keys(manifest.tables || {})) {
			const escapedTableName = getPluginTableName(plugin, tableName);
			dbschema.tables[escapedTableName] = Object.assign({}, manifest.tables[tableName], {
				schema_changed: Date.now()
			});
		}

		// Add new mappings (if they exist)
		for(const mappingName of Object.keys(manifest.maps || {})) {
			const mapping = manifest.maps[mappingName];

			if(!dbschema.maps[mappingName]) {
				dbschema.maps[mappingName] = {};
			}
			let dbschemaMapping = dbschema.maps[mappingName];
			if(!dbschemaMapping.to_table) {
				dbschemaMapping.to_table = [];
			}


			for(const tableName of mapping) {
				const escapedTableName = getPluginTableName(plugin, tableName);
				dbschemaMapping.to_table.push(escapedTableName);
			}
		}

		console.log("Updated dbschema.json");

		await zeroFS.writeFile("dbschema.json", JSON.stringify(dbschema, null, "\t"));
	}


	async loadTheme() {
		if((await zeroPage.getSiteInfo()).settings.own) {
			await RequireEngine.rebuild("theme/", "theme.json", (...args) => {
				return Store.Themes.rebuildThemeFile(...args);
			}, async () => {
				let files = await Store.Themes.buildTheme(() => {});
				await Store.Themes.saveTheme(files, () => {});
			});
		}

		const context = await RequireEngine.loadContext("theme/");

		for(const name of Object.keys(COMPONENTS)) {
			Vue.component(name, context.require(`/src/theme/${COMPONENTS[name]}`));
		}

		context.require("/src/theme/global.sass");
	}
};


export default new Theme();