<template>

<div>
	<h4>相片总览</h4><hr>

	<b-button-toolbar>
		<b-form-input
			v-model="keyword"
			class="mr-0"
			style="width: 9em"
			placeholder="标题关键字"
		/>
		<b-button
			variant="primary"
			class="mr-auto"
			@click="getPhotoList"
		>搜索</b-button>

		<b-input-group
			prepend="城市"
			class="mr-auto"
		>
			<b-form-select
				:options="cityOptionList"
				style="width: 6em"
				v-model="city"
				@input="getPhotoList"
			></b-form-select>
		</b-input-group>

		<b-pagination
			v-model="pagination.current"
			:per-page="pagination.size"
			:total-rows="pagination.total"
			size="sm"
			class="mb-0 mr-auto"
		></b-pagination>

		<b-button
			@click="requestCreatingPhoto"
			variant="success"
		>创建</b-button>
	</b-button-toolbar>

	<b-row>
		<b-col cols="3" class="mt-3" v-if="photoList.length === 0">
			<b-card no-body footer-class="p-1 text-center" footer="您可以创建新照片">
				<b-aspect
					@click.native="requestCreatingPhoto"
					aspect="4:3"
					class="text-center"
					style="background-color: #f0f0f0; cursor: pointer"
				><p>没有找到符合要求的照片</p><p>点击上传</p></b-aspect>
			</b-card>
		</b-col>

		<b-col
			v-for="photo in photoList"
			:key="photo.id"
			cols="3"
			class="mt-3"
		>
			<b-card
				no-body
				footer-class="p-1"
				class="position-relative app-photo-item"
			>
				<div
					class="position-absolute"
					style="top: 10px; left: 10px; text-shadow: 0 0 2px #000; color:#fff"
				>{{ photo.city }}</div>
				<b-aspect
					aspect="4:3"
					class="app-photo-thumb"
					style="background-color: #f0f0f0; cursor: pointer"
					:style="{
						'background-image': `url(${photo.src})`
					}"
					title="查看大尺寸"
					@click.native="requestPreviewer(photo.src)"
				>
				</b-aspect>

				<template #footer>
					<div><small>{{ photo.title }}</small></div>
					<b-button-toolbar class="align-items-center">
						<div
							class="text-right mr-auto"
						><small>{{ photo.createdAt | localDatetime }}</small></div>
						<b-button
							variant="danger"
							@click="deletePhoto(photo.id)"
						><b-icon-trash /></b-button>
					</b-button-toolbar>
				</template>
			</b-card>
		</b-col>
	</b-row>

	<app-photo-creation
		ref="creation"
		@created="getPhotoList"
	/>

	<b-modal
		ref="previewer"
		@hidden="resetPreviewer"
		size="lg"
		title="查看大尺寸"
		hide-footer
		centered
	>
		<b-link
			:href="previewer.src"
			target="__blank"
		>
			<b-img
				class="w-100"
				:src="previewer.src"
			></b-img>
		</b-link>
	</b-modal>
</div>

</template>

<script>
import Creation from './Creation.vue';

export default {
	components: { AppPhotoCreation: Creation },
	data() {
		return {
			meta: {
				cityList: [],
				photoList: [],
				managedCityList: []
			},
			keyword: '',
			pagination: {
				current: 1,
				total: 100,
				size: 20
			},
			city: null,
			selectedId: null,
			previewer: {
				src: ''
			}
		};
	},
	watch: {
		'pagination.current'() {
			this.getPhotoList();
		}
	},
	computed: {
		photoList() {
			return this.meta.photoList.map(photo => {
				return {
					id: photo.id,
					title: photo.title,
					src: `/api/image/${photo.image}/image.png`,
					city: this.meta.cityList.find(city => city.adcode === photo.city).name,
					like: photo.like,
					createdAt: photo.createdAt
				};
			});
		},
		cityOptionList() {
			const managedCityOptionList = this.meta.managedCityList.map(adcode => {
				const city = this.meta.cityList.find(city => city.adcode === adcode);

				return { text: city.name, value: city.adcode };
			});

			return [{ text: '全部', value: null }].concat(managedCityOptionList);
		}
	},
	methods: {
		requestCreatingPhoto() {
			this.$refs.creation.open();
		},
		requestPreviewer(src) {
			this.previewer.src = src;
			this.$refs.previewer.show();
		},
		resetPreviewer() {
			this.previewer.src = '';
		},
		async deletePhoto(photoId) {
			await this.$app.Api.Photo(photoId).delete();
			this.getPhotoList();
		},
		async getPhotoList() {
			const query = {
				title: this.keyword,
				pageSize: this.pagination.size,
				pageCurrent: this.pagination.current
			};

			if (this.city !== null) {
				query.city = this.city;
			}

			const { list, total } = await this.$app.Api.Photo.query(query);

			this.meta.photoList = list;
			this.pagination.total = total;
		},
		async getAllCityList() {
			this.meta.cityList = await this.$app.Api.City.query();
		},
		async getAdministrator() {
			const { cityList } = await this.$app.Api.Principal.Administrator.get();

			this.meta.managedCityList = cityList;
		},
	},
	async mounted() {
		await this.getAllCityList();
		await this.getAdministrator();
		this.getPhotoList();
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

.app-photo-item:hover {
	animation: expanding 0.3s;
	transform: scale(1.02);
}

.app-photo-thumb {
	background-position: center;
	background-size: cover;
}
</style>
