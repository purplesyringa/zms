<template>
	<div class="settings">
		<div class="header">Settings</div>

		<named-input class="input" name="Site title" :error="title === 'Please, fill in title'" v-model="title" />
		<named-input class="input" name="Site description" :error="description === 'Please, fill in description'" v-model="description" />

		<theme-button value="Update" @click="update" />
	</div>
</template>

<style lang="sass" scoped>
	.settings
		padding: 16px

	.header
		font-family: Verdana, Arial, sans-serif
		font-size: 32px
		color: #222



	.input
		margin-top: 16px

	textarea.input
		height: 200px
		resize: vertical
	textarea.input.small
		height: 100px
		resize: none

	.input.error
		color: #803
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