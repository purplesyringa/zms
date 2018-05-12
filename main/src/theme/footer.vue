<template>
	<div class="footer-container">
		<div class="footer">
			<div class="column">
				<div class="column-title">{{col1}}</div>
				<div class="column-link" v-for="link in links1">
					<a :href="link[1]">{{link[0]}}</a>
				</div>
			</div>

			<div class="column">
				<div class="column-title">{{col2}}</div>
				<div class="column-link" v-for="link in links2">
					<a :href="link[1]">{{link[0]}}</a>
				</div>
			</div>

			<div class="column">
				<div class="column-title">{{col3}}</div>
				<div class="column-link" v-for="link in links3">
					<a :href="link[1]">{{link[0]}}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "variables.sass"

	.footer-container
		display: block
		background-color: $footer-bg
		padding: 64px 0
	.footer
		display: block
		width: $view-width
		max-width: calc(100% - #{$hspacing})
		margin: 0 auto


	.column
		display: inline-block
		width: 30%
		vertical-align: top

		font-family: Verdana, Arial, sans-serif

	@include phone
		.column
			display: block
			width: 100%
			margin-top: 32px
		.column:first-child
			margin-top: 0


	.column-title
		margin-bottom: 8px

		font-size: 24px
		color: #FFF

	.column-link
		font-size: 16px
		color: rgba(255, 255, 255, 0.8)
	.column-link:hover
		color: rgba(255, 255, 255, 1)
		text-decoration: underline
		cursor: pointer
</style>

<script language="text/javascript">
	import Settings from "../libs/settings.js";

	export default {
		props: [],
		name: "footer",

		asyncComputed: {
			async col1() {
				return Settings.get("theme.footerCol1", "");
			},
			links1: {
				async get() {
					return Settings.get("theme.footerCol1links", []);
				},
				default: []
			},

			async col2() {
				return Settings.get("theme.footerCol2", "");
			},
			links2: {
				async get() {
					return Settings.get("theme.footerCol2links", []);
				},
				default: []
			},

			async col3() {
				return Settings.get("theme.footerCol3", "");
			},
			links3: {
				async get() {
					return Settings.get("theme.footerCol3links", []);
				},
				default: []
			}
		}
	};
</script>