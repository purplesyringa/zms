<template>
	<div class="new-post">
		<div class="header">New post</div>

		<named-input
			name="Title"
			class="text-input"
			:error="title === 'Please, fill in title'"
			v-model="title"
		/>
		<named-textarea
			name="Introduction (shown before [Read more] button)"
			class="text-input"
			:small="true"
			:error="cut === 'Please, fill in introduction'"
			v-model="cut"
		/>
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