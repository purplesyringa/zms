<template>
	<div>
		<theme-header />
		<theme-content />
		<theme-footer />
	</div>
</template>

<script type="text/javascript">
	import ThemeHeader from "../../vue_components/theme/header.vue";
	import ThemeContent from "../../vue_components/theme/content.vue";
	import ThemeFooter from "../../vue_components/theme/footer.vue";

	export default {
		name: "home",
		components: {
			"theme-header": ThemeHeader,
			"theme-content": ThemeContent,
			"theme-footer": ThemeFooter
		}
	};
</script>