<template>
	<div class="change-role">
		<h1>
			Change role
			<icon name="chevron-right" />
			{{user}}
		</h1>

		<table>
			<tr>
				<th class="column-use"></th>
				<th class="column-role">Role</th>
				<th class="column-description">Description</th>
			</tr>
			<tr v-for="role in roles" @click="use(role.role)" :class="{'disabled': role.static && role.static()}">
				<td class="column-use">
					<icon v-if="currentRole === role.role" name="check" />
				</td>
				<td class="column-role">
					{{role.name}}
					<i v-if="role.default">(default)</i>
					<i v-if="role.static && role.static()">
						<template v-if="role.autoGranted">(auto-granted)</template>
						<template v-else>(granted by admin)</template>
					</i>
				</td>
				<td class="column-description">
					{{role.description}}
				</td>
			</tr>
		</table>
	</div>
</template>

<style lang="sass" scoped>
	@import "../global.sass"

	.change-role
		padding: 16px


	.column-use
		width: 0
	.column-role
		width: 25%
	.column-description
		width: 75%

	.icons
		float: right
	.icon
		cursor: pointer
		margin-left: 8px
		color: lighten(#803, 10%)
</style>

<script type="text/javascript">
	import {zeroAuth} from "../../../zero";
	import Users from "../../../libs/users.js";

	export default {
		name: "admin-change-role",
		data() {
			return {
				roles: [
					{
						role: "admin",
						name: "Admin",
						description: "Changes user roles, site settings. Can do anything moderator can do.",
						static: () => true,
						autoGranted: true
					},
					{
						role: "moderator",
						name: "Moderator",
						description: "Edits other authors' content. If comments are enabled, can also edit them. Can do anything author can do.",
						static: () => !this.siteInfo.settings.own
					},
					{
						role: "author",
						name: "Author",
						description: "Creates posts. Can do anything user can do."
					},
					{
						role: "user",
						name: "User",
						description: "Creates comments, votes, depending on plugins.",
						default: true
					},
					{
						role: "banned",
						name: "Banned",
						description: "Can only read blog, not post anything, even comments/votes."
					}
				],
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

		methods: {
			setSiteInfo(siteInfo) {
				this.siteInfo = siteInfo;
			},

			async use(role) {
				if(this.currentRoleObject.static) {
					// Cannot switch from static
					return;
				} else if(this.roles.find(role1 => role1.role === role).static) {
					// Cannot switch to static
					return;
				}

				await Users.setRoleByAddress(this.id, role);
				this.currentRole = role;
			}
		},

		computed: {
			id() {
				return this.$router.currentParams.arg;
			},
			currentRoleObject() {
				return this.roles.find(role => role.role === this.currentRole);
			}
		},

		asyncComputed: {
			async user() {
				return (await Users.addressToCertUserId(this.id)).replace(/@.*/, "");
			},
			async currentRole() {
				return await Users.getRoleByAddress(this.id);
			}
		}
	};
</script>