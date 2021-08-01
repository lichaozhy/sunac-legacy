<template>

<div
	id="app-home-framework"
	class="overflow-hidden"
>
	<app-home-overview />
	<div
		class="w-100 h-100 position-absolute"
		id="app-home-sub"
		style="top:0;left:0"
	>
		<router-view></router-view>
	</div>
</div>

</template>

<script>
import AppHomeOverview from './Overview.vue';

export default {
	components: { AppHomeOverview }
};
</script>

<style>

</style>
