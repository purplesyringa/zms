<template>
	<div class="content-container">
		<div class="content">
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

	a
		color: lighten(#803, 10%)
	a:hover
		text-decoration: underline
		cursor: pointer
</style>

<script language="text/javascript">
	import Posts from "../../libs/posts.js";

	export default {
		props: [],
		name: "post",

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