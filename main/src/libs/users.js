import {zeroAuth, zeroFS} from "../route.js";

class Users {
	async getAdmins() {
		const content = JSON.parse(await zeroFS.readFile("content.json"));
		return [content.address];
	}
	async getModerators() {
		const content = JSON.parse(await zeroFS.readFile("content.json"));
		return content.includes["data/authors/content.json"].signers;
	}
	async getAuthors() {
		const content = JSON.parse(await zeroFS.readFile("data/authors/content.json"));
		const permissions = content.user_contents.permissions;
		return Object.keys(permissions).filter(id => permissions[id]);
	}
	async getBanned() {
		const content = JSON.parse(await zeroFS.readFile("data/users/content.json"));
		const permissions = content.user_contents.permissions;
		return Object.keys(permissions).filter(id => !permissions[id]);
	}


	async getRoleByAddress(address) {
		const content = JSON.parse(await zeroFS.readFile("content.json"));

		// Is he an admin?
		const admins = await this.getAdmins();
		if(admins.indexOf(address) > -1) {
			return "admin";
		}

		// Is he a moderator?
		const moderators = await this.getModerators();
		if(moderators.indexOf(address) > -1) {
			return "moderator";
		}

		// Is he an author?
		const authors = await this.getAuthors();
		if(authors.indexOf(address) > -1) {
			return "author";
		}

		// Is he banned?
		const banned = await this.getBanned();
		if(banned.indexOf(address) > -1) {
			return "banned";
		}

		return "user";
	}

	async hasRoleByAddress(address, role) {
		let arr = ["banned", "user", "author", "moderator", "admin"];

		let currentRole = this.getRoleByAddress(address);
		currentRole = arr.indexOf(currentRole);
		role = arr.indexOf(role);

		return currentRole >= role;
	}
};

export default new Users();