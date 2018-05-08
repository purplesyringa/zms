<template>
	<div class="footer-container">
		<div class="footer">
			<div class="column">
				<div class="column-title">Column 1</div>
				<div class="column-link">Link 1</div>
				<div class="column-link">Link 2</div>
				<div class="column-link">Link 3</div>
			</div>
			<div class="column">
				<div class="column-title">Column 2</div>
				<div class="column-link">Link 1</div>
				<div class="column-link">Link 2</div>
			</div>
			<div class="column">
				<div class="column-title">Column 3</div>
				<div class="column-link">Link 1</div>
				<div class="column-link">Link 2</div>
				<div class="column-link">Link 3</div>
				<div class="column-link">Link 4</div>
				<div class="column-link">Link 5</div>
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
	export default {
		props: [],
		name: "footer"
	};
</script>