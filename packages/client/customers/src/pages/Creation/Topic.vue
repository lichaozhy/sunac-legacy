<template>

<div class="p-2">
	<b-form>
		<b-form-group
			label="话题题目"
			class="required"
		>
			<b-form-input
				class="border-top-0 border-left-0 border-right-0"
				v-model="form.title"
				placeholder="请输入话题题目"
			/>
		</b-form-group>

		<b-form-group
			label="话题描述"
			class="required"
		>
			<b-form-textarea
				class="border-top-0 border-left-0 border-right-0"
				v-model="form.description"
				style="height: 10em"
				placeholder="请输入话题描述"
				no-resize
			/>
		</b-form-group>

		<b-form-group
			label="BANNER"
			class="required"
		>
			<b-aspect aspect="16:9" class="border">
				<b-button block class="h-100" @click="browseFile" >
					<p>请浏览手机存储择BANNER</p>
					<b-form-text>建议选择接近16:9比例的图片以达到最好的效果</b-form-text>
				</b-button>
			</b-aspect>
		</b-form-group>

		<b-button
			variant="danger"
			size="md"
			block
			type="submit"
		>创建话题</b-button>
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
	methods: {
		async browseFile() {
			const res = await this.$wx.promises.chooseImage({ count: 1 });
			const uploadingRes = await this.$wx.promises.uploadImage({ localId: res.localIds[0] });
			const image = await this.$app.Api.Image.create({ mediaId: uploadingRes.serverId });

			this.form.banner = image;
		},
	}
};
</script>

<style>

</style>
