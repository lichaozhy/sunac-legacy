<template>

<b-modal
	ref="modal"
	size="lg"
	centered
	title="更新非遗人档案"
	ok-title="更新"
	ok-variant="primary"
	cancel-title="取消"
	@ok="update"
	@show="get"
>
	<b-form>
		<b-form-row>
			<b-col
				cols="4"
				v-for="field in profileFieldList"
				:key="field.key"
			>
				<b-form-group
					:label="field.label"
				>
					<b-form-input
						v-model.trim="form.profile[field.key]"
						:name="`figure-profile-${field.key}`"
					/>
				</b-form-group>
			</b-col>
		</b-form-row>

		<b-form-group
			label="和非遗的故事"
		>
			<b-form-textarea
				v-model.trim="form.description"
				name="figure-profile-description"
				style="height: 12em"
				no-resize
			/>
		</b-form-group>


		<b-form-group
			label="相关报道链接"
		>
			<b-form-tags
				v-model="form.referenceList"
				input-type="url"
			></b-form-tags>
		</b-form-group>

		<b-row>
			<b-col cols="6">
				<b-form-group
					label="人物BANNER"
				>
					<b-aspect
						aspect="16:9"
						class="border"
						style="background-color: #f0f0f0; background-size: cover; background-position: center"
						:style="{ 'background-image': `url(/api/image/${form.banner}/image.png)` }"
					></b-aspect>

					<b-form-file
						accept="image/*"
						@input="setBanner"
						browse-text="浏览"
						placeholder="选择图片"
					/>
				</b-form-group>
			</b-col>

			<b-col cols="6">
				<b-form-group
					label="个人工作照"
				>
					<b-aspect
						aspect="4:3"
						class="border"
						style="background-color: #f0f0f0; background-size: cover; background-position: center"
						:style="{ 'background-image': `url(/api/image/${form.photo}/image.png)` }"
					></b-aspect>

					<b-form-file
						accept="image/*"
						@input="setPhoto"
						browse-text="浏览"
						placeholder="选择图片"
					/>
				</b-form-group>
			</b-col>
		</b-row>

		<b-form-group
			label="代表作品"
		>
			<b-form-row>
				<b-col
					class="mb-3 position-relative"
					cols="2"
					v-for="(imageUrl, index) in form.workList"
					:key="index"
				>
					<b-aspect
						aspect="1:1"
						class="border"
						style="background-size: cover; background-position: center"
						:style="{
							'background-image': `url(/api/image/${imageUrl}/image.png)`
						}"
					></b-aspect>

					<b-button
						class="position-absolute"
						style="top: .5em;right: 1em"
						variant="danger"
						@click="deleteWorkByIndex(index)"
					><b-icon-trash /></b-button>
				</b-col>

				<b-col
					class="mb-3"
					cols="2"
				>
					<b-aspect
						aspect="1:1"
					><b-button
						@click="browseFile"
						block
						class="h-100"
					><b>选择上传图片</b></b-button></b-aspect>
				</b-col>
			</b-form-row>
		</b-form-group>


	</b-form>

	<b-form-file
		class="m-0 p-0"
		ref="browser"
		accept="image/*"
		@input="appendWork"
		style="width:0;height:0;overflow:hidden"
	></b-form-file>
</b-modal>

</template>

<script>
export default {
	data() {
		return {
			form: {
				banner: '',
				profile: {
					name: '',
					title: '',
					bornIn: '',
					category: '',
					city: '',
					field: '',
					duration: '',
				},
				photo: '',
				workList: [],
				description: '',
				referenceList: []
			}
		};
	},
	props: {
		figureId: {}
	},
	computed: {
		profileFieldList() {
			return [
				{ key: 'name', label: '姓名' },
				{ key: 'title', label: '头衔' },
				{ key: 'bornIn', label: '出生日期' },
				{ key: 'category', label: '非遗类别' },
				{ key: 'city', label: '城市' },
				{ key: 'field', label: '非遗项目名称' },
				{ key: 'duration', label: '创作非遗年限' },
			];
		}
	},
	methods: {
		browseFile() {
			this.$refs.browser.$el.querySelector('input').click();
		},
		async setBanner(file) {
			const formData = new FormData();

			formData.append('image', file);

			const image = await this.$app.Api.Image.create(formData);

			this.form.banner = image.id;
		},
		async setPhoto(file) {
			const formData = new FormData();

			formData.append('image', file);

			const image = await this.$app.Api.Image.create(formData);

			this.form.photo = image.id;
		},
		async appendWork(file) {
			const formData = new FormData();

			formData.append('image', file);

			const image = await this.$app.Api.Image.create(formData);

			this.form.workList.push(image.id);
		},
		deleteWorkByIndex(index) {
			this.form.workList.splice(index, 1);
		},
		async update() {
			this.form = await this.$app.Api.Figure(this.figureId).File.update(this.form);
		},
		async get() {
			this.form = await this.$app.Api.Figure(this.figureId).File.get();
		},
		open() {
			this.$refs.modal.show();
		}
	}
};
</script>

<style>

</style>
