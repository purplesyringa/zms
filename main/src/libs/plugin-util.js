import Posts from "./posts";
import HotReload from "./hotreload";
import {zeroPage, zeroFS, zeroDB, zeroAuth} from "../zero";
import {getPluginTableName, getMapOrigin} from "./theme";

export default plugin => {
	function definePost(f) {
		Posts.define(f);
	}

	function formatDate(date) {
		return (new Date(date)).toLocaleString();
	}

	const DB = new class DB {
		async query(query, args={}) {
			return await zeroDB.query(query, args);
		}

		async insert(table, row) {
			const manifest = JSON.parse(await zeroFS.readFile(`plugins/${escape(plugin)}/__build/plugin.json`));
			if(!manifest.tables || !manifest.tables[table]) {
				throw new Error(`No '${table}' table defined in plugin.json`);
			}

			let mapOrigin = getMapOrigin(manifest.tables[table].role);
			if(mapOrigin.indexOf(".+") > -1) {
				const auth = await zeroAuth.requestAuth();
				mapOrigin = mapOrigin.replace(".+", auth.address);
			}

			if(!zeroPage.isSignable(mapOrigin.replace("data.json", "content.json"))) {
				throw new Error(`Not allowed to sign ${mapOrigin}`);
			}

			const autoIncrement = manifest.tables[table].autoincrement;
			const keyCol = manifest.tables[table].key_col;
			const pluginTableName = getPluginTableName(plugin, table);


			// Insert

			// Parse data file
			let data;
			try {
				data = JSON.parse(await zeroFS.readFile(mapOrigin));
			} catch(e) {
				data = {};
			}

			// Create table if it doesn't exist
			if(keyCol) {
				if(!data[pluginTableName]) {
					data[pluginTableName] = {};
				}
			} else {
				if(!data[pluginTableName]) {
					data[pluginTableName] = [];
				}
			}

			// Auto increment
			if(autoIncrement) {
				const source = `next__${getPluginTableName(plugin, table)}__${autoIncrement}`;
				if(!data[source]) {
					data[source] = 0;
				}

				row[autoIncrement] = data[source]++;
			}

			// Insert
			if(keyCol) {
				const key = row[keyCol];
				let newRow = Object.assign({}, row);
				delete newRow[keyCol];
				data[pluginTableName][key] = newRow;
			} else {
				data[pluginTableName].push(row);
			}

			// Write
			await zeroFS.writeFile(mapOrigin, JSON.stringify(data, null, 4));

			// Sign & publish
			const contentFile = mapOrigin.replace("data.json", "content.json");
			await zeroPage.sign(contentFile);
			zeroPage.cmd("sitePublish", [null, contentFile, false]);

			// Emit hotreload
			HotReload.emit(mapOrigin);

			return row;
		}

		async remove(table, f) {
			const manifest = JSON.parse(await zeroFS.readFile(`plugins/${escape(plugin)}/__build/plugin.json`));
			if(!manifest.tables || !manifest.tables[table]) {
				throw new Error(`No '${table}' table defined in plugin.json`);
			}

			let mapOrigin = getMapOrigin(manifest.tables[table].role);
			if(mapOrigin.indexOf(".+") > -1) {
				const auth = await zeroAuth.requestAuth();
				mapOrigin = mapOrigin.replace(".+", auth.address);
			}

			if(!zeroPage.isSignable(mapOrigin.replace("data.json", "content.json"))) {
				throw new Error(`Not allowed to sign ${mapOrigin}`);
			}

			const keyCol = manifest.tables[table].key_col;
			const pluginTableName = getPluginTableName(plugin, table);


			// Remove

			// Parse data file
			let data;
			try {
				data = JSON.parse(await zeroFS.readFile(mapOrigin));
			} catch(e) {
				data = {};
			}

			// If the table doesn't exist, return
			if(!data[pluginTableName]) {
				return;
			}

			// Remove
			if(keyCol) {
				for(const key of Object.keys(data[pluginTableName])) {
					const row = Object.assign({
						[keyCol]: key
					}, data[pluginTableName][key]);
					if(f(row)) {
						delete data[pluginTableName][key];
					}
				}
			} else {
				data[pluginTableName] = data[pluginTableName].filter(row => {
					return !f(row);
				})
			}

			// Write
			await zeroFS.writeFile(mapOrigin, JSON.stringify(data, null, 4));

			// Sign & publish
			const contentFile = mapOrigin.replace("data.json", "content.json");
			await zeroPage.sign(contentFile);
			zeroPage.cmd("sitePublish", [null, contentFile, false]);

			// Emit hotreload
			HotReload.emit(mapOrigin);
		}

		table(tableName) {
			return getPluginTableName(plugin, tableName);
		}

		async getJsonId(role) {
			let path = getMapOrigin(role);
			if(path.indexOf(".+") > -1) {
				const auth = await zeroAuth.requestAuth();
				path = path.replace(".+", auth.address);
			}
			return zeroDB.getJsonID(path, 2);
		}
	};

	const User = new class User {
		getAddress(directory) {
			return directory.replace(/^data\/(users|authors)\//, "");
		}
		getUserName(certUserId) {
			return certUserId ? certUserId.replace(/@.*/, "") : "unknown";
		}
		getUserUrl(address) {
			return "users/" + Posts.shortenAddress(address);
		}
	};

	return {definePost, formatDate, DB, User};
};