import Posts from "./posts";
import {zeroDB} from "../zero";

export default plugin => {
	function definePost(f) {
		Posts.define(f);
	}

	const DB = new class DB {
		async query(query, args={}) {
			return await zeroDB.query(query, args);
		}
	};

	return {definePost, DB};
};