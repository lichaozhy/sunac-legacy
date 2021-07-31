<template>

<div>
	<h4>城市BANNER</h4><hr>

	<b-button-toolbar>
		<b-input-group
			prepend="城市"
			class="mr-auto"
		>
			<b-form-select
				:options="cityOptionList"
				style="width: 6em"
				v-model="form.city"
				@input="getBannerList"
			></b-form-select>
		</b-input-group>
	</b-button-toolbar>

	<b-form-row class="mt-3">
		<b-col
			v-for="banner in meta.bannerList"
			:key="banner.id"
			cols="6"
			xxl="4"
			class="mb-3"
		>
			<b-card
				no-body
				footer-class="p-1"
				class="position-relative app-banner-item"
			>
				<div
					class="position-absolute"
					style="top: 10px; left: 10px; text-shadow: 0 0 2px #000; color:#fff"
				><b-button
					@click="deleteBannerById(banner.id)"
					variant="danger"
				><b-icon-trash /></b-button></div>
				<b-aspect
					aspect="16:9"
					class="app-banner-thumb"
					style="background-color: #f0f0f0; cursor: pointer"
					:style="{
						'background-image': `url(/api/image/${banner.image}/image.png)`
					}"
				>
				</b-aspect>
			</b-card>
		</b-col>
		<b-col
			cols="6"
			xxl="4"
			v-if="meta.bannerList.length < 6"
		>
			<b-card no-body>
				<b-aspect
					@click.native="browseFile"
					aspect="16:9"
					class="text-center"
					style="background-color: #f0f0f0; cursor: pointer"
				>
					<p class="mt-5">继续追加该城市的BANNER</p>
					<b-form-text>提供接近约16:9尺寸比例的图片</b-form-text>
				</b-aspect>
			</b-card>
		</b-col>
	</b-form-row>
	<b-form-file
		class="m-0 p-0"
		ref="browser"
		accept="image/*"
		style="width:0;height:0;overflow:hidden"
		v-model="form.image"
		@change="createBanner"
	></b-form-file>
</div>

</template>

<script>
export default {
	data() {
		return {
			meta: {
				cityList: [],
				managedCityList: [],
				bannerList: []
			},
			form: {
				image: null,
				city: null,
			}
		};
	},
	computed: {
		cityOptionList() {
			return this.meta.managedCityList.map(adcode => {
				const city = this.meta.cityList.find(city => city.adcode === adcode);

				return { text: city.name, value: city.adcode };
			});
		}
	},
	methods: {
		browseFile() {
			this.$refs.browser.$el.querySelector('input').click();
		},
		async getBannerList() {
			this.meta.bannerList = await this.$app.Api.Banner.query({
				city: this.form.city
			});
		},
		async getAllCityList() {
			this.meta.cityList = await this.$app.Api.City.query();
		},
		async getAdministrator() {
			const { cityList } = await this.$app.Api.Principal.Administrator.get();

			this.meta.managedCityList = cityList;
		},
		async createBanner(event) {
			const formData = new FormData();

			formData.append('image', event.target.files[0]);

			const image = await this.$app.Api.Image.create(formData);

			await this.$app.Api.Banner.create({
				city: this.form.city,
				image: image.id
			});

			this.getBannerList();
		},
		async deleteBannerById(bannerId) {
			await this.$app.Api.Banner(bannerId).delete();
			this.getBannerList();
		}
	},
	async mounted() {
		await this.getAllCityList();
		await this.getAdministrator();
		this.form.city = this.meta.managedCityList[0];
		this.getBannerList();
	}
};
</script>

<style>
@keyframes expanding {
  from {
		transform: scale(1);
	}

  to {
		transform: scale(1.02);
	}
}

.app-banner-item:hover {
	animation: expanding 0.3s;
	transform: scale(1.02);
}

.app-banner-thumb {
	background-position: center;
	background-size: cover;
}
</style>
