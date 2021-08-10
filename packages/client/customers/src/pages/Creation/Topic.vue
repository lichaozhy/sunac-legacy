<template>

<div class="p-2">
	<b-form @submit.prevent="createTopic">
		<b-form-group
			label="话题题目"
			class="required"
		>
			<b-form-input
				class="border-0 bg-secondary round-sm"
				v-model="form.title"
				placeholder="请输入话题题目"
			/>
			<b-form-text>至少4个字</b-form-text>
		</b-form-group>

		<b-form-group
			label="BANNER"
			class="required"
		>
			<b-aspect
				aspect="16:9"
				class="border"
				style="background-position:center;background-size:cover"
				:style="{'background-image':`url(/api/image/${form.banner}/image.png)`}"
			>
				<b-button block class="h-100" @click="browseFile" v-if="!form.banner">
					<p>请浏览手机存储择BANNER</p>
					<b-form-text>建议选择接近<b
						class="mx-1"
					>16:9</b>比例的图片以达到最好的效果</b-form-text>
					<b-form-text>* 必须上传话题BANNER图</b-form-text>
				</b-button>
			</b-aspect>
		</b-form-group>

		<b-form-group
			label="话题描述"
			class="position-relative"
		>
			<b-form-textarea
				class="border-0 bg-secondary round-sm"
				v-model="form.description"
				style="height: 6em"
				placeholder="请输入话题描述（可选）"
				no-resize
			/>
			<b-form-text
				class="position-absolute"
				style="bottom:10px;right:10px"
			>当前{{ form.description.length }}字</b-form-text>
		</b-form-group>

		<b-button
			variant="primary"
			size="md"
			class="rounded-pill mt-5"
			block
			type="submit"
			:disabled="!isValid"
		>创建话题</b-button>
		<b-form-text class="mb-5">温馨提示：您发布的内容将在审核后对其他用户可见</b-form-text>
	</b-form>

</div>

</template>

<script>
export default {
	data() {
		return {
			form: {
				title: '',
				banner: '',
				description: ''
			}
		};
	},
	computed: {
		isValid() {
			if (this.form.title.length < 4) {
				return false;
			}

			if (this.form.banner.length === 0) {
				return false;
			}

			return true;
		}
	},
	methods: {
		async browseFile() {
			const res = await this.$wx.promises.chooseImage({ count: 1 });
			const uploadingRes = await this.$wx.promises.uploadImage({ localId: res.localIds[0] });
			const image = await this.$app.Api.Image.create({ mediaId: uploadingRes.serverId });

			this.form.banner = image.id;
		},
		async createTopic() {
			try {
				await this.$app.Api.Topic.create({
					title: this.form.title,
					banner: this.form.banner,
					description: this.form.description
				});

				await this.$router.back();

				setTimeout(() => {
					this.$bvToast.toast('创建主题成功', {
						variant: 'dark',
						noCloseButton: true,
						toastClass: 'border-0 bg-dark text-white text-center mt-3',
						toaster: 'b-toaster-top-full'
					});
				});
			} catch (err) {
				this.$bvToast.toast('发布话题失败', { variant: 'danger' });
			}
		}
	}
};
</script>

<style>

</style>
