<template>

<div
	id="app-home-overview"
	class="px-2 pt-2 position-relative"
>
	<b-carousel
		class="app-carousel"
		indicators
		img-width="1920"
		img-height="900"
	>
		<b-carousel-slide
			style="border-radius:10px;overflow:hidden"
			v-for="reference in referenceList"
			:key="reference.id"
		>
			<template #img>
				<b-link :href="reference.href">
					<b-aspect
						class="w-100"
						aspect="16:9"
						style="background-size: cover;background-color: #ccc;background-position:center"
						:style="{
							'background-image': `url(${reference.thumbUrl})`
						}"
					></b-aspect>
				</b-link>
			</template>
		</b-carousel-slide>
	</b-carousel>

	<b-button
		variant="link"
		class="position-absolute text-white"
		style="right: 0.75em;top: 1em;background:rgba(0,0,0,0.3);border-radius: 20px"
		@click="$store.commit('openLocation')"
	><b-icon-geo-alt-fill
		class="mr-1"
	/>{{ cityMap[cityAs] && cityMap[cityAs].name }}</b-button>

	<b-aspect
		class="position-relative"
		aspect="16:9"
		style="margin-top: 30px"
	>
		<b-row
			no-gutters
			class="h-100"
		>
			<b-col cols="5" class="pr-1">
				<b-link :to="{ name: 'Topic' }">
					<div
						class="w-100 h-100 position-relative app-reference app-background-center"
						style="background-image:url(/static/image/topic.png);background-size: 113%"
					></div>
				</b-link>
			</b-col>
			<b-col cols="7" class="pl-1">
				<div class="h-50 pb-1">
					<b-link :to="{ name: 'Figure' }">
						<div
							class="w-100 h-100 position-relative app-reference app-background-center"
							style="background-image:url(/static/image/figure.png);background-size: 105%"
						></div>
					</b-link>
				</div>
				<div class="h-50 pt-1">
					<b-link :to="{ name: 'Photo' }">
						<div
							class="w-100 h-100 position-relative app-reference app-background-center"
							style="background-image:url(/static/image/photo.png);background-size: 105%"
						></div>
					</b-link>
				</div>
			</b-col>
		</b-row>

		<b-img
			src="./image/heading.png"
			class="position-absolute"
			style="height:1.5em;top:0;left:0"
		/>
	</b-aspect>

	<b-nav class="mt-3 font-weight-bold app-nav">
		<b-nav-item
			:to="{ name: 'Home.Share.Overview' }"
		>非遗圈</b-nav-item>
		<b-nav-item
			:to="{ name: 'Home.Share.Ranking' }"
		>排行榜</b-nav-item>
	</b-nav>
</div>

</template>

<script>
export default {
	data() {
		return {
			cityList: [],
			referenceList: new Array(5).fill(null).map(() => {
				return { id: null, title: '数量不足', thumbUrl: '', href: '' };
			}),
			bannerList: [],
			cityAs: null
		};
	},
	computed: {
		cityMap() {
			const map = {};

			this.cityList.forEach(city => map[city.adcode] = city);

			return map;
		}
	},
	methods: {
		async getReferenceList() {
			const { list } = await this.$app.Api.Reference.query({ from: 0, size: this.referenceList.length});

			this.referenceList = new Array(this.referenceList.length).fill(null).map((_, index) => {
				const reference = list[index];

				if (reference) {
					return {
						id: reference.id,
						title: reference.title,
						thumbUrl: `/api/image/${reference.thumb}/image.png`,
						href: reference.href
					};
				} else {
					return { id: null, title: '数量不足', thumbUrl: '' };
				}
			});
		},
		async getCityList() {
			this.cityList = await this.$app.Api.City.query();
		},
		async getCustomer() {
			const customer = await this.$app.Api.Customer.get();

			this.cityAs = customer.cityAs;
		},
		refresh() {
			this.getReferenceList();
			this.getCustomer();
		}
	},
	mounted() {
		this.getCityList();
		this.refresh();
	}
};
</script>

<style lang="scss">
.app-reference {
	border-radius: 5px;
	overflow: hidden;
	background-size: cover;

	.app-reference-title {
		color: #fff;
		background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1));
		padding: 5px 10px 10px 10px;
		position: absolute;
		bottom: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}
</style>
