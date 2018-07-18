<template>
	<div class="edit-post">
		<h1>Edit post</h1>

		<theme-edit-post v-model="post" :showInfo="true" />

		<theme-button value="Update" @click="update" />
	</div>
</template>

<style lang="sass" scoped>
	@import "../global.sass"

	.edit-post
		padding: 16px
</style>

<script type="text/javascript">
	import Posts from "../../../libs/posts.js";

	export default {
		name: "admin-new-post",
		data() {
			return {
				id: "",

				post: {
					title: "",
					content: ""
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