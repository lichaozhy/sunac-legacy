<template>

<div id="app-home-framework">
	<app-home-overview ref="overview" />
	<router-view ref="sub"></router-view>
</div>

</template>

<script>
import AppHomeOverview from './Overview.vue';

export default {
	components: { AppHomeOverview },
	methods: {
		refresh() {
			this.$refs.overview.refresh();

			if (this.$refs.sub.refresh) {
				this.$refs.sub.refresh();
			}
		}
	}
};
</script>

<style>

</style>
