import {zeroPage, zeroAuth, zeroFS, zeroDB, zeroID} from "../route.js";

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

	async getAllRules() {
		const admins = await this.getAdmins();
		const moderators = await this.getModerators();
		const authors = await this.getAuthors();
		const banned = await this.getBanned();

		let all = [];
		admins.forEach(id => all.push({id, role: "admin"}));
		moderators.forEach(id => all.push({id, role: "moderator"}));
		authors.forEach(id => all.push({id, role: "author"}));
		banned.forEach(id => all.push({id, role: "banned"}));

		for await(let user of all) {
			user.certUserId = await this.addressToCertUserId(user.id);
			user.user = user.certUserId.replace(/@.*/, "");
		}
		return all;
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


	async addressToCertUserId(address) {
		// First, check json table
		let res = await zeroDB.query(`
			SELECT * FROM json WHERE directory LIKE "%/${address}"
		`);
		if(res.length) {
			return res[0].cert_user_id;
		}

		// Try ZeroID

		// Ask ZeroID CORS permission
		let permission = "Cors:1iD5ZQJMNXu43w1qLB8sfdHVKppVMduGz";
		let siteInfo = await zeroPage.getSiteInfo();
		if(siteInfo.settings.permissions.indexOf(permission) === -1) {
			await zeroPage.cmd("wrapperPermissionAdd", [permission]);
		}

		try {
			let zid = await zeroID.findUserById(address);
			return zid.name + "@zeroid.bit";
		} catch(e) {}

		// Unknown
		return address;
	}
};

export default new Users();