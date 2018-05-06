<template>
	<div class="users">
		<div class="header">Users</div>

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
					{{user.role}}

					<div class="icons">
						<span class="icon" @click="$router.navigate(`admin/users/change-role/${user.id}`)">
							<icon name="edit" />
							Change
						</span>
					</div>
				</td>
			</tr>
		</table>
	</div>
</template>

<style lang="sass" scoped>
	.users
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

	tr:first-child
		background-color: #DDD
	tr:first-child:hover
		background-color: lighten(#DDD, 3%)

	th, td
		padding: 8px

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		text-align: left
		font-weight: normal

	th
		color: #000


	.column-user
		width: 25%
	.column-id
		width: 50%
	.column-role
		width: 25%

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
		name: "admin-users",

		asyncComputed: {
			async users() {
				return await Users.getAllRules();
			}
		}
	};
</script>