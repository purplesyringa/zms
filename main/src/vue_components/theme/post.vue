<template>
	<div class="content-container">
		<div class="content">
			<!-- Edit post -->
			<div class="edit-post" v-if="siteInfo.privatekey">
				<icon name="edit" />
				<a @click="$router.navigate(post.editUrl)">Edit post</a>
			</div>


			<div class="post-title">{{post.title}}</div>

			<div class="post-info">
				On {{(new Date(post.date)).toLocaleString()}}
				by <a @click="$router.navigate(post.userUrl)">{{post.user}}</a>
			</div>
			<div class="post-description">
				{{post.content}}
			</div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "variables.sass"

	.content-container
		display: block
	.content
		display: block
		width: $view-width
		max-width: calc(100% - #{$hspacing})
		margin: 32px auto

	.post-title
		font-family: Verdana, Arial, sans-serif
		font-size: 32px
		color: #222

	.post-info
		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #666

	.post-description
		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #222


	.edit-post
		display: block
		margin: 32px 0

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
</style>

<script language="text/javascript">
	import Posts from "../../libs/posts.js";

	export default {
		props: [],
		name: "post",

		data() {
			return {
				siteInfo: {
					privatekey: false
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
		},

		asyncComputed: {
			post: {
				async get() {
					return await Posts.get(this.$router.currentParams.id);
				},
				default: {
					title: "",
					content: "",
					date: 0,
					userUrl: "",
					user: ""
				}
			}
		}
	};
</script>