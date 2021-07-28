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
	@shown="getManagedCityList"
	@ok="create"
	@hidden="reset"
>
	<b-form>
		<b-form-group
			label="标题"
		>
			<b-form-input
				v-model.trim="form.title"
				name="photo-title"
			/>
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
			label="上传图片"
		>
			<b-form-file
				v-model="image"
				accept="image/*"
				@input="setImageUrl"
				browse-text="浏览"
				placeholder="选择图片"
				class="mb-3"
			/>

			<b-aspect
				aspect="4:3"
				class="border"
				style="background-color: #f0f0f0; background-size: cover; background-position: center"
				:style="{
					'background-image': `url(${imageUrl})`
				}"
			></b-aspect>
		</b-form-group>
	</b-form>
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
				city: null
			},
			/**
			 * @type {File}
			 */
			image: null,
			imageUrl: ''
		};
	},
	computed: {
		isValid() {
			return this.form.title.length > 4 &&
				this.image instanceof File &&
				this.form.city !== null;
		},
		cityOptionList() {
			return [
				{ text: '请选择', value: null }
			].concat(this.meta.managedCityList.map(adcode => {
				return {
					text: this.meta.allCityList.find(city => city.adcode === adcode).name,
					value: adcode
				};
			}));
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
				await this.$app.Api.Photo.create({
					title: this.form.title,
					city: this.form.city,
					image: image.id
				});

				this.$bvToast.toast('创建照片成功', { variant: 'success' });
				this.$emit('created');
			} catch (Err) {
				this.$bvToast.toast('创建照片失败', { variant: 'danger' });
			}
		},
		async getManagedCityList() {
			const administrator = await this.$app.Api.Principal.Administrator.get();

			this.meta.managedCityList = administrator.cityList;
		},
		open() {
			this.$refs.modal.show();
		},
		reset() {
			this.form.title = '';
			this.form.city = null;
			this.image = null;
		}
	},
	async mounted() {
		this.meta.allCityList = await this.$app.Api.City.query();
		await this.getManagedCityList();
	}
};
</script>

<style>

</style>
