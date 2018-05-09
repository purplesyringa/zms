import {zeroAuth, zeroDB} from "../route.js";
import Users from "./users.js";

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

		return Promise.all(rows.map(async row => {
			row.address = row.directory.replace("authors/", "");

			let id = this.shortenAddress(row.address) + "-" + row.id;
			row.url = `posts/${id}`;
			row.editUrl = `admin/posts/edit-post/${id}`;

			row.user = row.cert_user_id ? row.cert_user_id.replace(/@.*/, "") : "unknown";
			row.userUrl = "users/" + this.shortenAddress(row.address);

			row.editable = await this.isEditable(row);

			return row;
		}));
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

	async remove(oldPost) {
		const auth = await zeroAuth.requestAuth();

		if("authors/" + auth.address === oldPost.directory) {
			// Self's post
			await this.checkRule("author");
		} else {
			// Some other's post
			await this.checkRule("moderator");
		}


		await zeroDB.removeRow(
			`data/${oldPost.directory}/data.json`,
			`data/${oldPost.directory}/content.json`,
			"posts",
			post => post.id === oldPost.id
		);
	}


	async publish(title, content, cut) {
		const auth = await zeroAuth.requestAuth();

		await this.checkRule("author");

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
	async update(id, newPost) {
		let postId = parseInt(id.split("-")[1]);

		const auth = await zeroAuth.requestAuth();

		if("authors/" + auth.address === newPost.directory) {
			// Self's post
			await this.checkRule("author");
		} else {
			// Some other's post
			await this.checkRule("moderator");
		}

		await zeroDB.changeRow(
			`data/${newPost.directory}/data.json`,
			`data/${newPost.directory}/content.json`,
			"posts",
			post => post.id === postId ? newPost : post
		);
		return `posts/${id}`;
	}

	shortenAddress(address) {
		return address.toLowerCase().substr(0, 10);
	}

	async isEditable(post) {
		const auth = zeroAuth.getAuth();
		if(!auth) {
			return false;
		}

		let role = await Users.getRoleByAddress(auth.address);
		if(role === "admin" || role === "moderator") {
			// Admin and moderator can edit any post
			return true;
		}

		if(role === "author" && post.address === auth.address) {
			// Author can edit his own posts
			return true;
		}

		return false;
	}

	async checkRule(rule) {
		// If current user is an admin but doesn't have
		// the required rule, give him moderator rule.
		const auth = zeroAuth.getAuth();
		if(!auth) {
			return null; // unknown
		}

		if(await Users.hasRoleByAddress(auth.address, rule)) {
			return true; // already has
		}

		await Users.setRoleByAddress(auth.address, "moderator");
		return false; // just granted
	}
};

export default new Posts();