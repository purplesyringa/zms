<template>
	<div class="settings">
		<h1>Settings</h1>

		<named-input class="text-input" name="Site title" :error="title === 'Please, fill in title'" v-model="title" />
		<named-input class="text-input" name="Site description" :error="description === 'Please, fill in description'" v-model="description" />

		<theme-button value="Update" @click="update" />
	</div>
</template>

<style lang="sass" scoped>
	@import "./global.sass"

	.settings
		padding: 16px

	.text-input
		margin-top: 16px
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