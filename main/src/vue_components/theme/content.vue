<template>
	<div class="content-container">
		<div class="content">
			<div class="post">
				<div class="post-title">Welcome to ZMS!</div>
				<div class="post-description">This is the first release of ZMS, Zero Management System. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod massa in fermentum viverra. Nulla facilisi. Fusce sit amet accumsan velit. Maecenas orci erat, bibendum accumsan risus at, malesuada suscipit velit. Duis enim mi, laoreet ac accumsan vel, dignissim in lacus. Sed accumsan congue lacus, eget tincidunt magna malesuada ut. Suspendisse pulvinar leo ut nisl auctor luctus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus condimentum bibendum arcu ut rutrum. Fusce quis purus sit amet ex dapibus lobortis. Vestibulum convallis id velit vel gravida. Maecenas id nibh urna.</div>
			</div>
			<div class="post">
				<div class="post-title">Welcome to ZMS!</div>
				<div class="post-description">This is the first release of ZMS, Zero Management System. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod massa in fermentum viverra. Nulla facilisi. Fusce sit amet accumsan velit. Maecenas orci erat, bibendum accumsan risus at, malesuada suscipit velit. Duis enim mi, laoreet ac accumsan vel, dignissim in lacus. Sed accumsan congue lacus, eget tincidunt magna malesuada ut. Suspendisse pulvinar leo ut nisl auctor luctus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus condimentum bibendum arcu ut rutrum. Fusce quis purus sit amet ex dapibus lobortis. Vestibulum convallis id velit vel gravida. Maecenas id nibh urna.</div>
			</div>
			<div class="post">
				<div class="post-title">Welcome to ZMS!</div>
				<div class="post-description">This is the first release of ZMS, Zero Management System. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod massa in fermentum viverra. Nulla facilisi. Fusce sit amet accumsan velit. Maecenas orci erat, bibendum accumsan risus at, malesuada suscipit velit. Duis enim mi, laoreet ac accumsan vel, dignissim in lacus. Sed accumsan congue lacus, eget tincidunt magna malesuada ut. Suspendisse pulvinar leo ut nisl auctor luctus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus condimentum bibendum arcu ut rutrum. Fusce quis purus sit amet ex dapibus lobortis. Vestibulum convallis id velit vel gravida. Maecenas id nibh urna.</div>
			</div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "variables.sass"

	.content-container
		display: block
	.content
		display: block
		width: $view-width
		max-width: calc(100% - #{$hspacing})
		margin: 0 auto

	.post
		display: block
		margin: 32px 0


	.post-title
		font-family: Verdana, Arial, sans-serif
		font-size: 32px
		color: #000

	.post-description
		font-family: Verdana, Arial, sans-serif
		font-size: 16px
		color: #222
</style>

<script language="text/javascript">
	export default {
		props: [],
		name: "content"
	};
</script>