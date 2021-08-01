<template>

<b-modal
	ref="modal"
	size="md"
	centered
	title="创建非遗圈（作品）"
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
				name="photo-title"
			/>
			<b-form-text>至少4个字</b-form-text>
		</b-form-group>

		<b-form-group
			label="选择城市"
		>
			<b-form-select
				:options="cityOptionList"
				v-model="form.city"
			></b-form-select>
		</b-form-group>

		<b-form-group
			label="话题正文"
			class="h-100 position-relative"
		>
			<b-form-text
				class="position-absolute"
				style="right: 0; top: -2em"
			>{{ form.description.length }}/255</b-form-text>
			<b-form-textarea
				v-model.trim="form.description"
				no-resize
				style="height:9em"
			/>
			<b-form-text>至少16个字</b-form-text>
		</b-form-group>

		<b-form-group
			label="上传话题BANNER"
		>
			<b-aspect
				@click.native="browseFile"
				aspect="16:9"
				class="border"
				style="background-color: #f0f0f0; background-size: cover; background-position: center; cursor:pointer"
				:style="{
					'background-image': `url(${bannerUrl})`
				}"
			></b-aspect>
		</b-form-group>
	</b-form>

	<b-form-file
		class="m-0 p-0"
		ref="browser"
		accept="image/*"
		@input="setImageUrl"
		v-model="banner"
		style="width:0;height:0;overflow:hidden"
	></b-form-file>
</b-modal>

</template>

<script>
export default {
	data() {
		return {
			meta: {
				allCityList: [],
				managedCityList: []
			},
			form: {
				title: '',
				description: '',
				city: null
			},
			banner: null,
			bannerUrl: ''
		};
	},
	computed: {
		isValid() {
			return this.form.city !== null &&
				this.form.description.length > 16 &&
				this.form.title.length > 4;
		},
		cityOptionList() {
			return [
				{ text: '请选择', value: null }
			].concat(this.meta.allCityList.map(city => {
				return { text: city.name, value: city.adcode };
			}));
		},
	},
	methods: {
		setImageUrl(file) {
			const reader = new FileReader();

			reader.addEventListener('load', () => this.bannerUrl = reader.result);
			reader.readAsDataURL(file);
		},
		browseFile() {
			this.$refs.browser.$el.querySelector('input').click();
		},
		async create() {
			try {
				const formData = new FormData();

				formData.append('image', this.banner);

				const banner = await this.$app.Api.Image.create(formData);

				await this.$app.Api.Topic.create({
					title: this.form.title,
					description: this.form.description,
					city: this.form.city,
					banner: banner.id
				});

				this.$emit('created');
				this.$bvToast.toast('创建话题成功', { variant: 'success' });
			} catch (err) {
				this.$bvToast.toast('创建话题失败', { variant: 'danger' });
			}
		},
		open() {
			this.$refs.modal.show();
		}
	},
	async mounted() {
		this.meta.allCityList = await this.$app.Api.City.query();
	}
};
</script>

<style>

</style>
