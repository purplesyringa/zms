<template>
	<div class="users">
		<h1>Users</h1>

		<table>
			<tr>
				<th class="column-name">User name</th>
				<th class="column-id">ID</th>
				<th class="column-role">Role</th>
			</tr>
			<tr v-for="user in users">
				<td class="column-name">
					{{user.user}}
				</td>
				<td class="column-id">
					{{user.id}}
				</td>
				<td class="column-role">
					<template v-if="roles.find(role => role.role === user.role).static">
						{{roles.find(role => role.role === user.role).name}}
					</template>
					<select v-else>
						<option v-for="role in roles" @click="!role.static && use(user, role.role)" :disabled="role.static" :selected="role.role === user.role">
							{{role.name}}
							<template v-if="role.default">(default)</template>
							<template v-if="role.static">
								<template v-if="role.autoGranted">(auto-granted)</template>
								<template v-else>(granted by admin)</template>
							</template>
						</option>
					</select>
				</td>
			</tr>
			<tr v-if="siteInfo.settings.own || isModerator">
				<td class="column-name">
					<i>New user</i>
				</td>
				<td class="column-id no-padding">
					<input type="text" placeholder="Fill in user ID" :class="{'input-error': newId === 'Please, fill in user ID'}" required v-model="newId">
				</td>
				<td class="column-role">
					<div class="icons">
						<span class="icon" @click="next">
							<icon name="caret-square-right" />
							Next
						</span>
					</div>
				</td>
			</tr>
		</table>

		<div class="desc">
			Role description:

			<div v-for="role in roles">
				<b>
					{{role.name}}
					<i v-if="role.default">(default)</i>
					<i v-if="role.static">
						<template v-if="role.autoGranted">(auto-granted)</template>
						<template v-else>(granted by admin)</template>
					</i>
				</b>
				&mdash;
				{{role.description}}
			</div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "../global.sass"

	.users
		padding: 16px


	.column-user
		width: 25%
	.column-id
		width: 50%
	.column-role
		width: 25%

	.input-error
		color: #803


	.icons
		float: right
	.icon
		cursor: pointer
		margin-left: 8px
		color: lighten(#803, 10%)


	.desc
		margin-top: 32px
		margin-bottom: -8px

		font-size: 16px
</style>

<script type="text/javascript">
	import {zeroAuth} from "../../../zero";
	import Users from "../../../libs/users.js";
	import roles from "./roles";

	export default {
		name: "admin-users",

		data() {
			return {
				newId: "",
				siteInfo: {
					settings: {
						own: false
					}
				}
			};
		},

		mounted() {
			this.$eventBus.$on("setSiteInfo", this.setSiteInfo);
			this.$eventBus.$emit("needSiteInfo");
		},
		destroyed() {
			this.$eventBus.$off("setSiteInfo", this.setSiteInfo);
		},

		computed: {
			roles() {
				return roles(this.siteInfo);
			}
		},

		asyncComputed: {
			async users() {
				return await Users.getAllRules();
			},

			async isModerator() {
				const auth = zeroAuth.getAuth();
				if(!auth) {
					return false;
				}

				return await Users.hasRoleByAddress(auth.address, "moderator");
			}
		},

		methods: {
			setSiteInfo(siteInfo) {
				this.siteInfo = siteInfo;
			},

			async next() {
				if(!this.newId || this.newId === "Please, fill in user ID") {
					this.newId = "Please, fill in user ID";
					return;
				}

				let user = {id: this.newId, role: "user"};
				user.certUserId = await Users.addressToCertUserId(user.id);
				user.user = user.certUserId.replace(/@.*/, "");
				user.roleId = ["admin", "moderator", "author", "user", "banned"].indexOf(user.role);
				this.users.push(user);

				this.newId = "";
			},

			async use(user, role) {
				await Users.setRoleByAddress(user.id, role);
				user.role = role;
			}
		}
	};
</script>