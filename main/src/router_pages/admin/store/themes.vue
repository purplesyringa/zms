<template>
	<div class="store">
		<h1>Themes</h1>

		<div class="theme" v-for="i in 10">
			<img src="/1StoREUtoyQjPCH7BXVqFC4LDLsEJt6gE/data/users/1Cy3ntkN2GN9MH6EaW6eHpi4YoRS2nK5Di/Standard.png">
			<div class="header">
				<icon class="icon" name="shopping-cart" />
				<icon class="icon" name="download" />

				Standard <i>by gitcenter@zeroid.bit</i>
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

	.theme
		display: inline-block
		width: calc(33% - 14px)
		margin-right: 16px
		margin-bottom: 24px
		overflow: hidden

		border-radius: 4px
		box-shadow: 0 4px 4px #CCC

	.theme img
		width: 100%

	.header
		padding: 8px 16px

		font-family: Verdana, Arial, sans-serif
		font-size: 20px

	.icon
		float: right
		margin-top: 4px
		margin-left: 16px
		color: lighten(#803, 10%)
</style>

<script type="text/javascript">
	import {zeroAuth, zeroDB, zeroFS, zeroPage} from "../../../route.js";
	import Store from "../../../libs/store.js";
	import "vue-awesome/icons/shopping-cart";
	import "vue-awesome/icons/download";

	export default {
		name: "store-themes",

		data() {
			return {};
		},

		async mounted() {
			await Store.mount();
		}
	};
</script>