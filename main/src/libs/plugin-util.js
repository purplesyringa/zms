import Posts from "./posts";
import {zeroPage, zeroFS, zeroDB, zeroAuth} from "../zero";
import {getPluginTableName, getMapOrigin} from "./theme";

export default plugin => {
	function definePost(f) {
		Posts.define(f);
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

			return await zeroDB.insertRow(
				mapOrigin,
				mapOrigin.replace("data.json", "content.json"),
				getPluginTableName(plugin, table),
				row,
				autoIncrement ? {
					column: autoIncrement,
					source: `next__${getPluginTableName(plugin, table)}__${autoIncrement}`
				} : null
			);
		}

		table(tableName) {
			return getPluginTableName(plugin, tableName);
		}
	};

	return {definePost, DB};
};