<template>
	<div class="settings">
		<div class="header">Settings</div>

		<div class="input-name">Site title</div>
		<input
			type="text"
			:class="{input: true, error: title === 'Please, fill in title'}"
			v-model="title"
		>

		<div class="input-name">Site description</div>
		<input
			type="text"
			:class="{input: true, error: description === 'Please, fill in description'}"
			v-model="description"
		>

		<input type="submit" class="submit" value="Update" @click="update">
	</div>
</template>

<style lang="sass" scoped>
	.settings
		padding: 16px

	.header
		font-family: Verdana, Arial, sans-serif
		font-size: 32px
		color: #222


	.input-name
		display: block
		padding: 12px 14px 6px
		margin-top: 16px
		margin-bottom: -36px

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #000
		font-weight: bold

	.input
		display: block
		width: calc(100% - 26px)

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #222

		padding: 12px
		padding-top: 40px
		border: 1px solid #DDD

	textarea.input
		height: 200px
		resize: vertical
	textarea.input.small
		height: 100px
		resize: none

	.input.error
		color: #803


	.submit
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
	import Settings from "../../libs/settings.js";

	export default {
		name: "settings",
		data() {
			return {
				title: "",
				description: ""
			};
		},

		mounted() {
			this.$eventBus.$on("setSiteInfo", this.setSiteInfo);
			this.$eventBus.$emit("needSiteInfo");
		},
		destroyed() {
			this.$eventBus.$off("setSiteInfo", this.setSiteInfo);
		},
		methods: {
			setSiteInfo(siteInfo) {
				this.title = siteInfo.content.title;
				this.description = siteInfo.content.description;
			},

			async update() {
				// Validate
				let error = false;
				if(!this.title || this.title === "Please, fill in title") {
					this.title = "Please, fill in title";
					error = true;
				}
				if(!this.description || this.description === "Please, fill in description") {
					this.description = "Please, fill in description";
					error = true;
				}
				if(error) {
					return;
				}

				// Save content
				await Settings.setContent("title", this.title);
				await Settings.setContent("description", this.description);

				location.reload();
			}
		}
	};
</script>