<template>
	<div class="new-post">
		<div class="header">New post</div>

		<named-input
			name="Title"
			class="text-input"
			:error="title === 'Please, fill in title'"
			v-model="title"
		/>
		<textarea
			:class="{input: true, small: true, error: cut === 'Please, fill in introduction'}"
			placeholder="Introduction (shown before [Read more] button)"
			v-model="cut"
		></textarea>
		<named-textarea
			name="What's on your mind?"
			class="text-input"
			:error="content === 'Please, type something'"
			v-model="content"
		/>

		<input type="submit" class="submit" value="Publish" @click="publish">
	</div>
</template>

<style lang="sass" scoped>
	.new-post
		padding: 16px

	.header
		font-family: Verdana, Arial, sans-serif
		font-size: 32px
		color: #222


	.text-input
		margin-top: 16px

	textarea.input
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
				title: "",
				content: "",
				cut: ""
			};
		},
		methods: {
			async publish() {
				let error = false;
				if(!this.title || this.title === "Please, fill in title") {
					this.title = "Please, fill in title";
					error = true;
				}
				if(!this.cut || this.cut === "Please, fill in introduction") {
					this.cut = "Please, fill in introduction";
					error = true;
				}
				if(!this.content || this.content === "Please, type something") {
					this.content = "Please, type something";
					error = true;
				}
				if(error) {
					return;
				}

				let url = await Posts.publish(this.title, this.content, this.cut);
				this.$router.navigate(url);
			}
		}
	};
</script>