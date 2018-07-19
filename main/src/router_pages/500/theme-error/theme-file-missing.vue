<template>
	<theme-error>
		Looks like a file is missing from your blog theme, namely
		<i>{{file}}</i>. Either add it to <i>theme/</i> directory of your
		blog or <a @click="$router.navigate('admin/store/themes')">install a different theme</a>.
	</theme-error>
</template>

<script type="text/javascript">
	import ThemeError from "./theme-error.vue";

	export default {
		name: "theme-file-missing",

		computed: {
			file() {
				return atob(this.$router.currentParams.base64);
			}
		},

		components: {
			"theme-error": ThemeError
		}
	};
</script>