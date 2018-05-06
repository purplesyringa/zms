<template>
	<div class="root">
		<admin-sidebar />
	</div>
</template>

<style lang="sass" scoped>
	.root
		height: 100%
</style>

<script type="text/javascript">
	import AdminSidebar from "./sidebar.vue";

	export default {
		name: "admin-root",
		components: {
			"admin-sidebar": AdminSidebar
		}
	};
</script>