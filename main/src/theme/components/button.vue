<template>
	<input type="submit" :value="value" @click="$emit('click')">
</template>

<style lang="sass" scoped>
	input
		display: block
		width: 100px
		margin-top: 16px
		float: right

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #FFF

		background-color: #803
		padding: 12px

		border: none
</style>

<script type="text/javascript">
	export default {
		name: "theme-button",
		props: ["value"],
		data() {
			return {
				value: ""
			};
		}
	};
</script>