<template>

<div>
	<h4>活动报道</h4><hr>

	<b-button-toolbar>
		<b-form-input
			v-model="keyword"
			class="mr-0 ml-auto"
			style="width: 9em"
			placeholder="标题关键字"
		/>

		<b-button
			variant="primary"
			class="mr-5"
			@click="refreshTable"
		>搜索</b-button>

		<b-pagination
			v-model="pagination.current"
			:per-page="pagination.size"
			:total-rows="pagination.total"
			size="sm"
			class="mb-0 mr-5"
		></b-pagination>

		<b-button
			variant="danger"
			class="mr-1"
			@click="deleteNews"
			:disabled="selectedId === null"
		>删除</b-button>

		<b-button
			@click="requestCreatingNews"
			variant="success"
			class="mr-auto"
		>创建</b-button>
	</b-button-toolbar>

	<b-table
		class="mt-3"
		ref="table"
		:items="provideNewsList"
		:fields="newsFieldList"
		small
		bordered
		:per-page="pagination.size"
		:current-page="pagination.current"
		show-empty
		select-mode="single"
		selectable
		@row-selected="setSelectedId"
	>
		<template #empty>
			没有符合要求的条目
		</template>

		<template #cell(thumb)="row">
			<b-aspect
				aspect="4:3"
				class="border previewer"
				style="background-color: #f0f0f0; background-size: cover; background-position: center"
				:style="{
					'background-image': `url(/api/image/${row.item.thumb}/image.png)`
				}"
			></b-aspect>
		</template>

		<template #cell(title)="row">
			<b-link
				:href="row.item.href"
				target="__blank"
			>{{ row.item.title }}<b-icon-box-arrow-up-right
				class="ml-2"
			/></b-link>
		</template>
	</b-table>

	<app-creation
		@created="refreshTable"
		ref="creation"
	/>
</div>

</template>

<script>
import Creation from './Creation.vue';

export default {
	components: { AppCreation: Creation },
	data() {
		return {
			keyword: '',
			selectedId: null,
			pagination: {
				current: 1,
				total: 100,
				size: 10
			},
		};
	},
	computed: {
		newsFieldList() {
			return [
				{ key: 'title', label: '标题' },
				{ key: 'thumb', label: '缩略图', class: 'col-thumb' },
				{ key: 'publishedAt', label: '发布于', class: 'col-date' },
				{ key: 'createdAt', label: '创建于', class: 'col-datetime' },
			];
		},
	},
	methods: {
		async deleteNews() {
			await this.$app.Api.News(this.selectedId).delete();
			this.$bvToast.toast('删除活动报道成功', { variant: 'success' });
			this.refreshTable();
		},
		requestCreatingNews() {
			this.$refs.creation.open();
		},
		setSelectedId(rows) {
			this.selectedId = rows.length > 0 ? rows[0].id : null;
		},
		async provideNewsList(ctx) {
			const query = {
				title: this.keyword,
				pageSize: ctx.perPage,
				pageCurrent: ctx.currentPage,
				sortBy: ctx.sortBy,
				sortDesc: ctx.sortDesc
			};

			const { list, total } = await this.$app.Api.News.query(query);

			this.pagination.total = total;

			return list.map(news => {
				return {
					id: news.id,
					title: news.title,
					href: news.href,
					thumb: news.thumb,
					createdAt: this.$app.Filter.localDatetime(news.createdAt),
					publishedAt: this.$app.Filter.localDate(news.publishedAt)
				};
			});
		},
		async refreshTable() {
			this.$refs.table.refresh();
		},
	}
};
</script>

<style>

</style>
