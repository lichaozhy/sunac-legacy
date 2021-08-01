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
		v-show="!isHomeRoute"
	>
		<router-view></router-view>
	</div>
</div>

</template>

<script>
import AppHomeOverview from './Overview.vue';

export default {
	data() {
		return {
			isHomeRoute: false
		};
	},
	components: { AppHomeOverview },
	mounted() {
		this.isHomeRoute = this.$route.name === 'Home';
	},
	beforeRouteUpdate(to, _from, next) {
		this.isHomeRoute = to.name === 'Home';
		console.log(this.isHomeRoute);

		next();
	}
};
</script>

<style>

</style>
