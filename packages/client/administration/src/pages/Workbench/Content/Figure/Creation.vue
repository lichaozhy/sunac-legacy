<template>

<b-modal
	ref="modal"
	size="md"
	centered
	title="创建非遗新闻"
	ok-title="创建"
	ok-variant="success"
	:ok-disabled="!isValid"
	cancel-title="取消"
	@ok="create"
>
	<b-form>
		<b-form-group
			label="名字"
		>
			<b-form-input
				v-model.trim="form.name"
				name="reference-name"
			/>
		</b-form-group>

		<b-form-group
			label="简介"
		>
			<b-form-textarea
				v-model.trim="form.profile"
				name="reference-name"
			></b-form-textarea>
		</b-form-group>

		<b-form-group
			label="链接"
		>
			<b-input-group>
				<b-form-input
					v-model.trim="form.href"
					name="reference-href"
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
			<b-col cols="4">
				<b-form-group
					label="缩略图"
				>
					<b-aspect
						aspect="3:4"
						class="border"
						style="background-color: #f0f0f0; background-size: cover; background-position: center"
						:style="{
							'background-image': `url(${imageUrl})`
						}"
					></b-aspect>

					<b-form-file
						v-model="image"
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
				name: '',
				image: '',
				href: '',
				profile: ''
			},
			image: null,
			imageUrl: ''
		};
	},
	computed: {
		isValid() {
			if (this.form.name.length === 0) {
				return false;
			}

			if (this.form.href.length < 10) {
				return false;
			}

			if (this.form.profile.length < 6) {
				return false;
			}

			if (this.image === null) {
				return false;
			}

			return true;
		}
	},
	methods: {
		setImageUrl(file) {
			const reader = new FileReader();

			reader.addEventListener('load', () => this.imageUrl = reader.result);
			reader.readAsDataURL(file);
		},
		async create() {
			const formData = new FormData();

			formData.append('image', this.image);

			const image = await this.$app.Api.Image.create(formData);

			try {
				await this.$app.Api.Figure.create({
					name: this.form.name,
					href: this.form.href,
					profile: this.form.profile,
					image: image.id
				});

				this.$bvToast.toast('创建人物成功', { variant: 'success' });
				this.$emit('created');
			} catch (Err) {
				this.$bvToast.toast('创建人物失败', { variant: 'danger' });
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
