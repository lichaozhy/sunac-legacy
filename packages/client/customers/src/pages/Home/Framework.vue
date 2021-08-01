<template>

<div
	id="app-home-framework"
	class="overflow-auto"
	@touchstart="tryPullDown($event)"
>
	<app-home-overview ref="overview" />
	<router-view ref="sub"></router-view>

	<b-button-toolbar
		class="position-absolute w-100"
		style="top:0;left:0;transition:top 0.2s"
		ref="buttons"
	>
		<b-button
			class="mx-auto"
			variant="primary"
			style="border-radius:100%;line-height:20px"
			size="md"
		><b-icon-arrow-repeat /></b-button>
	</b-button-toolbar>
</div>

</template>

<script>
import AppHomeOverview from './Overview.vue';

const initY = -50;
const MAX_Y = 20;

export default {
	components: { AppHomeOverview },
	methods: {
		tryPullDown(event) {
			if (this.$el.scrollTop !== 0) {
				return;
			}

			let offsetY = 0;
			const start = event.targetTouches[0].clientY;
			const moveButton = event => {
				offsetY = Math.min(event.targetTouches[0].clientY - start + initY, MAX_Y);
				this.$refs.buttons.$el.style.setProperty('top', `${offsetY}px`);
			};

			const cancel = () => {
				this.$el.removeEventListener('touchmove', moveButton);
				this.$el.removeEventListener('touchend', cancel);
				this.$refs.buttons.$el.style.setProperty('top', `${initY}px`);

				if (offsetY > MAX_Y - 5) {
					this.refresh();
				}
			};

			this.$el.addEventListener('touchmove', moveButton);
			this.$el.addEventListener('touchend', cancel);
		},
		refresh() {
			this.$refs.overview.refresh();

			if (this.$refs.sub.refresh) {
				this.$refs.sub.refresh();
			}
		}
	},
	mounted() {
		this.$refs.buttons.$el.style.setProperty('top', `${initY}px`);
	}
};
</script>

<style>

</style>
