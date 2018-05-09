<template>
	<div class="sidebar">
		<!-- Back to content -->
		<div
			class="heading"
			@click="$router.navigate()"
		>
			<icon name="caret-square-left" />
			Back to content
		</div>

		<!-- headings -->
		<component v-for="heading in headings" v-if="heading.when ? heading.when() : true" :key="heading.name">
			<div
				:class="{heading: true, 'heading-opened': looksLike(current, heading.name)}"
				@click="open(heading)"
			>
				<icon :name="heading.icon" />
				{{heading.name}}
			</div>

			<!-- subitems -->
			<component v-if="looksLike(current, heading.name)">
				<div
					v-for="subitem in heading.sub"
					v-if="subitem.when ? subitem.when() : true"

					:class="{'sub-heading': true, 'sub-heading-opened': looksLike(currentSubitem, subitem.name)}"
					@click="openSubitem(heading, subitem)"
				>
					{{subitem.name}}
				</div>
			</component>
		</component>
	</div>
</template>

<style lang="sass" scoped>
	@import "./variables.sass"

	.sidebar
		display: block
		width: 20%
		height: 100%
		float: left

		background-color: $sidebar-color

	// Main heading
	.heading, .sub-heading
		display: block
		padding: 8px 16px

		font-family: Verdana, Arial, sans-serif
		fotn-size: 16px
		color: #FFF
	.heading:hover
		background-color: rgba(255, 255, 255, 0.1)
		cursor: pointer

	.heading-opened
		background-color: $main-color
	.heading-opened:hover
		background-color: lighten($main-color, 10%)


	// Subheading
	.sub-heading
		background-color: rgba(0, 0, 0, 0.8)
	.sub-heading:hover
		background-color: rgba(0, 0, 0, 0.2)
		cursor: pointer

	.sub-heading-opened
		background-color: $sub-color
	.sub-heading-opened:hover
		background-color: lighten($sub-color, 10%)


	.fa-icon
		margin-right: 8px
		margin-bottom: -2px
		color: rgba(255, 255, 255, 0.8)
</style>

<script type="text/javascript">
	import {zeroAuth} from "../../route.js";
	import Users from "../../libs/users.js";
	import "vue-awesome/icons/caret-square-left";
	import "vue-awesome/icons/pencil-alt";
	import "vue-awesome/icons/users";
	import "vue-awesome/icons/cog";

	export default {
		name: "admin-sidebar",
		data() {
			return {
				headings: [
					{
						name: "Posts",
						icon: "pencil-alt",
						sub: [
							{
								name: "New post",
								when: () => this.isAuthor || this.siteInfo.settings.own
							}
						]
					},
					{
						name: "Users",
						icon: "users",
						sub: []
					},
					{
						name: "Settings",
						icon: "cog",
						when: () => this.siteInfo.settings.own,
						sub: [
							{
								name: "Theme settings"
							}
						]
					},
				],
				current: "",
				currentSubitem: "",
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

			this.$eventBus.$on("navigate", this.navigated);
			this.navigated();
		},
		destroyed() {
			this.$eventBus.$off("setSiteInfo", this.setSiteInfo);
			this.$eventBus.$off("navigate", this.navigated);
		},

		methods: {
			setSiteInfo(siteInfo) {
				this.siteInfo = siteInfo;
			},

			open(heading) {
				this.$router.navigate("admin/" + heading.name.toLowerCase());
			},
			openSubitem(heading, subitem) {
				this.$router.navigate("admin/" + this.toUrl(heading.name) + "/" + this.toUrl(subitem.name));
			},

			toUrl(text) {
				return text.toLowerCase().replace(/\s/, "-");
			},
			looksLike(a, b) {
				return this.toUrl(a) === this.toUrl(b);
			},

			navigated() {
				this.current = this.$router.currentParams.page || "dashboard";
				this.currentSubitem = this.$router.currentParams.subpage || "";
			}
		},

		asyncComputed: {
			async isAuthor() {
				const auth = zeroAuth.getAuth();
				if(!auth) {
					return false;
				}

				return await Users.hasRoleByAddress(auth.address, "author");
			}
		}
	};
</script>