<template>

<div class="p-2">
	<b-form @submit.prevent="createPost">
		<b-form-group
			label="图片"
		>
			<b-form-row>
				<b-col
					cols="4"
					class="mb-2"
					v-for="imageId in form.imageList"
					:key="imageId"
				>
					<b-aspect
						class="w-100"
						aspect="1:1"
						style="background-size:cover;background-position:center"
						:style="{'background-image': `url(/api/image/${imageId}/image.png)`}"
					></b-aspect>
				</b-col>

				<b-col v-if="form.imageList.length < 9" cols="4" >
					<b-aspect aspect="1:1" ><b-button
						block
						class="h-100"
						@click="browseFile"
						style="font-size:48px"
					><b-icon-plus
					/><p
						class="mb-0"
						style="font-size:14px"
					>（{{ form.imageList.length }}/9）</p></b-button></b-aspect>
				</b-col>
			</b-form-row>
			<b-form-text>最多上传9张图片</b-form-text>
		</b-form-group>

		<b-form-group
			label="回复内容"
			class="required position-relative"
		>
			<b-form-textarea
				class="border-0 bg-secondary round-sm"
				v-model="form.raw"
				style="height: 10em"
				placeholder="请输入回复内容"
				no-resize
			/>
			<b-form-text>至少6个字</b-form-text>
			<b-form-text
				class="position-absolute"
				style="bottom:30px;right:10px"
			>当前{{ form.raw.length }}字</b-form-text>
		</b-form-group>

		<b-form-group
			label="联系方式"
			:state="validationPhone"
			invalid-feedback="输入11位长的正确手机号"
			description="为了回报您的积极参与，留下您的手机号，以方便参与活动中奖后，官方能够联系到您。"
		>
			<b-form-input
				v-model="form.phone"
				placeholder="您的手机号码（可选）"
				class="border-0 bg-secondary round-sm"
			/>
		</b-form-group>

		<b-button
			variant="primary"
			size="md"
			block
			pill
			type="submit"
			class="mt-5"
			:disabled="!isValid"
		>回复</b-button>
		<b-form-text class="mb-5">温馨提示：您发布的内容将在审核后对其他用户可见</b-form-text>
	</b-form></div>

</template>

<script>
export default {
	data() {
		return {
			customer: {
				phone: null
			},
			form: {
				raw: '',
				phone: '',
				imageList: []
			},
		};
	},
	computed: {
		validationPhone() {
			return this.form.phone.length === 0
				? null
				: /^[0-9]{11}$/.test(this.form.phone);
		},
		isValid() {
			if (this.form.raw.length < 6) {
				return false;
			}

			if (this.validationPhone === false) {
				return false;
			}

			return true;
		}
	},
	methods: {
		async browseFile() {
			const res = await this.$wx.promises.chooseImage({ count: 9 - this.form.imageList.length });

			for (const localId of res.localIds) {
				const uploadingRes = await this.$wx.promises.uploadImage({ localId });
				const image = await this.$app.Api.Image.create({ mediaId: uploadingRes.serverId });

				this.form.imageList.push(image.id);
			}
		},
		async getCustomer() {
			const customer = await this.$app.Api.Customer.get();

			this.customer.phone = this.form.phone = customer.phone;
		},
		async updateCustomer() {
			const customer = await this.$app.Api.Customer.update({ phone: this.form.phone });

			this.customer.phone = this.form.phone = customer.phone;
		},
		async createPost() {
			if (this.form.phone !== this.customer.phone) {
				this.updateCustomer();
			}

			try {
				await this.$app.Api.Topic(this.$route.params.topicId).Post.create({
					raw: this.form.raw,
					imageList: this.form.imageList
				});

				await this.$router.back();

				setTimeout(() => {
					this.$bvToast.toast('回复成功', {
						variant: 'dark',
						noCloseButton: true,
						toastClass: 'border-0 bg-dark text-white text-center mt-3',
						toaster: 'b-toaster-top-full'
					});
				}, 50);
			} catch (err) {
				this.$bvToast.toast('回复失败', { variant: 'danger' });
			}
		}
	},
	mounted() {
		this.getCustomer();
	}
};
</script>

<style>

</style>
