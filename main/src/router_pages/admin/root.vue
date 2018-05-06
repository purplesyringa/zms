<template>
	<div class="root">
		<admin-sidebar />

		<component :is="currentTab"></component>
	</div>
</template>

<style lang="sass" scoped>
	.root
		height: 100%
</style>

<script type="text/javascript">
	import AdminSidebar from "./sidebar.vue";

	import AdminPosts from "./posts.vue";
	import AdminNewPost from "./new-post.vue";
	const views = {
		posts: AdminPosts,
		"new-post": AdminNewPost
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