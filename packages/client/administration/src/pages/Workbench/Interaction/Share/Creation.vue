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
			label="文本"
			class="h-100 position-relative"
		>
			<b-form-text
				class="position-absolute"
				style="right: 0; top: -2em"
			>{{ form.raw.length }}/500</b-form-text>
			<b-form-textarea
				v-model.trim="form.raw"
				no-resize
				style="height:9em"
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
			:label="`图片(${imageList.length}/9)`"
		>
			<b-form-row>
				<b-col
					class="mb-3 position-relative"
					cols="4"
					v-for="(imageUrl, index) in imageUrlList"
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
						class="position-absolute"
						style="top: .5em;right: 1em"
						variant="danger"
						@click="deleteImageByIndex(index)"
					><b-icon-trash /></b-button>
				</b-col>

				<b-col
					class="mb-3"
					cols="4"
					v-if="imageList.length < 9"
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
		@input="setImageUrl"
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
				raw: '',
				city: null,
			},
			imageList: [],
			imageUrlList: []
		};
	},
	computed: {
		isValid() {
			if (this.form.raw.length === 0 && this.imageList.length === 0) {
				return false;
			}

			return this.form.city !== null;
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
		deleteImageByIndex(index) {
			this.imageList.splice(index, 1);
			this.imageUrlList.splice(index, 1);
		},
		setImageUrl(file) {
			const reader = new FileReader();

			this.imageList.push(file);
			reader.addEventListener('load', () => this.imageUrlList.push(reader.result));
			reader.readAsDataURL(file);
		},
		browseFile() {
			this.$refs.browser.$el.querySelector('input').click();
		},
		async create() {
			const imageList = [];

			for (const image of this.imageList) {
				const formData = new FormData();

				formData.append('image', image);
				imageList.push(await this.$app.Api.Image.create(formData));
			}

			try {
				await this.$app.Api.Share.create({
					raw: this.form.raw,
					city: this.form.city,
					imageList: imageList.map(image => image.id)
				});

				this.$bvToast.toast('创建非遗圈（作品）成功', { variant: 'success' });
				this.$emit('created');
			} catch (Err) {
				this.$bvToast.toast('创建非遗圈（作品）失败', { variant: 'danger' });
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
