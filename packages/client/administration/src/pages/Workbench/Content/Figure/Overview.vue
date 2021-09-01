<template>

<div>
	<h4>非遗传承人</h4><hr>

	<b-button-toolbar>
		<b-button
			@click="getFigureList"
			variant="success"
			class="ml-auto mr-1"
		>刷新</b-button>

		<b-button
			variant="danger"
			class="mr-1"
			@click="deleteFigure"
			:disabled="selectedId === null"
		>删除</b-button>

		<b-button
			@click="requestCreatingFigure"
			variant="success"
			class="mr-5"
		>创建</b-button>

		<b-button
			@click="requestUpdatingFigureFile"
			variant="primary"
			class="mr-auto"
			:disabled="selectedId === null"
		>更新人物档案</b-button>
	</b-button-toolbar>

	<b-table
		class="mt-3"
		ref="table"
		:items="figureList"
		:fields="figureFieldList"
		small
		bordered
		show-empty
		select-mode="single"
		selectable
		@row-selected="setSelectedId"
	>
		<template #empty>
			没有符合要求的条目
		</template>

		<template #cell(image)="row">
			<b-aspect
				aspect="3:4"
				class="border previewer"
				style="background-color: #f0f0f0; background-size: cover; background-position: center"
				:style="{
					'background-image': `url(/api/image/${row.item.image}/image.png)`
				}"
			></b-aspect>
		</template>

		<template #cell(name)="row">
			<b-link
				:href="row.item.href"
				target="__blank"
			>{{ row.item.name }}<b-icon-box-arrow-up-right
				class="ml-2"
			/></b-link>
		</template>

		<template #cell(createdAt)="row">
			{{ row.item.createdAt | localDatetime }}
		</template>
	</b-table>

	<app-figure-creation
		@created="getFigureList"
		ref="creation"
	/>

	<app-figure-file-updator
		ref="file"
		:figure-id="selectedId"
	/>
</div>

</template>

<script>
import AppFigureCreation from './Creation.vue';
import AppFigureFileUpdator from './File.vue';

export default {
	components: { AppFigureCreation, AppFigureFileUpdator },
	data() {
		return {
			figureList: [],
			selectedId: null
		};
	},
	computed: {
		figureFieldList() {
			return [
				{ key: 'image', label: '照片', class: 'col-thumb' },
				{ key: 'name', label: '名字', class: 'col-short-string' },
				{ key: 'profile', label: '简介' },
				// { key: 'city', label: '地区', class: 'col-short-string' },
				{ key: 'createdAt', label: '创建于', class: 'col-datetime' },
			];
		}
	},
	methods: {
		setSelectedId(rows) {
			this.selectedId = rows.length > 0 ? rows[0].id : null;
		},
		requestCreatingFigure() {
			this.$refs.creation.open();
		},
		requestUpdatingFigureFile() {
			this.$refs.file.open();
		},
		async getFigureList() {
			this.figureList = await this.$app.Api.Figure.query();
		},
		async deleteFigure() {
			await this.$app.Api.Figure(this.selectedId).delete();
			this.getFigureList();
		},
	},
	mounted() {
		this.getFigureList();
	}
};
</script>

<style>

</style>
