<template>

<div class="p-2">
	<b-form @submit.prevent="createShare">
		<b-form-group
			label="图片"
			class="required"
		>
			<b-form-row>
				<b-col
					cols="4"
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
					><b-icon-plus-circle /></b-button></b-aspect>
				</b-col>
			</b-form-row>
		</b-form-group>

		<b-form-group
			label="文本内容"
			class="required"
		>
			<b-form-textarea
				class="border-top-0 border-left-0 border-right-0"
				v-model="form.raw"
				style="height: 10em"
				placeholder="请输入非遗分享的文字内容"
				no-resize
			/>
		</b-form-group>

		<b-form-group
			label="联系方式"
			description="为了回报您的积极参与，留下您的手机号，以方便参与活动中奖后，官方能够联系到您。"
		>
			<b-form-input
				v-model="form.phone"
				placeholder="您的手机号码"
				class="border-top-0 border-left-0 border-right-0"
			/>
		</b-form-group>

		<b-button
			variant="success"
			size="md"
			block
			type="submit"
		>发布</b-button>
	</b-form>
</div>

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
	methods: {
		async browseFile() {
			const res = await this.$wx.promises.chooseImage({ count: 9 - this.form.imageList.length });

			for (const localId in res.localIds) {
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
		async createShare() {
			if (this.form.phone !== this.customer.phone) {
				this.updateCustomer();
			}

			try {
				await this.$app.Api.Share.create({
					raw: this.form.raw,
					imageList: this.form.imageList
				});

				await this.$router.push({ name: 'Home' });
			} catch (err) {
				this.$bvToast.toast('发布分享失败', { variant: 'danger' });
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
