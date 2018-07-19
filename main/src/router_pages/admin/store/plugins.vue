<template>
	<div class="store">
		<h1>Plugins</h1>

		<div class="loading" v-if="loading">
			Loading...
		</div>

		<div class="plugin" v-for="plugin in plugins">
			<div class="header">
				<div class="title">
					{{plugin.title}}
				</div>
				by {{plugin.cert_user_id}}
			</div>

			<div :class="['verified', ['unverified', 'not-yet-verified', ''][plugin.verified + 1]]">
				<template v-if="plugin.verified == 1">
					VERIFIED
				</template>
				<template v-else-if="plugin.verified == -1">
					DANGEROUS
				</template>
				<template v-else>
					NOT YET VERIFIED
				</template>
			</div>

			<div class="description">
				{{plugin.description}}
			</div>

			<div class="menu">
				<a @click="show(plugin)">
					<icon class="icon" name="shopping-cart" />
					Open in ZMS Store
				</a>
				<a @click="install(plugin)">
					<icon class="icon" name="download" />
					Install
				</a>
			</div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "../global.sass"

	.store
		padding: 16px
		padding-right: 0
	.text
		margin-top: 16px
		font-family: Verdana, Arial, sans-serif
		font-size: 16px

	h1
		margin-bottom: 16px

	.loading
		font-family: Verdana, Arial, sans-serif
		font-size: 24px

	.plugin
		display: inline-block
		width: calc(33% - 14px)
		margin-right: 16px
		margin-bottom: 24px
		overflow: hidden

		position: relative

		border-radius: 4px
		box-shadow: 0 4px 4px #CCC

	.header
		padding: 8px 16px

		font-family: Verdana, Arial, sans-serif
		color: #888

		.title
			font-size: 20px
			color: #000


	.description
		padding: 16px

		font-family: Verdana, Arial, sans-serif
		font-size: 16px


	.verified
		display: inline-block
		padding: 12px
		height: 45px

		position: absolute
		right: 16px
		top: 16px

		font-family: Verdana, Arial, sans-serif
		font-size: 16px

		background-color: #080
		color: #FFF

		border-radius: 4px
		box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4)

		&.not-yet-verified
			background-color: #880
		&.unverified
			background-color: #800


	.menu
		height: 48px
		padding: 16px

		font-family: Verdana, Arial, sans-serif
		font-size: 16px

		a
			float: right
			display: inline-block
			margin-left: 16px

			.icon
				margin-top: 4px
				color: lighten(#803, 10%)
				cursor: pointer
</style>

<script type="text/javascript">
	import {zeroAuth, zeroDB, zeroFS, zeroPage} from "../../../zero";
	import Store from "../../../libs/store.js";

	export default {
		name: "store-plugins",

		data() {
			return {
				loading: true
			};
		},

		asyncComputed: {
			plugins: {
				async get() {
					this.loading = true;

					await Store.mount();
					const plugins = await Store.Plugins.getAllPluginList();

					this.loading = false;
					return plugins;
				},
				default: []
			}
		},

		methods: {
			show(plugin) {
				top.location.href = `/${Store.ZMS_STORE}/?/${plugin.url}`;
			},

			async install(plugin) {
				let progress = zeroPage.progress("Loading ZMS Store");
				await Store.mount();

				progress.setMessage("Installing plugin");
				progress.setPercent(20);
				await Store.Plugins.downloadPlugin(plugin, (...args) => {
					progress.setMessage(...args);
				});

				progress.setMessage("Building plugin");
				progress.setPercent(50);

				let files = await Store.Plugins.buildPlugin(escape(plugin.title), (...args) => {
					progress.setMessage(...args);
				});

				progress.setMessage("Saving built plugin");
				progress.setPercent(90);

				await Store.Plugins.savePlugin(escape(plugin.title), files, (...args) => {
					progress.setMessage(...args);
				});

				progress.setMessage("Done");
				progress.done();
			}
		}
	};
</script>