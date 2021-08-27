<template>

<b-modal
	ref="modal"
	size="md"
	centered
	title="创建城市首页轮播图"
	ok-title="创建"
	ok-variant="success"
	:ok-disabled="!isValid"
	cancel-title="取消"
	@shown="getManagedCityList"
	@ok="create"
>
	<b-form>
		<b-form-group
			label="标题"
		>
			<b-form-input
				v-model.trim="form.title"
				name="reference-name"
			/>
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

		<b-form-group
			label="选择城市"
		>
			<b-form-select
				:options="cityOptionList"
				v-model="form.city"
			></b-form-select>
		</b-form-group>

		<b-row>
			<b-col cols="4">
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
			<b-col cols="8">
				<b-form-group
					label="摘要"
					class="h-100"
				>
					<b-form-text
						class="position-absolute"
						style="right: 2em"
					>{{ form.abstract.length }}/225</b-form-text>
					<b-form-textarea
						v-model.trim="form.abstract"
						no-resize
						style="height:9em"
					/>
				</b-form-group>
			</b-col>
		</b-row>
	</b-form>
</b-modal>

</template>

<script>
const HREF_REG = /^https?:\/\//;

export default {
	data() {
		return {
			meta: {
				allCityList: [],
				managedCityList: []
			},
			form: {
				title: '',
				abstract: '',
				href: '',
				thumb: '',
				city: null
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
			return this.form.title.length > 4 &&
				(this.form.abstract.length > 10 && this.form.abstract.length < 256) &&
				HREF_REG.test(this.form.href) &&
				this.thumbImage instanceof File &&
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

			reader.addEventListener('load', () => this.thumbUrl = reader.result);
			reader.readAsDataURL(file);
		},
		async create() {
			const formData = new FormData();

			formData.append('image', this.thumbImage);

			const thumb = await this.$app.Api.Image.create(formData);

			try {
				await this.$app.Api.Reference.create({
					title: this.form.title,
					abstract: this.form.abstract,
					href: this.form.href,
					city: this.form.city,
					thumb: thumb.id
				});

				this.$bvToast.toast('创建新闻成功', { variant: 'success' });
				this.$emit('created');
			} catch (Err) {
				this.$bvToast.toast('创建新闻失败', { variant: 'danger' });
			}
		},
		async getManagedCityList() {
			const administrator = await this.$app.Api.Principal.Administrator.get();

			this.meta.managedCityList = administrator.cityList;
		},
		open() {
			this.$refs.modal.show();
		}
	},
	async mounted() {
		this.meta.allCityList = await this.$app.Api.City.query();
		await this.getManagedCityList();
	}
};
</script>
