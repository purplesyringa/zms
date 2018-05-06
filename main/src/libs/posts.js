import {zeroAuth, zeroDB} from "../route.js";

class Posts {
	async getCount(where="") {
		return (await zeroDB.query(`
			SELECT
				posts.*,
				json.directory AS directory,
				json.cert_user_id AS cert_user_id

			FROM posts
			LEFT JOIN json ON (json.json_id = posts.json_id)

			${where}
		`)).length;
	}

	async getList(where="", offset=0, limit=10000000) {
		let rows = await zeroDB.query(`
			SELECT
				posts.*,
				json.directory AS directory,
				json.cert_user_id AS cert_user_id

			FROM posts
			LEFT JOIN json ON (json.json_id = posts.json_id)

			${where}

			ORDER BY posts.date DESC

			LIMIT ${offset}, ${limit}
		`);

		return rows.map(row => {
			row.address = row.directory.replace("authors/", "");

			let id = this.shortenAddress(row.address) + "-" + row.id;
			row.url = `posts/${id}`;
			row.editUrl = `admin/posts/edit/${id}`;

			row.user = row.cert_user_id.replace(/@.*/, "");
			row.userUrl = "users/" + this.shortenAddress(row.address);

			return row;
		});
	}

	async get(id) {
		let [prefix, postId] = id.split("-");

		// I know this is unsecure, but it doesn't influence anything,
		// so let's leave it as-is.
		let posts = await this.getList(`
			WHERE id = ${postId} AND json.directory LIKE "authors/${prefix}%"
		`);

		return posts[0] || null;
	}


	async publish(title, content, cut) {
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