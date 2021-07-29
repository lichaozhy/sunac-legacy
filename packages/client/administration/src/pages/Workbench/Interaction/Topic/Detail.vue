<template>

<b-modal
	ref="modal"
	centered
	size="lg"
	dialog-class="app-topic-detail"
	:title="`主题 - ${topic.title}`"
	hide-footer
>
	<b-row class="h-100">
		<b-col cols="3">
			<b-card
				no-body
				footer-class="py-1 px-2"
				class="position-relative app-topic-item justify-content-between"
			>
				<div
					class="position-absolute"
					style="top: 10px; left: 10px; background: rgba(0,0,0,0.3); color:#fff"
				>{{ cityMap[topic.city] && cityMap[topic.city].name }}</div>

				<b-aspect
					aspect="16:9"
					class="app-photo-thumb"
					style="background-color: #f0f0f0; cursor: pointer"
					:style="{
						'background-image': `url(/api/image/${topic.banner}/image.png)`
					}"
				>
				</b-aspect>

				<div class="p-3">
					<p>{{ topic.description }}</p>
					<b-button-toolbar class="align-items-center">
						<div
							class="text-right mr-auto"
						><small>{{ topic.createdAt | localDatetime }}</small></div>
						<div>
							<b-avatar
								:src="topic.createdBy.headimgurl"
								size="sm"
								class="mr-1"
							/><small>{{ topic.createdBy.nickname }}</small>
						</div>
					</b-button-toolbar>
				</div>

			</b-card>
		</b-col>
		<b-col cols="5">
			<b-tabs pills nav-wrapper-class="pb-3">
				<b-tab title="审查回复">
					<b-pagination
						v-model="pagination.current"
						:per-page="pagination.size"
						:total-rows="pagination.total"
						size="sm"
						class="mb-0 mx-auto"
						limit="4"
					></b-pagination>

					<b-table
						class="mt-3"
						ref="table"
						:fields="postFieldList"
						:items="postList"
						small
						bordered
						:per-page="pagination.size"
						:current-page="pagination.current"
						show-empty
						select-mode="single"
						selectable
						@row-selected="setSelectedId"
						hover
						:busy="isBusy"
					>
						<template #empty>无回复</template>

						<template #cell(validated)="row">
							{{ row.item.validatedAt === null ? '' : '√' }}
						</template>

						<template #cell(abstract)="row">
							{{ row.item.raw.substr(0, 20) }}
						</template>

						<template #cell(images)="row">
							{{ row.item.imageList.length }}
						</template>
					</b-table>
				</b-tab>
				<b-tab title="编辑回复">
					<b-form-textarea
						placeholder="编辑回复文本"
						style="height:9em"
						no-resize
						v-model="form.raw"
					></b-form-textarea>

					<b-form-group
						class="mt-3"
						:label="`图片(${form.imageList.length}/9)`"
					>
						<b-form-row>
							<b-col
								class="mb-3 position-relative"
								cols="4"
								v-for="(imageUrl, index) in form.imageUrlList"
								:key="index"
							>
								<b-aspect
									aspect="1:1"
									class="border"
									style="background-size: cover; background-position: center"
									:style="{
										'background-image': `url(${imageUrl})`
									}"
								></b-aspect>

								<b-button
									class="position-absolute p-1"
									style="top: .5em;right: 1em;font-size:12px"
									variant="danger"
									@click="deleteImageByIndex(index)"
								><b-icon-trash /></b-button>
							</b-col>

							<b-col
								class="mb-3"
								cols="4"
								v-if="form.imageList.length < 9"
							>
								<b-aspect
									aspect="1:1"
								><b-button
									block
									@click="browseFile"
									class="h-100"
								><b>加图片</b></b-button></b-aspect>
							</b-col>
						</b-form-row>
						<b-button
							variant="success"
							@click="createPost"
							block
						>回复</b-button>
					</b-form-group>
				</b-tab>
			</b-tabs>
		</b-col>
		<b-col cols="4">
			<div v-if="selectedId === null">
				<b-skeleton width="85%"></b-skeleton>
				<b-skeleton width="55%"></b-skeleton>
				<b-skeleton width="70%"></b-skeleton>
				<b-skeleton-img></b-skeleton-img>
			</div>

			<div v-if="selectedId !== null">
				<b-button-toolbar class="mb-3" v-if="selectedId !== null">
					<b-button
						variant="primary"
						@click="validatePost(selectedPost.id)"
						class="mr-auto"
						:disabled="!canValidate"
					>审核</b-button>
					<b-button
						variant="danger"
						@click="deletePost(selectedPost.id)"
						:disabled="!managedCityMap[topic.city]"
					>删除</b-button>
				</b-button-toolbar>

				<b-form-textarea
					style="height:9em"
					no-resize
					readonly
					:value="selectedPost.raw"
				></b-form-textarea>

				<b-form-row class="mt-3">
					<b-col
						class="mb-3 position-relative"
						cols="4"
						v-for="post in selectedPost.imageList"
						:key="post.id"
					>
						<b-link
							:href="`/api/image/${post.image}/image.png`"
							target="__blank"
						>
							<b-aspect
								aspect="1:1"
								class="border"
								style="background-size: cover; background-position: center"
								:style="{
									'background-image': `url(/api/image/${post.image}/image.png)`
								}"
							></b-aspect>
						</b-link>
					</b-col>
				</b-form-row>
			</div>
		</b-col>
	</b-row>
	<b-form-file
		class="m-0 p-0"
		ref="browser"
		accept="image/*"
		@input="setImageUrl"
		style="width:0;height:0;overflow:hidden"
	></b-form-file>
</b-modal>

</template>

<script>
function Topic() {
	return {
		id: '',
		title: '',
		description: '',
		city: '',
		banner: '',
		createdAt: new Date(0),
		validatedAt: null,
		createdBy: {
			id: '',
			nickname: '',
			headimgurl: ''
		}
	};
}

export default {
	data() {
		return {
			topic: Topic(),
			form: {
				raw: '',
				imageList: [],
				imageUrlList: [],
				managedCityList: []
			},
			meta: {
				cityList: [],
				postList: []
			},
			pagination: {
				current: 1,
				total: 100,
				size: 20
			},
			isBusy: true,
			selectedId: null,
		};
	},
	computed: {
		managedCityMap() {
			const map = {};

			this.meta.managedCityList.forEach(adcode => map[adcode] = true);

			return map;
		},
		canValidate() {
			return this.meta.managedCityList.some(adcode => adcode === this.topic.city) &&
				this.topic.validatedAt === null;
		},
		cityMap() {
			const map = {};

			this.meta.cityList.forEach(city => map[city.adcode] = city);

			return map;
		},
		postFieldList() {
			return [
				{ key: 'validated', label: '审核?', class: 'col-tiny-string' },
				{ key: 'abstract', label: '摘要' },
				{ key: 'images', label: '图' }
			];
		},
		postList() {
			return this.meta.postList.map(post => {
				return {
					id: post.id,
					raw: post.raw,
					imageList: post.imageList,
					createdAt: post.createdAt,
					validatedAt: post.validatedAt,
					createdBy: {
						id: post.createdBy.id,
						nickname: post.createdBy.nickname,
						headimgurl: post.createdBy.headimgurl
					}
				};
			});
		},
		selectedPost() {
			if (this.selectedId === null) {
				return null;
			}

			return this.postList.find(post => post.id === this.selectedId);
		}
	},
	methods: {
		setSelectedId(rows) {
			this.selectedId = rows.length > 0 ? rows[0].id : null;
		},
		browseFile() {
			this.$refs.browser.$el.querySelector('input').click();
		},
		deleteImageByIndex(index) {
			this.form.imageList.splice(index, 1);
			this.form.imageUrlList.splice(index, 1);
		},
		setImageUrl(file) {
			const reader = new FileReader();

			this.form.imageList.push(file);
			reader.addEventListener('load', () => this.form.imageUrlList.push(reader.result));
			reader.readAsDataURL(file);
		},
		async getAllCityList() {
			this.meta.cityList = await this.$app.Api.City.query();
		},
		async open(topicId) {
			this.$refs.modal.show();

			const topic = await this.$app.Api.Topic(topicId).get();

			this.topic.id = topic.id;
			this.topic.title = topic.title;
			this.topic.description = topic.description;
			this.topic.city = topic.city;
			this.topic.banner = topic.banner;
			this.topic.createdAt = topic.createdAt;
			this.topic.validatedAt = topic.validatedAt;
			this.topic.createdBy.id = topic.createdBy.id;
			this.topic.createdBy.nickname = topic.createdBy.wechat.nickname;
			this.topic.createdBy.headimgurl = topic.createdBy.wechat.headimgurl;

			this.isBusy = false;
			this.refreshTable();
		},
		async createPost() {
			const imageList = [];

			for (const image of this.form.imageList) {
				const formData = new FormData();

				formData.append('image', image);
				imageList.push(await this.$app.Api.Image.create(formData));
			}

			try {
				await this.$app.Api.Topic(this.topic.id).Post.create({
					raw: this.form.raw,
					imageList: imageList.map(image => image.id)
				});

				this.$bvToast.toast('回复成功', { variant: 'success' });
				this.form.raw = '';
				this.form.imageList = [];
				this.form.imageUrlList = [];
				this.refreshTable();
			} catch (err) {
				this.$bvToast.toast('回复失败', { variant: 'danger' });
			}
		},
		async validatePost(postId) {
			await this.$app.Api.Topic(this.topic.id).Post(postId).update();
			this.refreshTable();
		},
		async deletePost(postId) {
			await this.$app.Api.Topic(this.topic.id).Post(postId).delete();
			this.refreshTable();
		},
		async refreshTable() {
			this.selectedId = null;

			const query = {
				pageSize: this.pagination.size,
				pageCurrent: this.pagination.current
			};

			const { list, total } = await this.$app.Api.Topic(this.topic.id).Post.query(query);

			this.meta.postList = list;
			this.pagination.total = total;
		},
		reset() {
			this.topic = Topic();
		},
		async getAdministrator() {
			const { cityList } = await this.$app.Api.Principal.Administrator.get();

			this.meta.managedCityList = cityList;
		},
	},
	async mounted() {
		this.meta.cityList = await this.$app.Api.City.query();
		this.getAdministrator();
	}
};
</script>

<style lang="scss">
.app-topic-detail.modal-dialog {
	max-width: none;

	.modal-body {
		min-height: 600px;
	}
}

.app-topic-detail {
	width: 80%;
}
</style>
