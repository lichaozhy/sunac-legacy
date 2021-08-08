<template>

<div class="p-2">
	<b-form @submit.prevent="createShare">
		<b-form-group
			class="required"
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
						class="h-100 round-sm"
						style="font-size:40px"
						@click="browseFile"
					><b-icon-plus
					/><p
						class="mb-0"
						style="font-size:14px"
					>（{{ form.imageList.length }}/9）</p></b-button></b-aspect>
				</b-col>
			</b-form-row>
			<b-form-text>至少上传1张，最多上传9张图片</b-form-text>
		</b-form-group>

		<b-form-group>
			<b-form-input
				v-model="form.title"
				placeholder="写标题吸引更多人关注"
				class="border-0 bg-secondary round-sm"
			/>
			<b-form-text>至少4个字</b-form-text>
		</b-form-group>

		<b-form-group
			class="required position-relative"
		>
			<b-form-textarea
				class="border-0 bg-secondary round-sm"
				v-model="form.raw"
				style="height: 10em"
				placeholder="请输入非遗分享的文字内容"
				no-resize
			/>
			<b-form-text>至少6个字</b-form-text>
			<b-form-text
				class="position-absolute"
				style="bottom:30px;right:10px"
			>当前{{ form.raw.length }}字</b-form-text>
		</b-form-group>

		<b-form-group
			description="为了感谢您的积极参与并在参与活动中奖后，官方能够联系到您，请留下您的手机号。"
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
			:disabled="!isValid"
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
	computed: {
		isValid() {
			if (this.form.imageList.length < 1) {
				return false;
			}

			if (this.form.raw.length < 6) {
				return false;
			}

			if (this.form.title.length < 4) {
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
