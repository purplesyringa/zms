<template>
	<div class="root">
		<div class="top">
			<theme-header />
			<theme-list />
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
	.top
		flex: 1 0 auto
	.footer
		flex-shrink: 0
</style>

<script type="text/javascript">
	import ThemeHeader from "../../vue_components/theme/header.vue";
	import ThemeList from "../../vue_components/theme/list.vue";
	import ThemeFooter from "../../vue_components/theme/footer.vue";

	export default {
		name: "home",
		components: {
			"theme-header": ThemeHeader,
			"theme-list": ThemeList,
			"theme-footer": ThemeFooter
		}
	};
</script>