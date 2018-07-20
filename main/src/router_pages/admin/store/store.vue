<template>
	<div class="store">
		<h1>Store</h1>

		<div class="text">
			<a href="/1StoREUtoyQjPCH7BXVqFC4LDLsEJt6gE">Go browse ZMS Store</a> (you'll have to download another site) or install a <a @click="$router.navigate('admin/store/themes')">theme</a> or a <a @click="$router.navigate('admin/store/plugins')">plugin</a>.
		</div>
	</div>
</template>

<style lang="sass" scoped>
	@import "../global.sass"

	.store
		padding: 16px
	.text
		margin-top: 16px
		font-size: 16px
</style>

<script type="text/javascript">
	export default {
		name: "store"
	};
</script>