<template>

<b-container
	fluid
	id="app-page-workbench-maintainer"
	class="py-3"
>
	<b-breadcrumb class="border-0 mb-3">
		<b-breadcrumb-item
			active
		>总览</b-breadcrumb-item>
	</b-breadcrumb>

	<ul class="list-unstyled">
		<li>根据管理要求，您不能在这里对本账号进行操作</li>
	</ul>

	<b-button-toolbar
		class="mb-3"
	>
		<b-button
			variant="success"
			class="mr-auto"
			:to="{ name: 'Workbench.Maintainer.Creation' }"
		>创建</b-button>
		<b-button
			variant="primary"
			class="mr-auto"
			:disabled="selectedId === null"
			:to="{
				name: 'Workbench.Maintainer.Detail',
				params: { maintainerId: selectedId }
			}"
		>查看</b-button>
		<b-button
			variant="danger"
			:disabled="selectedId === null"
		>删除</b-button>
	</b-button-toolbar>

	<b-table
		:items="maintainerListWithoutCurrent"
		:fields="maintainerFieldList"
		small
		bordered
		hover
		select-mode="single"
		selectable
		@row-selected="setSelectedId"
	>
		<template #cell(createdAt)="row">
			{{ row.item.createdAt | localDatetime }}
		</template>
	</b-table>
</b-container>

</template>

<script>
export default {
	data() {
		return {
			maintainerList: [],
			selectedId: null
		};
	},
	computed: {
		maintainerListWithoutCurrent() {
			const currentMaintainerId = this.$store.state.principal.maintainerId;

			return this.maintainerList.filter(maintainer => maintainer.id !== currentMaintainerId);
		},
		maintainerFieldList() {
			return [
				{ key: 'name', label: '用户名' },
				{ key: 'createdAt', label: '创建于', class: 'col-datetime' }
			];
		}
	},
	methods: {
		async getMaintainerList() {
			this.maintainerList = await this.$app.Api.Maintainer.query();
		},
		setSelectedId(selectedList) {
			this.selectedId = selectedList.length > 0
				? selectedList[0].id
				: null;
		}
	},
	mounted() {
		this.getMaintainerList();
	}
};
</script>

<style>

</style>
