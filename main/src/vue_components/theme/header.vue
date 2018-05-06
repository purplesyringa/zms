<template>
	<div class="header-container" @click="$router.navigate('')">
		<div class="header">
			<div class="title">
				{{siteInfo.content.title}}
				<icon name="cog" scale="2" class="cog" v-if="siteInfo.privatekey" @click.native.stop="$router.navigate('admin')" />
			</div>
			<div class="description">{{siteInfo.content.description}}</div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "variables.sass"

	.header-container
		display: block
		background-color: $header-bg
		padding: 64px 0
		cursor: pointer
	.header
		display: block
		width: $view-width
		max-width: calc(100% - #{$hspacing})
		margin: 0 auto


	.title
		font-family: Verdana, Arial, sans-serif
		font-size: 64px
		color: #FFF

	.description
		font-family: Verdana, Arial, sans-serif
		font-size: 24px
		color: rgba(255, 255, 255, 0.8)

	.cog
		display: inline-block
		vertical-align: top
		margin-top: 24px

		color: rgba(255, 255, 255, 0.4)

	.cog:hover
		color: rgba(255, 127, 127, 0.6)
		cursor: pointer
</style>

<script language="text/javascript">
	export default {
		props: [],
		name: "header",
		data() {
			return {
				siteInfo: {
					content: {
						title: "",
						description: "",
						privatekey: false
					}
				}
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
				this.siteInfo = siteInfo;
			}
		}
	};
</script>