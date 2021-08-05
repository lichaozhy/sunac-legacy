<template>

<router-view
	class="h-100"
	id="app"
></router-view>

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
