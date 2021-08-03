<template>

<div class="p-2">
	<b-form @submit.prevent="createShare">
		<b-form-group
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
						class="h-100 round-sm"
						style="font-size:48px"
						@click="browseFile"
					><b-icon-plus /></b-button></b-aspect>
				</b-col>
			</b-form-row>
		</b-form-group>

		<b-form-group
			class="required"
		>
			<b-form-group>
				<b-form-input
					v-model="form.title"
					placeholder="写标题吸引更多人关注"
					class="border-0 bg-secondary round-sm"
				/>
			</b-form-group>

			<b-form-textarea
				class="border-0 bg-secondary round-sm"
				v-model="form.raw"
				style="height: 10em"
				placeholder="请输入非遗分享的文字内容"
				no-resize
			/>
		</b-form-group>

		<b-form-group
			description="感谢您的积极参与，为了在参与活动并中奖后，官方能够联系到您，请留下您的手机号。"
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
			style="border-radius: 60px"
			type="submit"
			class="my-5"
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
				title: '',
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
					title: this.form.title,
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
