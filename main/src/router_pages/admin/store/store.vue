<template>
	<div class="store">
		<h1>Store</h1>

		<div class="text">
			<a href="/1StoREUtoyQjPCH7BXVqFC4LDLsEJt6gE">Go browse ZMS Store</a> (you'll have to download another site) or install a <a @click="$router.navigate('admin/store/themes')">theme</a>.
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "../global.sass"

	.store
		padding: 16px
	.text
		margin-top: 16px
		font-family: Verdana, Arial, sans-serif
		font-size: 16px
</style>

<script type="text/javascript">
	import {zeroAuth} from "../../../route.js";
	import Users from "../../../libs/users.js";
	import "vue-awesome/icons/edit";
	import "vue-awesome/icons/caret-square-right";

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