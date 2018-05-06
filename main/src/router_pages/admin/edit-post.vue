<template>
	<div class="edit-post">
		<div class="header">Edit post</div>

		<input
			type="text"
			:class="{input: true, error: title === 'Please, fill in title'}"
			placeholder="Title"
			v-model="post.title"
		>
		<textarea
			:class="{input: true, small: true, error: cut === 'Please, fill in introduction'}"
			placeholder="Introduction (shown before [Read more] button)"
			v-model="post.cut"
		></textarea>
		<textarea
			:class="{input: true, error: content === 'Please, type something'}"
			placeholder="What's on your mind?"
			v-model="post.content"
		></textarea>

		<input type="submit" class="submit" value="Update" @click="update">
	</div>
</template>

<style lang="sass" scoped>
	.edit-post
		padding: 16px

	.header
		font-family: Verdana, Arial, sans-serif
		font-size: 32px
		color: #222


	.input
		display: block
		width: calc(100% - 26px)
		margin-top: 16px

		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #222

		padding: 12px
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
	import Posts from "../../libs/posts.js";

	export default {
		name: "admin-new-post",
		data() {
			return {
				id: "",

				post: {
					title: "",
					content: "",
					cut: ""
				}
			};
		},
		async mounted() {
			this.id = this.$router.currentParams.arg;
			this.post = await Posts.get(this.id);
		},
		methods: {
			async update() {
				let error = false;
				if(!this.post.title || this.post.title === "Please, fill in title") {
					this.post.title = "Please, fill in title";
					error = true;
				}
				if(!this.post.cut || this.post.cut === "Please, fill in introduction") {
					this.post.cut = "Please, fill in introduction";
					error = true;
				}
				if(!this.post.content || this.post.content === "Please, type something") {
					this.post.content = "Please, type something";
					error = true;
				}
				if(error) {
					return;
				}

				let url = await Posts.update(this.id, this.post);
				this.$router.navigate(url);
			}
		}
	};
</script>