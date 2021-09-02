<template>

<div
	id="app-figure-file"
	class="h-100 pb-5 overflow-auto"
>
	<b-aspect
		class="app-background-center"
		style="background-color: #ccc"
		:style="{ 'background-image': `url(/api/image/${file.banner}/image.png)` }"
		aspect="16:9"
	></b-aspect>

	<div
		class="mt-3 px-2"
	>
		<b-form-row class="mt-3">
			<b-col cols="6">
				<h6 class="text-center font-weight-bold mb-1">人物简介</h6>
				<ul class="list-unstyled text-nowrap" style="font-size:12px">
					<li
						v-for="(field, index) in profileFieldList"
						:key="index"
					><span
						class="d-inline-block text-justify font-weight-bold"
						style="width:6em;text-align-last:justify"
					>{{ field.label }}</span>：{{ file.profile[field.key] }}</li>
				</ul>
			</b-col>

			<b-col cols="6">
				<b-aspect
					class="app-background-center"
					style="background-color: #ccc"
					:style="{ 'background-image': `url(/api/image/${file.photo}/image.png)` }"
					aspect="16:9"
				></b-aspect>
				<h6 class="text-center font-weight-bold mt-3">个人工作照</h6>
			</b-col>
		</b-form-row>

		<h6 class="text-center font-weight-bold mt-3">代表作品</h6>

		<div
			class="w-100 d-flex flex-nowrap w-100 overflow-auto mt-3"
			style="height: 120px"
		>
			<b-img
				v-for="(image, index) in file.workList"
				:key="index"
				:src="`/api/image/${image}/image.png`"
				class="h-100 mr-3"
			/>
		</div>

		<h6 class="text-center font-weight-bold mt-5">和非遗的故事</h6>

		<pre
			class="mt-4"
			style="white-space:break-spaces"
		>{{ file.description }}</pre>

		<p class="mb-0 font-weight-bold mt-5">相关报道链接</p>
		<ul class="list-unstyled w-100">
			<li
				class="text-truncate"
				v-for="(reference, index) in file.referenceList"
				:key="index"
			><b-link :href="reference">{{ reference }}</b-link></li>
		</ul>
	</div>
</div>

</template>

<script>
export default {
	data() {
		return {
			file: {
				banner: '',
				profile: {
					name: '',
					title: '',
					bornIn: '',
					category: '',
					city: '',
					field: '',
					duration: '',
				},
				photo: '',
				workList: [],
				description: '',
				referenceList: []
			}
		};
	},
	computed: {
		figureId() {
			return this.$route.params.figureId;
		},
		profileFieldList() {
			return [
				{ key: 'name', label: '姓名' },
				{ key: 'title', label: '头衔' },
				{ key: 'bornIn', label: '出生日期' },
				{ key: 'category', label: '非遗类别' },
				{ key: 'city', label: '城市' },
				{ key: 'field', label: '非遗项目名称' },
				{ key: 'duration', label: '创作非遗年限' },
			];
		}
	},
	methods: {
		async getFigureFile() {
			this.file = await this.$app.Api.Figure(this.figureId).File.get();
		}
	},
	mounted() {
		this.getFigureFile();
	}
};
</script>

<style>

</style>
