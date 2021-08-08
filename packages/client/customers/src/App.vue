<template>

<div class="h-100 overflow-auto" id="app">
	<router-view></router-view>
	<app-sharing-mask />
	<app-location />
</div>

</template>

<script>

export default {
	async mounted() {
		await this.$wx.updateTimelineShareData({
			title: 'vue',
			link: 'http://127.0.0.1/dev',
			imgUrl: 'fdsfsdfdds'
		});
	}
};
</script>
