<template>

<div
	id="app-home-overview"
	class="p-2 position-relative"
>
	<b-carousel
		indicators
		style="
			border-radius:10px;
			box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.5)
		"
		img-width="1920"
		img-height="900"
	>
		<b-carousel-slide
			style="border-radius:10px;overflow:hidden"
			v-for="banner in bannerList"
			:key="banner.id"
		>
			<template #img>
				<b-aspect
					class="w-100"
					aspect="16:9"
					style="background-size: cover;background-color: #ccc"
					:style="{
						'background-image': `url(/api/image/${banner.image}/image.png)`
					}"
				></b-aspect>
			</template>
		</b-carousel-slide>
	</b-carousel>

	<b-button
		variant="link"
		class="position-absolute text-white"
		style="right: 1em;top: 1em;background:rgba(0,0,0,0.3);border-radius: 20px"
		:to="{ name: 'Location' }"
	><b-icon-geo-alt-fill
		class="mr-1"
	/>{{ cityMap[cityAs] && cityMap[cityAs].name }}</b-button>

	<b-aspect
		class="mt-4"
		aspect="16:9"
	>
		<b-row
			no-gutters
			class="h-100"
		>
			<b-col cols="5" class="pr-1">
				<div
					class="w-100 h-100 position-relative app-reference"
					:style="{'background-image': `url(${referenceList[0].thumbUrl})`}"
				>
					<div class="w-100 app-reference-title">{{ referenceList[0].title }}</div>
				</div>
			</b-col>
			<b-col cols="7" class="pl-1">
				<div class="h-50 pb-1">
					<div
						class="w-100 h-100 position-relative app-reference"
						:style="{'background-image': `url(${referenceList[1].thumbUrl})`}"
					>
						<div class="w-100 app-reference-title">{{ referenceList[1].title }}</div>
					</div>
				</div>
				<div class="h-50 pt-1">
					<div
						class="w-100 h-100 position-relative app-reference"
						:style="{'background-image': `url(${referenceList[2].thumbUrl})`}"
					>
						<div class="w-100 app-reference-title">{{ referenceList[2].title }}</div>
					</div>
				</div>
			</b-col>
		</b-row>
	</b-aspect>
</div>

</template>

<script>
export default {
	data() {
		return {
			cityList: [],
			referenceList: [
				{ id: null, title: '数量不足', thumbUrl: '' },
				{ id: null, title: '数量不足', thumbUrl: '' },
				{ id: null, title: '数量不足', thumbUrl: '' },
			],
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
		async getBannerList() {
			this.bannerList = await this.$app.Api.Banner.query();
		},
		async getReferenceList() {
			const { list } = await this.$app.Api.Reference.query({ from: 0, size: 3});

			this.referenceList = new Array(3).fill(null).map((_, index) => {
				const reference = list[index];

				if (reference) {
					return {
						id: reference.id,
						title: reference.title,
						thumbUrl: `/api/image/${reference.thumb}/image.png`
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
			this.getBannerList();
			this.getReferenceList();
			this.getCustomer();
		}
	},
	mounted() {
		this.getCityList();
		this.refresh();
	},
	beforeRouteUpdate() {
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

#app-home-overview {
	.carousel-indicators {
		bottom: -40px;

		li {
			width: 6px;
			height: 6px;
			border-radius: 100%;
			background-color: #999;

			&.active {
				width: 12px;
				border-radius: 50%/100%;
				background-color: #4E4B78;
			}
		}
	}
}

</style>
