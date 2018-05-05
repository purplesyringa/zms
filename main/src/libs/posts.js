import {zeroDB} from "../route.js";

class Posts {
	async getList() {
		return zeroDB.query(`
			SELECT * FROM posts
		`);
	}
};

export default new Posts();