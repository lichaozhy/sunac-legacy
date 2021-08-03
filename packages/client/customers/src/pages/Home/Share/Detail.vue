<template>

<div class="px-2 pb-5 overflow-auto">
	<b-button-toolbar>
		<div class="mr-auto d-flex">
			<b-avatar class="mr-2" :src="customer.headimgurl" />
			<div class="d-flex flex-column adjust-content-center">
				<div>{{ customer.nickname }}</div>
				<b-form-text class="mt-0">{{ customer.cityAs }}</b-form-text>
			</div>
		</div>
		<b-button
			variant="link"
			class="text-dark"
		><b-icon-share class="mr-1" />分享</b-button>
	</b-button-toolbar>

	<b-carousel
		indicators
		class="app-carousel mt-3"
		img-width="1920"
		img-height="900"
		v-if="share.imageList.length > 0"
	>
		<b-carousel-slide
			style="border-radius:10px;overflow:hidden"
			v-for="(image, index) in share.imageList"
			:key="index"
		>
			<template #img>
				<b-link :href="image">
					<b-aspect
						class="w-100"
						aspect="16:9"
						style="background-size: cover;background-color: #ccc;background-position:center"
						:style="{
							'background-image': `url(/api/image/${image}/image.png)`
						}"
					></b-aspect>
				</b-link>
			</template>
		</b-carousel-slide>
	</b-carousel>

	<h4 class="mt-4 font-weight-bold">{{ share.title }}</h4>

	<pre>{{ share.raw }}</pre>

	<b-button-toolbar class="mt-3">
		<b-button
			pill
			size="sm"
			style="bacmground-color:#E3F0F2;color:#74B1BE"
			:to="{ name: 'Home' }"
			class="mr-auto"
		><span class="font-weight-bold mr-1">#</span>我来博物馆打卡</b-button>

		<b-button
			variant="link"
		><b-icon-heart class="mr-1" />{{ share.like }}</b-button>
	</b-button-toolbar>
</div>

</template>

<script>
export default {
	data() {
		return {
			customer: {
				nickname: '',
				cityAs: '',
				headimgurl: ''
			},
			share: {
				imageList: [],
				title: '',
				raw: '',
				like: 0
			}
		};
	},
	methods: {
		async getShare() {
			const share = await this.$app.Api.Share(this.$route.params.shareId).get();

			this.customer.cityAs = share.createdBy.cityAs;
			this.customer.nickname = share.createdBy.nickname;
			this.customer.headimgurl = share.createdBy.headimgurl;

			this.share.title = share.title;
			this.share.raw = share.raw;
			this.share.imageList = share.imageList;
			this.share.like = share.like;
		}
	},
	mounted() {
		this.getShare();
	}
};
</script>

<style>

</style>
