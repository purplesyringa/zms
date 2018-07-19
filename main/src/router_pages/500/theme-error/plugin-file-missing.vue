<template>
	<theme-error>
		Looks like a file is missing from "{{plugin}}" plugin, namely
		<i>{{file}}</i>. Either add it to <i>plugins/{{escape(plugin)}}/</i> directory of your
		blog or <a @click="$router.navigate('admin/store/plugins')">reinstall/uninstall this plugin</a>.
	</theme-error>
</template>

<script type="text/javascript">
	import ThemeError from "./theme-error.vue";

	export default {
		name: "plugin-file-missing",

		computed: {
			plugin() {
				return atob(this.$router.currentParams.plugin);
			},
			file() {
				return atob(this.$router.currentParams.base64);
			}
		},

		components: {
			"theme-error": ThemeError
		}
	};
</script>