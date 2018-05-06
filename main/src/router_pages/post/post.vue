<template>
	<div>
		<theme-header />
		<theme-post />
		<theme-footer />
	</div>
</template>

<script type="text/javascript">
	import ThemeHeader from "../../vue_components/theme/header.vue";
	import ThemePost from "../../vue_components/theme/post.vue";
	import ThemeFooter from "../../vue_components/theme/footer.vue";

	export default {
		name: "home",
		components: {
			"theme-header": ThemeHeader,
			"theme-post": ThemePost,
			"theme-footer": ThemeFooter
		}
	};
</script>