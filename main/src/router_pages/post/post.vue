<template>
	<div class="root">
		<div class="top">
			<theme-header />
			<theme-post />
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
		overflow: auto
	.top
		flex: 1 0 auto
	.footer
		flex-shrink: 0
</style>

<script type="text/javascript">
	export default {
		name: "home"
	};
</script>