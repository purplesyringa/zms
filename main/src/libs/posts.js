import {zeroAuth, zeroDB} from "../route.js";

class Posts {
	async getList() {
		let rows = await zeroDB.query(`
			SELECT posts.*, json.directory AS directory

			FROM posts
			LEFT JOIN json ON (json.json_id = posts.json_id)
		`);

		return rows.map(row => {
			row.address = row.directory.replace("authors/", "");
			let id = this.shortenAddress(row.address) + "-" + row.id;
			row.url = `posts/${id}`;
			return row;
		});
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
				cut,
				date: Date.now()
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