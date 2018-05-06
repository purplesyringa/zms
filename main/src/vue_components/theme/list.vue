<template>
	<div class="content-container">
		<div class="content">
			<!-- New post -->
			<div class="new-post" v-if="siteInfo.privatekey">
				<icon name="pencil-alt" />
				<a @click="$router.navigate('admin/posts/new-post')">New post</a>
			</div>

			<div class="post" v-for="post in posts">
				<div class="post-title">
					<a @click="$router.navigate(post.url)">{{post.title}}</a>
				</div>

				<div class="post-info">
					On {{(new Date(post.date)).toLocaleString()}}
					by <a @click="$router.navigate(post.userUrl)">{{post.user}}</a>
				</div>
				<div class="post-description">
					{{post.cut}}

					<a @click="$router.navigate(post.url)">Read more</a>
				</div>
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
		margin: 0 auto

	.post
		display: block
		margin: 32px 0


	.post-title
		font-family: Verdana, Arial, sans-serif
		font-size: 32px

	.post-info
		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #666

	.post-description
		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #222

	a
		color: lighten(#803, 10%)
	a:hover
		text-decoration: underline
		cursor: pointer


	.new-post
		display: block
		margin: 32px 0

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
</style>

<script language="text/javascript">
	import Posts from "../../libs/posts.js";

	export default {
		props: [],
		name: "list",

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
			async posts() {
				return await Posts.getList();
			}
		}
	};
</script>