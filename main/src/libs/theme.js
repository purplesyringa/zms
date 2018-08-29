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


export function getPluginTableName(plugin, tableName) {
	const escapedPluginName = escape(plugin).replace(/_/g, "5f").replace(/%/g, "_");
	return `plugin__${escapedPluginName}__${tableName}`;
}

export function getMapOrigin(role) {
	if(role === "admin") {
		return "content.json";
	} else if(role === "moderator") {
		return "data/authors/content.json";
	} else if(role === "author") {
		return "data/authors/.+/data.json";
	} else if(role === "user") {
		return "data/users/.+/data.json";
	} else {
		throw new Error(`Unknown role: ${role}`);
	}
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




	async loadPlugins(buildCb=null) {
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
				}, buildCb);

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
		const pluginPrefix = getPluginTableName(plugin, "");

		let dbschema = JSON.parse(await zeroFS.readFile("dbschema.json"));

		// Remove all old tables
		for(const tableName of Object.keys(dbschema.tables)) {
			if(tableName.startsWith(pluginPrefix)) {
				delete dbschema.tables[tableName];
			}
		}
		// Remove all old mappings
		for(const mappingName of Object.keys(dbschema.maps)) {
			let mapping = dbschema.maps[mappingName];

			if(mapping.to_table) {
				mapping.to_table = mapping.to_table.filter(table => {
					if(typeof table === "string") {
						return !table.startsWith(pluginPrefix);
					} else {
						return !table.table.startsWith(pluginPrefix);
					}
				});
			}
		}

		// Remove old hot-reloads
		let hotreloads = Object.assign({
			post: [],
			layout: []
		}, dbschema.zms_hotreloads || {});
		for(const key of Object.keys(hotreloads)) {
			hotreloads[key] = hotreloads[key].filter(name => !name.startsWith(pluginPrefix));
		}

		// Add new tables (if they exist)
		for(const tableName of Object.keys(manifest.tables || {})) {
			const table = manifest.tables[tableName];
			const escapedTableName = getPluginTableName(plugin, tableName);

			dbschema.tables[escapedTableName] = Object.assign({}, table, {
				schema_changed: Date.now()
			});

			const mapOrigin = getMapOrigin(table.role);
			dbschema.maps[mapOrigin].to_table.push({
				table: escapedTableName,
				node: escapedTableName,
				key_col: table.key_col || undefined,
				val_col: table.val_col || undefined
			});

			if(table.hotreload) {
				let hotreload = table.hotreload;
				if(typeof hotreload === "string") {
					hotreload = [hotreload];
				}
				for(let type of hotreload) {
					if(!hotreloads[type]) {
						hotreloads[type] = [];
					}
					hotreloads[type].push(escapedTableName);
				}
			}
		}

		dbschema.zms_hotreloads = hotreloads;

		console.log("Updated dbschema.json");

		await zeroFS.writeFile("dbschema.json", JSON.stringify(dbschema, null, "\t"));
	}


	async loadTheme(buildCb=null) {
		if((await zeroPage.getSiteInfo()).settings.own) {
			await RequireEngine.rebuild("theme/", "theme.json", (...args) => {
				return Store.Themes.rebuildThemeFile(...args);
			}, async () => {
				let files = await Store.Themes.buildTheme(() => {});
				await Store.Themes.saveTheme(files, () => {});
			}, buildCb);
		}

		const context = await RequireEngine.loadContext("theme/");

		for(const name of Object.keys(COMPONENTS)) {
			Vue.component(name, context.require(`/src/theme/${COMPONENTS[name]}`));
		}

		context.require("/src/theme/global.sass");
	}
};


export default new Theme();