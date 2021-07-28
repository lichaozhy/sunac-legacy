<template>

<div>
	<h4>非遗新闻总览</h4><hr>

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
			variant="danger"
			class="mr-1"
			@click="deleteReference"
			:disabled="selectedId === null"
		>删除</b-button>
		<b-button
			@click="requestCreatingReference"
			variant="success"
		>创建</b-button>
	</b-button-toolbar>

	<div></div>

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
			meta: {
				cityList: [],
			},
			keyword: '',
			pagination: {
				current: 1,
				total: 100,
				size: 20
			},
			selectedId: null
		};
	},
	computed: {
		referenceFieldList() {
			return [
				{ key: 'title', label: '标题' },
				{ key: 'thumb', label: '缩略图', class: 'col-thumb' },
				{ key: 'abstract', label: '摘要' },
				{ key: 'city', label: '地区', class: 'col-short-string' },
				// { key: 'read', label: '阅读', class: 'col-short-number' },
				// { key: 'like', label: '赞👍', class: 'col-short-number' },
				{ key: 'createdAt', label: '创建于', class: 'col-datetime' },
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
					abstract: reference.abstract,
					thumb: reference.thumb,
					city: this.meta.cityList.find(city => city.adcode === reference.city).name,
					createdAt: this.$app.Filter.localDatetime(reference.createdAt)
				};
			});
		},
		async refreshTable() {
			this.$refs.table.refresh();
		},
		async deleteReference() {
			await this.$app.Api.Reference(this.selectedId).delete();
			this.$bvToast.toast('删除新闻成功', { variant: 'success' });
			this.refreshTable();
		},
		setSelectedId(rows) {
			this.selectedId = rows.length > 0 ? rows[0].id : null;
		},
		async getAllCityList() {
			this.meta.cityList = await this.$app.Api.City.query();
		},
	},
	mounted() {
		this.getAllCityList();
	}
};
</script>

<style>
.col-href {
	width: 3em;
	text-align: center;
}

.col-abstract {
	width: 20em;
}

.col-thumb {
	width: 4em;
}

.previewer {
	width: 80px;
	height: 60px;
}
</style>
