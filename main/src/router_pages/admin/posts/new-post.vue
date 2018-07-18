<template>
	<div class="new-post">
		<h1>New post</h1>

		<theme-edit-post v-model="post" :showInfo="false" />

		<theme-button value="Publish" @click="publish" />
	</div>
</template>

<style lang="sass" scoped>
	@import "../global.sass"

	.new-post
		padding: 16px
</style>

<script type="text/javascript">
	import Posts from "../../../libs/posts.js";

	export default {
		name: "admin-new-post",
		data() {
			return {
				post: {
					title: "",
					content: ""
				}
			};
		},

		methods: {
			async publish() {
				let error = false;
				if(!this.post.title || this.post.title === "Please, fill in title") {
					this.post.title = "Please, fill in title";
					error = true;
				}
				if(!this.post.content || this.post.content === "Please, type something") {
					this.post.content = "Please, type something";
					error = true;
				}
				if(error) {
					return;
				}

				let url = await Posts.publish(this.post.title, this.post.content);
				this.$router.navigate(url);
			}
		}
	};
</script>