<template>

<div>
	<h4>外引用总览</h4><hr>

	<b-button-toolbar>
		<b-form-input
			v-model="keyword"
			class="mr-0"
			style="width: 12em"
			placeholder="请输入标题关键字"
		/>
		<b-button
			variant="primary"
			class="mr-auto"
			@click="refreshTable"
		>搜索</b-button>

		<b-pagination
			v-model="pagination.current"
			:per-page="pagination.size"
			:total-rows="pagination.total"
			size="sm"
			class="mb-0 mr-auto"
		></b-pagination>

		<b-button
			@click="requestCreatingReference"
			variant="success"
		>创建</b-button>
	</b-button-toolbar>

	<b-table
		class="mt-3"
		ref="table"
		:items="provideReferenceList"
		:fields="referenceFieldList"
		small
		bordered
		:per-page="pagination.size"
		:current-page="pagination.current"
		show-empty
	>
		<template #empty>
			没有符合要求的条目
		</template>
	</b-table>

	<app-creation ref="creation" />
</div>

</template>

<script>
import Creation from './Creation.vue';

export default {
	components: { AppCreation: Creation },
	data() {
		return {
			keyword: '',
			pagination: {
				current: 1,
				total: 100,
				size: 20
			}
		};
	},
	computed: {
		referenceFieldList() {
			return [
				{ key: 'title', label: '标题' },
				{ key: 'href', label: '链接', class: 'col-href' },
				{ key: 'read', label: '阅读', class: 'col-short-number' },
				{ key: 'like', label: '赞👍', class: 'col-short-number' },
				{ key: 'createdAt', label: '创建于', class: 'col-datetime', sortable: true },
			];
		},
		isNewReferenceValid() {
			return this.$refs['creation-form'].isValid;
		}
	},
	methods: {
		requestCreatingReference() {
			this.$refs.creation.open();
		},
		async provideReferenceList(ctx) {
			const { list, total } = await this.$app.Api.Reference.query({
				title: this.keyword,
				pageSize: ctx.perPage,
				pageCurrent: ctx.currentPage,
				sortBy: ctx.sortBy,
				sortDesc: ctx.sortDesc
			});

			this.pagination.total = total;

			return list.map(reference => {
				return {
					id: reference.id,
					title: reference.title,
					href: reference.href,
					read: reference.read,
					like: reference.like,
					createdAt: this.$app.Filter.localDatetime(reference.createdAt)
				};
			});
		},
		async refreshTable() {
			this.$refs.table.refresh();
		},
		async createReference() {
			await this.$refs.creation.create();
		}
	}
};
</script>

<style>
.col-href {
	width: 3em;
	text-align: center;
}
</style>
