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
					{{user.role}}

					<div class="icons">
						<span class="icon" @click="$router.navigate(`admin/users/change-role/${user.id}`)" v-if="siteInfo.settings.own || (isModerator && ['author', 'user', 'banned'].indexOf(user.role) > -1)">
							<icon name="edit" />
							Change
						</span>
					</div>
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
</style>

<script type="text/javascript">
	import {zeroAuth} from "../../../route.js";
	import Users from "../../../libs/users.js";

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