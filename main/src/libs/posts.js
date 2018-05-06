import {zeroAuth, zeroDB} from "../route.js";

class Posts {
	async getList() {
		return zeroDB.query(`
			SELECT * FROM posts
		`);
	}

	async publish(title, content, cut) {
		console.log(title, content, cut);
		const auth = await zeroAuth.requestAuth();

		let row = await zeroDB.insertRow(
			`data/authors/${auth.address}/data.json`,
			`data/authors/${auth.address}/content.json`,
			"posts",
			{
				title,
				content,
				cut
			},
			{
				column: "id",
				source: "next_post_id"
			}
		);

		let id = this.shortenAddress(auth.address) + "-" + row.id;
		return `posts/${id}`;
	}

	shortenAddress(address) {
		return address.toLowerCase().substr(0, 10);
	}
};

export default new Posts();