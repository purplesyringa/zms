<template>
	<div class="edit-post">
		<div class="header">Edit post</div>

		<named-input
			name="Title"
			class="text-input"
			:error="post.title === 'Please, fill in title'"
			v-model="post.title"
		/>
		<named-textarea
			name="Introduction (shown before [Read more] button)"
			class="text-input"
			:small="true"
			:error="post.cut === 'Please, fill in introduction'"
			v-model="post.cut"
		/>
		<named-textarea
			name="What's on your mind?"
			class="text-input"
			:error="content === 'Please, type something'"
			v-model="post.content"
		/>

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


	.text-input
		margin-top: 16px

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