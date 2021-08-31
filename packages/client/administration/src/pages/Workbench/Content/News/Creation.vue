<template>

<b-modal
	ref="modal"
	size="md"
	centered
	title="创建活动报道"
	ok-title="创建"
	ok-variant="success"
	:ok-disabled="!isValid"
	cancel-title="取消"
	@ok="create"
>
	<b-form>
		<b-form-group
			label="标题"
		>
			<b-form-input
				v-model.trim="form.title"
				name="news-name"
			/>
		</b-form-group>

		<b-form-group
			label="发布日期"
		>
			<b-form-datepicker
				v-model.trim="form.publishedAt"
				name="news-published-at"
			/>
		</b-form-group>

		<b-form-group
			label="链接"
		>
			<b-input-group>
				<b-form-input
					v-model.trim="form.href"
					name="news-href"
				/>

				<template #append>
					<b-button
						:disabled="form.href.length < 8"
						:href="form.href"
						variant="primary"
						target="__blank"
					><b-icon-link45deg /></b-button>
				</template>
			</b-input-group>
		</b-form-group>

		<b-row>
			<b-col cols="6">
				<b-form-group
					label="缩略图"
				>
					<b-aspect
						aspect="4:3"
						class="border"
						style="background-color: #f0f0f0; background-size: cover; background-position: center"
						:style="{
							'background-image': `url(${thumbUrl})`
						}"
					></b-aspect>

					<b-form-file
						v-model="thumbImage"
						accept="image/*"
						@input="setImageUrl"
						browse-text="浏览"
						placeholder="选择图片"
					/>
				</b-form-group>
			</b-col>
		</b-row>
	</b-form>
</b-modal>

</template>

<script>
export default {
	data() {
		return {
			form: {
				title: '',
				href: '',
				thumb: '',
				publishedAt: '',
			},
			/**
			 * @type {File}
			 */
			thumbImage: null,
			thumbUrl: ''
		};
	},
	computed: {
		isValid() {
			return true;
		}
	},
	methods: {
		setImageUrl(file) {
			const reader = new FileReader();

			reader.addEventListener('load', () => this.thumbUrl = reader.result);
			reader.readAsDataURL(file);
		},
		async create() {
			const formData = new FormData();

			formData.append('image', this.thumbImage);

			const thumb = await this.$app.Api.Image.create(formData);

			try {
				await this.$app.Api.News.create({
					title: this.form.title,
					href: this.form.href,
					thumb: thumb.id,
					publishedAt: new Date(this.form.publishedAt)
				});

				this.$bvToast.toast('创建活动报道成功', { variant: 'success' });
				this.$emit('created');
			} catch (Err) {
				this.$bvToast.toast('创建活动报道失败', { variant: 'danger' });
			}
		},
		open() {
			this.$refs.modal.show();
		}
	}
};
</script>

<style>

</style>
