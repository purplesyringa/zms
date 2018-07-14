<template>
	<div class="theme-error">
		<div class="content">
			<slot />
		</div>
	</div>
</template>

<style lang="sass" scoped>
	.theme-error
		display: block
		width: 100%
		height: 100%


	.content
		position: absolute
		left: 20%
		top: 50%
		transform: translateY(-50%)

		width: 60%

		font-family: Verdana, Arial, sans-serif
		font-size: 32px
		text-align: center
</style>

<script type="text/javascript">
	export default {
		name: "theme-error"
	};
</script>