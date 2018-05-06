<template>
	<div class="sidebar">
		<!-- headings -->
		<component v-for="heading in headings" :key="heading.name">
			<div
				:class="{heading: true, 'heading-opened': heading.opened}"
				@click="open(heading)"
			>
				<icon :name="heading.icon" />
				{{heading.name}}
			</div>

			<!-- subitems -->
			<component v-if="heading.opened">
				<div
					v-for="subitem in heading.sub"

					:class="{'sub-heading': true, 'sub-heading-opened': subitem.opened}"
					@click="openSubitem(heading, subitem)"
				>
					{{subitem.name}}
				</div>
			</component>
		</component>
	</div>
</template>

<style lang="sass" scoped>
	@import "./variables.sass"

	.sidebar
		display: block
		width: 20%
		height: 100%

		background-color: $sidebar-color

	// Main heading
	.heading, .sub-heading
		display: block
		padding: 8px 16px

		font-family: Verdana, Arial, sans-serif
		fotn-size: 16px
		color: #FFF
	.heading:hover
		background-color: rgba(255, 255, 255, 0.1)
		cursor: pointer

	.heading-opened
		background-color: $main-color
	.heading-opened:hover
		background-color: lighten($main-color, 10%)


	// Subheading
	.sub-heading
		background-color: rgba(0, 0, 0, 0.8)
	.sub-heading:hover
		background-color: rgba(0, 0, 0, 0.2)
		cursor: pointer

	.sub-heading-opened
		background-color: $sub-color
	.sub-heading-opened:hover
		background-color: lighten($sub-color, 10%)


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
					{
						name: "Posts",
						icon: "pencil-alt",
						opened: false,
						sub: [
							{
								name: "New post",
								opened: false
							},
							{
								name: "New article",
								opened: false
							}
						]
					},
					{
						name: "Users",
						icon: "users",
						opened: false,
						sub: []
					},
					{
						name: "Settings",
						icon: "cog",
						opened: false,
						sub: []
					},
				],
				currentOpened: null,
				currentOpenedSubitem: null
			};
		},
		methods: {
			open(heading) {
				if(this.currentOpened) {
					this.currentOpened.opened = false;
				}
				if(this.currentOpenedSubitem) {
					this.currentOpenedSubitem.opened = false;
				}

				this.currentOpened = heading;
				heading.opened = true;

				this.$router.navigate("admin/" + heading.name.toLowerCase());
			},
			openSubitem(heading, subitem) {
				if(this.currentOpened) {
					this.currentOpened.opened = false;
				}
				if(this.currentOpenedSubitem) {
					this.currentOpenedSubitem.opened = false;
				}

				this.currentOpened = heading;
				this.currentOpenedSubitem = subitem;
				heading.opened = true;
				subitem.opened = true;

				this.$router.navigate("admin/" + this.toUrl(heading.name) + "/" + this.toUrl(subitem.name));
			},

			toUrl(text) {
				return text.toLowerCase().replace(/\s/, "-");
			}
		}
	};
</script>