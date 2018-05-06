<template>
	<div class="sidebar">
		<div
			v-for="heading in headings"

			:class="{heading: true, 'heading-opened': heading.opened}"
			@click="open(heading)"
		>
			<icon :name="heading.icon" />
			{{heading.name}}
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

	.heading-opened
		background-color: #803
	.heading-opened:hover
		background-color: lighten(#803, 10%)


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
					{name: "Posts", icon: "pencil-alt", opened: false},
					{name: "Users", icon: "users", opened: false},
					{name: "Settings", icon: "cog", opened: false},
				],
				currentOpened: null
			};
		},
		methods: {
			open(heading) {
				if(this.currentOpened) {
					this.currentOpened.opened = false;
				}

				this.currentOpened = heading;
				heading.opened = true;

				this.$router.navigate("admin/" + heading.name.toLowerCase());
			}
		}
	};
</script>