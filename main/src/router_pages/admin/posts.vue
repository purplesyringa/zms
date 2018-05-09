<template>
	<div class="posts">
		<h1>Posts</h1>

		<table>
			<tr>
				<th class="column-title">Title</th>
				<th class="column-author">Author</th>
				<th class="column-date">Date</th>
			</tr>
			<tr v-for="post in posts" v-if="!post.deleted">
				<td class="column-title">
					{{post.title}}

					<div class="icons">
						<span class="icon" @click="$router.navigate(post.editUrl)" v-if="post.editable || siteInfo.settings.own">
							<icon name="edit" />
							Edit
						</span>

						<span class="icon" @click="remove(post)" v-if="post.editable || siteInfo.settings.own">
							<icon name="trash" />
							Delete
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
	@import "./global.sass"

	.posts
		padding: 16px


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
	import "vue-awesome/icons/edit";
	import "vue-awesome/icons/trash";
	import "vue-awesome/icons/eye";

	export default {
		name: "admin-posts",
		data() {
			return {
				siteInfo: {
					settings: {
						own: false
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
			},

			async remove(post) {
				await Posts.remove(post);
				post.deleted = true;
			}
		},


		asyncComputed: {
			async posts() {
				let posts = await Posts.getList("");
				posts.forEach(post => {
					post.deleted = false;
				});
				return posts;
			}
		}
	};
</script>