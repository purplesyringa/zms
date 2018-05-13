<template>
	<div class="root">
		<admin-sidebar />

		<div class="tab">
			<component :is="currentTab"></component>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	.root
		height: 100%

	.tab
		display: block
		float: left
		width: 80%
		height: 100%
		overflow: auto
</style>

<script type="text/javascript">
	import AdminSidebar from "./sidebar.vue";

	import AdminPosts from "./posts/posts.vue";
	import AdminNewPost from "./posts/new-post.vue";
	import AdminEditPost from "./posts/edit-post.vue";
	import AdminUsers from "./users/users.vue";
	import AdminChangeRole from "./users/change-role.vue";
	import AdminSettings from "./settings/settings.vue";
	import AdminThemeSettings from "./settings/theme-settings.vue";
	import AdminStore from "./store/store.vue";
	const views = {
		posts: AdminPosts,
		"new-post": AdminNewPost,
		"edit-post": AdminEditPost,
		users: AdminUsers,
		"change-role": AdminChangeRole,
		settings: AdminSettings,
		"theme-settings": AdminThemeSettings,
		store: AdminStore
	};

	export default {
		name: "admin-root",
		data() {
			return {
				currentTab: null
			};
		},

		mounted() {
			this.$eventBus.$on("navigate", this.navigated);
			this.navigated();
		},
		destroyed() {
			this.$eventBus.$off("navigate", this.navigated);
		},

		methods: {
			navigated() {
				if(!this.$router.currentParams.page) {
					this.currentTab = views.dashboard;
				} else if(!this.$router.currentParams.subpage) {
					this.currentTab = views[this.$router.currentParams.page];
				} else {
					this.currentTab = views[this.$router.currentParams.subpage];
				}
			}
		},

		components: {
			"admin-sidebar": AdminSidebar
		}
	};
</script>