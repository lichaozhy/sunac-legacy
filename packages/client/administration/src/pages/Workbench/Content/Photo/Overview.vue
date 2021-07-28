<template>

<div>
	<h4>相片总览</h4><hr>

	<b-button-toolbar>
		<b-form-input
			v-model="keyword"
			class="mr-0"
			style="width: 12em"
			placeholder="请输入标题关键字"
		/>
		<b-button
			variant="primary"
			class="mr-auto"
			@click="getPhotoList"
		>搜索</b-button>

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
		<b-col
			v-for="photo in photoList"
			:key="photo.id"
			cols="3"
			class="mt-3"
		>
			<b-card no-body footer-class="p-1">
				<b-aspect
					aspect="4:3"
					style="background-color: #f0f0f0; background-size: cover; background-position: center"
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
				photoList: []
			},
			keyword: '',
			pagination: {
				current: 1,
				total: 100,
				size: 20
			},
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
					like: photo.like,
					createdAt: photo.createdAt
				};
			});
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
			const { list, total } = await this.$app.Api.Photo.query({
				title: this.keyword,
				pageSize: this.pagination.size,
				pageCurrent: this.pagination.current
			});

			this.meta.photoList = list;
			this.pagination.total = total;
		}
	},
	mounted() {
		this.getPhotoList();
	}
};
</script>

<style>

</style>
