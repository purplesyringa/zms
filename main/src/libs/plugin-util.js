import Posts from "./posts";
import {zeroDB} from "../zero";
import {getPluginTableName} from "./theme";

export default plugin => {
	function definePost(f) {
		Posts.define(f);
	}

	const DB = new class DB {
		async query(query, args={}) {
			return await zeroDB.query(query, args);
		}

		table(tableName) {
			return getPluginTableName(plugin, tableName);
		}
	};

	return {definePost, DB};
};