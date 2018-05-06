<template>
	<div class="sidebar">
		<div class="heading" v-for="heading in headings">
			<icon :name="heading[1]" />
			{{heading[0]}}
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "./variables.sass"

	.sidebar
		display: block
		width: 20%
		height: 100%

		background-color: $sidebar-color

	.heading
		display: block
		padding: 8px 16px

		font-family: Verdana, Arial, sans-serif
		fotn-size: 16px
		color: #FFF

	.heading:hover
		background-color: rgba(255, 255, 255, 0.1)
		cursor: pointer


	.fa-icon
		margin-right: 8px
		margin-bottom: -2px
		color: rgba(255, 255, 255, 0.8)
</style>

<script type="text/javascript">
	export default {
		name: "admin-sidebar",
		data() {
			return {
				headings: [
					["Posts", "pencil-alt"],
					["Users", "users"],
					["Settings", "cog"]
				]
			};
		}
	};
</script>