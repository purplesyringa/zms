<template>
	<div class="current-view">
		<component :is="$parent.currentView" ref="currentView"></component>
	</div>
</template>

<style lang="sass" scoped>
	.current-view
		height: 100%
</style>

<script language="text/javascript">
	export default {
		props: [],
		name: "root"
	};
</script>