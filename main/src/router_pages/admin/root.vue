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
	const views = {
		posts: AdminPosts
	};

	export default {
		name: "admin-root",
		data() {
			return {
				currentTab: AdminSidebar
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
				this.currentTab = views[this.$router.currentParams.page || "dashboard"];
			}
		},

		components: {
			"admin-sidebar": AdminSidebar
		}
	};
</script>