<template>

<div id="app-photo" class="overflow-auto h-100 pb-5">
	<b-img src="./image/banner.png" class="w-100"></b-img>

	<b-nav class="mt-3 font-weight-bold app-nav flex-nowrap text-nowrap w-100 overflow-auto">
		<b-nav-item
			v-for="city in cityList"
			:key="city.adcode"
			:active="currentCity === city.adcode"
			@click="selectCity($event, city.adcode)"
		>{{ city.name }}</b-nav-item>
	</b-nav>

	<div class="mt-3 px-2">
		<vue-masonry-wall
			:items="photoList"
			:options="{width: 200, padding: 5}"
			@append="append"
		>
			<template v-slot:default="{item, index}">
				<b-card
					no-body
					footer-class="px-2 py-1"
					footer-bg-variant="white"
					v-if="item"
					style="border-radius:6px;overflow:hidden;box-shadow:1px 1px 6px 0 rgba(0,0,0,0.2)"
				>
					<b-img
						class="w-100"
						@click="previewPhoto(index)"
						:src="`/api/image/${item.image}/image.png`"
					/>

					<template #footer>
						<div
							style="font-size:14px"
							class="mb-1 font-weight-bold py-1"
						>{{ item.title | substring }}</div>
						<b-button-toolbar>
							<b-button
								size="sm"
								variant="link"
								class="ml-auto mr-1"
							><b-icon-share /></b-button>
							<b-button
								size="sm"
								variant="link"
								@click="likePhotoByIndex(index)"
							><b-icon-heart class="mr-1" />{{ item.like }}</b-button>
						</b-button-toolbar>
					</template>
				</b-card>
			</template>
		</vue-masonry-wall>
	</div>

	<b-modal
		ref="previewer"
		hide-footer
		hide-header
		content-class="my-5"
		@hidden="resetPreviewer"
		centered
		body-class="p-0"
	>
		<b-img class="w-100" :src="selected.image" @click="$refs.previewer.hide()" />
		<b-button-toolbar>
			<b-button
				variant="dark"
				class="w-50"
				size="lg"
			><b-icon-share /></b-button>

			<b-button
				variant="dark"
				class="w-50"
				size="lg"
				@click="likePhotoByIndex(selected.index)"
			><b-icon-heart
				class="mr-1"
			/>{{ selected.like }}</b-button>
		</b-button-toolbar>
	</b-modal>

	<div
		v-if="total <= photoList.length"
		class="text-center mt-5"
	>
		<b-form-text>已经到底啦</b-form-text>
	</div>
</div>

</template>

<script>
import VueMasonryWall from 'vue-masonry-wall';

export default {
	components: { VueMasonryWall },
	data() {
		return {
			lastUpdatedAt: new Date(),
			photoList: [],
			cityList: [],
			currentCity: '310000',
			total: 0,
			selected: {
				id: '',
				image: '',
				like: '',
				index: ''
			}
		};
	},
	filters: {
		substring(string) {
			return string.length < 10 ? string : (string.substr(0, 10) + '...');
		}
	},
	methods: {
		async append() {
			if (this.photoList.length < this.total) {
				await this.getPhotoList();
			}
		},
		async getPhotoList() {
			const from = this.photoList.length;

			const { total, list } = await this.$app.Api.Photo.query({
				city: this.currentCity,
				from: from,
				size: 10,
				createdAt: this.lastUpdatedAt
			});

			this.total = total;
			list.forEach((photo) => this.photoList.push(photo));
		},
		async likePhotoByIndex(index) {
			const photo = this.photoList[index];
			const { like } = await this.$app.Api.Photo(photo.id).like();

			photo.like = like;

			if (this.selected.index !== '') {
				this.selected.like = like;
			}
		},
		async getCityList() {
			this.cityList = await this.$app.Api.City.query();
		},
		previewPhoto(index) {
			const photo = this.photoList[index];

			this.selected.id = photo.id;
			this.selected.index = index;
			this.selected.image = `/api/image/${photo.image}/image.png`;
			this.selected.like = photo.like;
			this.$refs.previewer.show();
		},
		resetPreviewer() {
			this.selected.id = '';
			this.selected.index = '';
			this.selected.image = '';
			this.selected.like = '';
		},
		refresh() {
			this.lastUpdatedAt = new Date();
			this.photoList = [];
			this.getPhotoList();
		},
		selectCity(event, adcode) {
			this.currentCity = adcode;
			event.target.scrollIntoView();
			this.refresh();
		}
	},
	mounted() {
		this.refresh();
		this.getCityList();
	}
};
</script>

<style>

</style>
