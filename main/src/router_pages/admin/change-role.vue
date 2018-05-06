<template>
	<div class="change-role">
		<div class="header">Change role</div>

		<table>
			<tr>
				<th class="column-use"></th>
				<th class="column-role">Role</th>
				<th class="column-description">Description</th>
			</tr>
			<tr v-for="role in roles" @click="use(role.role)">
				<td class="column-use">
					<icon v-if="currentRole === role.role" name="check" />
				</td>
				<td class="column-role">
					{{role.name}}
					<i v-if="role.default">(default)</i>
				</td>
				<td class="column-description">
					{{role.description}}
				</td>
			</tr>
		</table>
	</div>
</template>

<style lang="sass" scoped>
	.change-role
		padding: 16px
	.header
		font-family: Verdana, Arial, sans-serif
		font-size: 32px
		color: #222


	table
		width: 100%
		margin-top: 16px

		border-spacing: 0
		border-collapse: collapse

	tr
		border: 1px solid #DDD
		background-color: #EEE
		color: #666
	tr:hover
		background-color: lighten(#EEE, 5%)
		color: #000
		cursor: pointer

	tr:first-child
		background-color: #DDD
	tr:first-child:hover
		background-color: lighten(#DDD, 3%)
		cursor: default

	th, td
		padding: 8px

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		text-align: left
		font-weight: normal

	th
		color: #000


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
	import Users from "../../libs/users.js";

	export default {
		name: "admin-change-role",
		data() {
			return {
				roles: [
					{
						role: "admin",
						name: "Admin",
						description: "Changes user roles, site settings. Can do anything moderator can do."
					},
					{
						role: "moderator",
						name: "Moderator",
						description: "Edits other authors' content. If comments are enabled, can also edit them. Can do anything author can do."
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
				]
			};
		},

		computed: {
			id() {
				return this.$router.currentParams.arg;
			}
		},

		asyncComputed: {
			async user() {
				return (await Users.addressToCertUserId(this.id)).replace(/@.*/, "");
			},
			async currentRole() {
				return await Users.getRoleByAddress(this.id);
			}
		},

		methods: {
			async use(role) {
				await Users.setRoleByAddress(this.id, role);
				this.currentRole = role;
			}
		}
	};
</script>