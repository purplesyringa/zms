import Posts from "./posts";
import {zeroDB} from "../zero";

export function definePost(f) {
	Posts.define(f);
}

export const DB = new class DB {
	async query(query, args={}) {
		return await zeroDB.query(query, args);
	}
};