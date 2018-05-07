<template>
	<div class="new-post">
		<h1>New post</h1>

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

		<theme-button value="Publish" @click="publish" />
	</div>
</template>

<style lang="sass" scoped>
	@import "./global.sass"

	.new-post
		padding: 16px

	.text-input
		margin-top: 16px
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