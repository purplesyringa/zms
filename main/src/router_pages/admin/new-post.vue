<template>
	<div class="new-post">
		<div class="header">New post</div>

		<input type="text" class="input" placeholder="Title">
		<textarea class="input" placeholder="What's on your mind?"></textarea>

		<input type="submit" class="submit" value="Publish">
	</div>
</template>

<style lang="sass" scoped>
	.new-post
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
	export default {
		name: "admin-new-post"
	};
</script>