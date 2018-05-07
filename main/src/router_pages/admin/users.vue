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
						<span class="icon" @click="$router.navigate(`admin/users/change-role/${user.id}`)" v-if="siteInfo.privatekey">
							<icon name="edit" />
							Change
						</span>
					</div>
				</td>
			</tr>
			<tr v-if="siteInfo.privatekey">
				<td class="column-name">
					<i>New user</i>
				</td>
				<td class="column-id column-input-id">
					<input type="text" placeholder="Fill in user ID" :class="{'input-id': true, 'input-error': newId === 'Please, fill in user ID'}" required v-model="newId">
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

	.column-input-id
		padding: 0
		height: 0
	.input-id
		width: 100%
		height: 100%
		border: none
		background: transparent
		padding: 8px
		font: inherit
	.input-id:invalid
		font-style: italic
	.input-error
		color: #803


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

		data() {
			return {
				newId: "",
				siteInfo: {
					privatekey: false
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

		asyncComputed: {
			async users() {
				return await Users.getAllRules();
			}
		},

		methods: {
			setSiteInfo(siteInfo) {
				this.siteInfo = siteInfo;
			},

			next() {
				if(!this.newId || this.newId === "Please, fill in user ID") {
					this.newId = "Please, fill in user ID";
					return;
				}

				this.$router.navigate(`admin/users/change-role/${this.newId}`);
			}
		}
	};
</script>