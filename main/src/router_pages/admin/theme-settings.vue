<template>
	<div class="theme-settings">
		<h1>Theme settings</h1>

		<div v-for="setting in settings">
			<h2 v-if="setting.heading">{{setting.heading}}</h2>

			<named-input
				v-else-if="setting.type === 'string'"

				class="text-input"
				:name="setting.description"
				:placeholder="setting.default"
			/>

			<named-textarea
				v-else-if="setting.type === 'string[]'"

				class="text-input"
				:name="setting.description"
				:small="true"
				:placeholder="setting.default.join('\n')"
			/>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "./global.sass"

	.theme-settings
		padding: 16px

	.text-input
		margin-top: 16px
</style>

<script type="text/javascript">
	import Theme from "../../libs/theme.js";

	export default {
		name: "theme-settings",

		computed: {
			settings() {
				return Theme.getManifest().settings;
			}
		}
	};
</script>