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
</style>

<script type="text/javascript">
	import AdminSidebar from "./sidebar.vue";

	import AdminPosts from "./posts.vue";
	import AdminNewPost from "./new-post.vue";
	import AdminEditPost from "./edit-post.vue";
	import AdminSettings from "./settings.vue";
	const views = {
		posts: AdminPosts,
		"new-post": AdminNewPost,
		"edit-post": AdminEditPost,
		settings: AdminSettings
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