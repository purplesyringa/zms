import {zeroAuth, zeroDB, zeroFS} from "../zero";
import Users from "./users.js";
import HotReload from "./hotreload";
import limit from "limit-concurrency-decorator";

class Posts {
	constructor() {
		this.defined = [];
		this.dbschema = null;
	}

	@limit(1)
	async getDbschema() {
		if(this.dbschema) {
			return this.dbschema;
		}

		this.dbschema = JSON.parse(await zeroFS.readFile("dbschema.json"));
		return this.dbschema;
	}


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
		const getRows = async () => {
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

			return await Promise.all(rows.map(async row => {
				row.address = row.directory.replace("data/authors/", "");

				let id = this.shortenAddress(row.address) + "-" + row.id;
				row.url = `posts/${id}`;
				row.editUrl = `admin/posts/edit-post/${id}`;

				row.user = row.cert_user_id ? row.cert_user_id.replace(/@.*/, "") : "unknown";
				row.userUrl = "users/" + this.shortenAddress(row.address);

				row.editable = await this.isEditable(row);

				await Promise.all(this.defined.map(async f => {
					Object.assign(row, await f(row));
				}));

				return row;
			}));
		}

		let rows = await getRows();

		const dbschema = await this.getDbschema();
		const hotreloads = dbschema.zms_hotreloads;
		for(const tableName of ["posts"].concat(hotreloads.post)) {
			HotReload.register(tableName, async () => {
				HotReload.patchArray(rows, await getRows(), "url");
			});
		}

		return rows;
	}

	async get(id) {
		let [prefix, postId] = id.split("-");

		// I know this is unsecure, but it doesn't influence anything,
		// so let's leave it as-is.
		let posts = await this.getList(`
			WHERE id = ${postId} AND json.directory LIKE "data/authors/${prefix}%"
		`);

		return posts[0] || null;
	}

	async remove(oldPost) {
		const auth = await zeroAuth.requestAuth();

		if("data/authors/" + auth.address === oldPost.directory) {
			// Self's post
			await this.checkRule("author");
		} else {
			// Some other's post
			await this.checkRule("moderator");
		}


		await zeroDB.removeRow(
			`${oldPost.directory}/data.json`,
			`${oldPost.directory}/content.json`,
			"posts",
			post => post.id === oldPost.id
		);
	}


	async publish(title, content) {
		const auth = await zeroAuth.requestAuth();

		await this.checkRule("author");

		let row = await zeroDB.insertRow(
			`data/authors/${auth.address}/data.json`,
			`data/authors/${auth.address}/content.json`,
			"posts",
			{
				title,
				content,
				cut: this._getCut(content),
				date: Date.now()
			},
			{
				column: "id",
				source: "next_post_id"
			}
		);

		HotReload.emit(`data/authors/${auth.address}/data.json`);

		let id = this.shortenAddress(auth.address) + "-" + row.id;
		return `posts/${id}`;
	}
	async update(id, newPost) {
		newPost.cut = this._getCut(newPost.content);


		let postId = parseInt(id.split("-")[1]);

		const auth = await zeroAuth.requestAuth();

		if("data/authors/" + auth.address === newPost.directory) {
			// Self's post
			await this.checkRule("author");
		} else {
			// Some other's post
			await this.checkRule("moderator");
		}

		await zeroDB.changeRow(
			`${newPost.directory}/data.json`,
			`${newPost.directory}/content.json`,
			"posts",
			post => post.id === postId ? newPost : post
		);
		HotReload.emit(`${newPost.directory}/data.json`);
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


	_getCut(content) {
		let div = document.createElement("div");
		div.innerHTML = content;

		let cut = div.querySelector("zms-cut");
		if(!cut) {
			return content;
		}

		while(cut !== div) {
			if(cut.nextSibling) {
				cut.parentNode.removeChild(cut.nextSibling);
			} else {
				cut = cut.parentNode;
			}
		}

		return div.innerHTML;
	}


	define(f) {
		this.defined.push(f);
	}
};

export default new Posts();