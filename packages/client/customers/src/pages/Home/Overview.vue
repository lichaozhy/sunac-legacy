<template>

<div
	id="app-home-overview"
	class="px-2 position-relative"
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
		style="right: 0.75em;top: 0.25em;background:rgba(0,0,0,0.3);border-radius: 20px"
		:to="{ name: 'Location' }"
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
						class="w-100 h-100 position-relative app-reference"
						:style="{'background-image': `url(${referenceList[0].thumbUrl})`}"
					>
						<div class="w-100 app-reference-title">{{ referenceList[0].title }}</div>
					</div>
				</b-link>
			</b-col>
			<b-col cols="7" class="pl-1">
				<div class="h-50 pb-1">
					<b-link
						:to="{ name: 'Photo' }"
					>
						<div
							class="w-100 h-100 position-relative app-reference"
							:style="{'background-image': `url(${referenceList[1].thumbUrl})`}"
						>
							<div class="w-100 app-reference-title">{{ referenceList[1].title }}</div>
						</div>
					</b-link>
				</div>
				<div class="h-50 pt-1">
					<b-link
						:to="{ name: 'Photo' }"
					>
						<div
							class="w-100 h-100 position-relative app-reference"
							:style="{'background-image': `url(${referenceList[2].thumbUrl})`}"
						>
							<div class="w-100 app-reference-title">{{ referenceList[2].title }}</div>
						</div>
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

	<b-nav class="mt-3 font-weight-bold app-home-share-nav">
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
		async getBannerList() {
			this.bannerList = await this.$app.Api.Banner.query();
		},
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
			this.getBannerList();
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

	.app-home-share-nav {
		a {
			color: #000;
			position: relative;

			&.active {
				transform: scale(1.2);

				&::before {
					content: ' ';
					display: block;
					position: absolute;
					height: 6px;
					background: #ccc;
					width: 60px;
					left: 50%;
					bottom: 8px;
					z-index: -1;
					margin-left: -30px;
					background-image: linear-gradient(to right, #FFFFFF, #74B1BE, #FFFFFF);
				}
			}
		}
	}
}

</style>
