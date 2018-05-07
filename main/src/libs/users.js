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

		let all = {};
		banned.forEach(id => all[id] = "banned");
		authors.forEach(id => all[id] = "author");
		moderators.forEach(id => all[id] = "moderator");
		admins.forEach(id => all[id] = "admin");

		let allArr = [];
		for await(let id of Object.keys(all)) {
			let user = {id, role: all[id]};
			user.certUserId = await this.addressToCertUserId(user.id);
			user.user = user.certUserId.replace(/@.*/, "");
			user.roleId = ["admin", "moderator", "author", "user", "banned"].indexOf(user.role);
			allArr.push(user);
		}

		allArr.sort((a, b) => a.roleId - b.roleId);

		return allArr;
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

	async setRoleByAddress(address, newRole) {
		let oldRole = await this.getRoleByAddress(address);
		if(oldRole === newRole) {
			// Nothing to change
			return;
		}

		const ROLES = ["admin", "moderator", "author", "user"];

		// First, clean out old roles
		if(oldRole === "banned") {
			await this._removeRoleByAddress(address, "banned");
		} else {
			for(let role of ROLES.slice(ROLES.indexOf(oldRole))) {
				await this._removeRoleByAddress(address, role);
			}
		}

		// Now, add new roles
		if(newRole === "banned") {
			await this._addRoleByAddress(address, "banned");
		} else {
			for(let role of ROLES.slice(ROLES.indexOf(newRole))) {
				await this._addRoleByAddress(address, role);
			}
		}
	}
	async _removeRoleByAddress(address, role) {
		if(role === "admin") {
			// Seriously?
			return;
		} else if(role === "moderator") {
			// Remove from data/authors/content.json and data/users/content.json signers
			let content = JSON.parse(await zeroFS.readFile("content.json"));

			let signers = content.includes["data/authors/content.json"].signers;
			signers.splice(signers.indexOf(address), 1);

			signers = content.includes["data/users/content.json"].signers;
			signers.splice(signers.indexOf(address), 1);

			await zeroFS.writeFile("content.json", JSON.stringify(content, null, 1));
		} else if(role === "author") {
			// Remove from data/authors/content.json
			let content = JSON.parse(await zeroFS.readFile("data/authors/content.json"));
			delete content.user_contents.permissions[address];
			await zeroFS.writeFile("data/authors/content.json", JSON.stringify(content, null, 1));
		} else if(role === "user") {
			// Hm?..
			return;
		} else if(role === "banned") {
			// That standard bad@zeroid.bit
			const content = JSON.parse(await zeroFS.readFile("data/users/content.json"));
			delete content.user_contents.permissions[address];
			await zeroFS.writeFile("data/users/content.json", JSON.stringify(content, null, 1));
		}
	}
	async _addRoleByAddress(address, role) {
		if(role === "admin") {
			// Oh, you are so brave <3
			return;
		} else if(role === "moderator") {
			// Add to data/authors/content.json and data/users/content.json signers
			let content = JSON.parse(await zeroFS.readFile("content.json"));

			let signers = content.includes["data/authors/content.json"].signers;
			signers.push(address);

			signers = content.includes["data/users/content.json"].signers;
			signers.push(address);

			await zeroFS.writeFile("content.json", JSON.stringify(content, null, 1));
		} else if(role === "author") {
			// Add to data/authors/content.json
			let content = JSON.parse(await zeroFS.readFile("data/authors/content.json"));
			content.user_contents.permissions[address] = {
				files_allowed: "data.json",
				max_size: 1000000000
			};
			await zeroFS.writeFile("data/authors/content.json", JSON.stringify(content, null, 1));
		} else if(role === "user") {
			// Hm?..
			return;
		} else if(role === "banned") {
			// That standard bad@zeroid.bit
			const content = JSON.parse(await zeroFS.readFile("data/users/content.json"));
			content.user_contents.permissions[address] = false;
			await zeroFS.writeFile("data/users/content.json", JSON.stringify(content, null, 1));
		}
	}


	async hasRoleByAddress(address, role) {
		let arr = ["banned", "user", "author", "moderator", "admin"];

		let currentRole = await this.getRoleByAddress(address);
		currentRole = arr.indexOf(currentRole);
		role = arr.indexOf(role);

		return currentRole >= role;
	}


	async addressToCertUserId(address) {
		// Maybe admin?
		const siteInfo = await zeroPage.getSiteInfo();
		if(siteInfo.address === address) {
			return "zms-admin@zms";
		}


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
		if(siteInfo.settings.permissions.indexOf(permission) === -1) {
			await zeroPage.cmd("wrapperPermissionAdd", [permission]);
		}

		try {
			let zid = await zeroID.findUserById(address);
			return zid.name + "@zeroid.bit";
		} catch(e) {}

		// Unknown
		return address.substr(0, 20) + "...";
	}
};

export default new Users();