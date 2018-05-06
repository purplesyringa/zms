<template>
	<div class="posts">
		<div class="header">Posts</div>

		<table>
			<tr>
				<th class="column-title">Title</th>
				<th class="column-author">Author</th>
				<th class="column-date">Date</th>
			</tr>
			<tr v-for="post in posts">
				<td class="column-title">
					{{post.title}}

					<div class="icons">
						<span class="icon" @click="$router.navigate(post.editUrl)">
							<icon name="edit" />
							Edit
						</span>

						<span class="icon" @click="$router.navigate(post.url)">
							<icon name="eye" />
							View
						</span>
					</div>
				</td>
				<td class="column-author">
					<a @click="$router.navigate(post.userUrl)">{{post.user}}</a>
				</td>
				<td class="column-date">
					{{(new Date(post.date)).toLocaleString()}}
				</td>
			</tr>
		</table>
	</div>
</template>

<style lang="sass" scoped>
	.posts
		padding: 16px
	.header
		font-family: Verdana, Arial, sans-serif
		font-size: 32px
		color: #222


	table
		width: 100%
		margin-top: 16px

		border-spacing: 0
		border-collapse: collapse

	tr
		border: 1px solid #DDD
		background-color: #EEE
		color: #666
	tr:hover
		background-color: lighten(#EEE, 5%)
		color: #000

	th, td
		padding: 8px

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		text-align: left
		font-weight: normal

	th
		color: #000


	.column-title
		width: 50%
	.column-author
		width: 25%
	.column-date
		width: 25%

	.icons
		float: right
	.icon
		cursor: pointer
		margin-left: 8px
		color: lighten(#803, 10%)
</style>

<script type="text/javascript">
	import Posts from "../../libs/posts.js";

	export default {
		name: "admin-posts",

		asyncComputed: {
			async posts() {
				return await Posts.getList("");
			}
		}
	};
</script>