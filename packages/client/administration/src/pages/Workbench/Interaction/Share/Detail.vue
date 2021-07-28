<template>


<b-modal
	ref="modal"
	size="md"
	centered
	title="查看非遗圈（作品）"
	ok-title="通过审核并关闭"
	ok-variant="success"
	cancel-title="取消"
	@ok="validate"
	:ok-disabled="!canValidate"
>
	<b-form-row>
		<b-col cols="4">
			<b-form-group
				label="选择城市"
			>
				<b-form-input
					:value="cityName"
					readonly
				/>
			</b-form-group>
		</b-col>
		<b-col cols="4">
			<b-form-group
				label="创建日期"
			>
				<b-form-input
					:value="createdAt"
					readonly
				/>
			</b-form-group>
		</b-col>
		<b-col cols="4">
			<b-form-group
				label="作者昵称"
			>
				<b-form-input
					:value="share.createdBy.nickname"
					readonly
				/>
			</b-form-group>
		</b-col>
	</b-form-row>

	<b-form-group
		label="文本"
		class="h-100 position-relative"
	>
		<b-form-textarea
			v-model.trim="share.raw"
			no-resize
			style="height:9em"
		/>
	</b-form-group>

		<b-form-group
			label="图片"
		>
		<b-form-row>
			<b-col
				class="mb-3 position-relative"
				cols="4"
				v-for="(imageId, index) in share.imageList"
				:key="index"
			>
				<b-aspect
					aspect="1:1"
					class="border"
					style="background-size: cover; background-position: center"
					:style="{
						'background-image': `url(/api/image/${imageId}/image.png)`
					}"
				></b-aspect>
			</b-col>
		</b-form-row>
	</b-form-group>
</b-modal>

</template>

<script>
function Share() {
	return {
		id: '',
		raw: '',
		like: 0,
		city: '',
		imageList: [],
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
			meta: {
				allCityList: [],
				managedCityList: []
			},
			share: Share(),
			cityName: ''
		};
	},
	computed: {
		createdAt() {
			return this.$app.Filter.localDatetime(this.share.createdAt);
		},
		canValidate() {
			return this.meta.managedCityList.some(adcode => adcode === this.share.city) &&
				this.share.validatedAt === null;
		}
	},
	methods: {
		async open(shareId) {
			this.$refs.modal.show();

			const share = await this.$app.Api.Share(shareId).get();

			this.share.id = share.id;
			this.share.raw = share.raw;
			this.share.city = share.city;
			this.share.like = share.like;
			this.share.imageList = share.imageList;
			this.share.createdAt = share.createdAt;
			this.share.validatedAt = share.validatedAt;
			this.share.createdBy.id = share.createdBy.id;
			this.share.createdBy.nickname = share.createdBy.wechat.nickname;
			this.share.createdBy.headimgurl = share.createdBy.wechat.headimgurl;
			this.cityName = this.meta.allCityList.find(city => city.adcode === this.share.city).name;
		},
		async validate() {
			try {
				await this.$app.Api.Share(this.share.id).update();
				this.$bvToast.toast('审核通过非遗圈（作品）成功', { variant: 'success' });
				this.$emit('validated');
			} catch (err) {
				console.log(err);
				this.$bvToast.toast('审核非遗圈（作品）失败', { variant: 'danger' });
			}
		},
		async getAdministrator() {
			const { cityList } = await this.$app.Api.Principal.Administrator.get();

			this.meta.managedCityList = cityList;
		},
		reset() {
			this.share = Share();
			this.cityName = '';
		}
	},
	async mounted() {
		this.meta.allCityList = await this.$app.Api.City.query();
		this.getAdministrator();
	}
};
</script>

<style>

</style>
