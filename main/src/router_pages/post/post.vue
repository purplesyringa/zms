<template>
	<div class="root">
		<div class="top">
			<theme-header />
			<theme-post />
		</div>
		<div class="footer">
			<theme-footer />
		</div>
	</div>
</template>

<style lang="sass" scoped>
	.root
		height: 100%
		display: flex
		flex-direction: column
		overflow: auto
	.top
		flex: 1 0 auto
	.footer
		flex-shrink: 0
</style>

<script type="text/javascript">
	import ThemeHeader from "../../theme/header.vue";
	import ThemePost from "../../theme/post.vue";
	import ThemeFooter from "../../theme/footer.vue";

	export default {
		name: "home",
		components: {
			"theme-header": ThemeHeader,
			"theme-post": ThemePost,
			"theme-footer": ThemeFooter
		}
	};
</script>