<template>
	<div>
		<div class="name">{{name}}</div>
		<input type="text" v-model="value" :placeholder="placeholder" @input="$emit('input', value)" :class="{error}">
	</div>
</template>

<style lang="sass" scoped>
	.name
		display: block
		padding: 12px 14px 6px
		margin-bottom: -36px

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #000
		font-weight: bold

	input
		display: block
		width: calc(100% - 26px)

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #222

		padding: 12px
		padding-top: 40px
		border: 1px solid #DDD

	.error
		color: #803
</style>

<script type="text/javascript">
	export default {
		name: "named-input",
		props: ["name", "value", "error", "placeholder"],
		data() {
			return {
				name: "",
				value: "",
				error: false
			};
		}
	};
</script>