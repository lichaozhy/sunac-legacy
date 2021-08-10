<template>

<div id="app-share-detail" class="px-2 pb-5 pt-2">
	<b-button-toolbar>
		<div class="mr-auto d-flex">
			<b-avatar class="mr-2" :src="customer.headimgurl" />
			<div class="d-flex flex-column adjust-content-center">
				<div>{{ customer.nickname }}</div>
				<b-form-text class="mt-0">{{ cityName }}</b-form-text>
			</div>
		</div>
		<b-button
			variant="link"
			class="text-dark"
			@click="$store.commit('openShareing')"
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
				<b-aspect
					class="w-100"
					aspect="16:9"
					style="background-size: cover;background-color: #ccc;background-position:center"
					:style="{
						'background-image': `url(/api/image/${image}/image.png)`
					}"
				></b-aspect>
			</template>
		</b-carousel-slide>
	</b-carousel>

	<h4 class="mt-4 font-weight-bold">{{ share.title }}</h4>

	<pre
		style="white-space:break-spaces"
	>{{ share.raw }}</pre>

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
			:disabled="likedMap[share.id]"
			@click="like"
		><b-icon-heart
			class="mr-1"
			v-if="!likedMap[share.id]"
		/><b-icon-heart-fill
			class="mr-1"
			v-if="likedMap[share.id]"
		/>{{ share.like }}</b-button>
	</b-button-toolbar>
</div>

</template>

<script>
export default {
	data() {
		return {
			cityList: [],
			likedMap: {},
			customer: {
				nickname: '',
				cityAs: '',
				headimgurl: ''
			},
			share: {
				id: '',
				imageList: [],
				title: '',
				raw: '',
				like: 0
			}
		};
	},
	computed: {
		cityName() {
			const city = this.cityList.find(city => city.adcode === this.customer.cityAs);

			return city ? city.name : this.customer.cityAs;
		}
	},
	methods: {
		setSharing() {
			const baseOptions = {
				title: this.share.title,
				imgUrl: `${location.origin}/api/image/${this.share.imageList[0]}/image.png`,
				link: `${location.origin}/api/wechat/share?shareType=share&shareItemId=${this.share.id}`
			};

			this.$wx.updateTimelineShareData(baseOptions);
			this.$wx.updateAppMessageShareData(Object.assign({
				desc: '欢迎访问“我的非遗圈作品”了解更多中国非遗文化...'
			}, baseOptions));
		},
		async getShare() {
			const share = await this.$app.Api.Share(this.$route.params.shareId).get();

			this.customer.cityAs = share.createdBy.cityAs;
			this.customer.nickname = share.createdBy.nickname;
			this.customer.headimgurl = share.createdBy.headimgurl;

			this.share.id = share.id;
			this.share.title = share.title;
			this.share.raw = share.raw;
			this.share.imageList = share.imageList;
			this.share.like = share.like;

			this.setSharing();
		},
		async like() {
			await this.$app.Api.Share(this.share.id).like();
			this.share.like++;
			this.getLiked();
		},
		async getLiked() {
			const list = await this.$app.Api.Customer.TodayLiked.query();

			list.forEach(like => this.$set(this.likedMap, like.share, true));
		},
		async getCityList() {
			this.cityList = await this.$app.Api.City.query();
		},
	},
	mounted() {
		this.getLiked();
		this.getCityList();
		this.getShare();
	}
};
</script>
