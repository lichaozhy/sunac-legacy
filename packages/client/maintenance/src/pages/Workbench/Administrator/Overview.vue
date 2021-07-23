<template>

<b-container
	fluid
	id="app-page-workbench-maintainer"
	class="py-3"
>
	<b-breadcrumb class="border-0 mb-3">
		<b-breadcrumb-item
			active
		>内容管理员</b-breadcrumb-item>
		<b-breadcrumb-item
			active
		>总览</b-breadcrumb-item>
	</b-breadcrumb>

	<b-button-toolbar
		class="mb-3"
	>
		<b-button
			variant="success"
			class="mr-auto"
			:to="{ name: 'Workbench.Administrator.Creation' }"
		>创建</b-button>

		<b-input-group
			class="mr-1"
			prepend="过滤"
		>
			<b-form-input
				v-model="keyword"
			/>
		</b-input-group>
		<b-button
			variant="primary"
			class="mr-auto"
			:disabled="selectedId === null"
			:to="{
				name: 'Workbench.Administrator.Detail',
				params: { maintainerId: selectedId }
			}"
		>查看</b-button>

		<b-button
			variant="danger"
			:disabled="selectedId === null"
			@click="deleteSelectedAdministrator"
		>删除</b-button>
	</b-button-toolbar>

	<b-table
		:items="administratorList"
		:fields="administratorFieldList"
		small
		bordered
		hover
		select-mode="single"
		selectable
		show-empty
		@row-selected="setSelectedId"
	>
		<template #cell(createdAt)="row">
			{{ row.item.createdAt | localDatetime }}
		</template>

		<template #empty>
			<b-link
				:to="{ name: 'Workbench.Administrator.Creation' }"
			><b class="mr-1">创建</b></b-link>其他内容管理员
		</template>
	</b-table>
</b-container>

</template>

<script>
export default {
	data() {
		return {
			keyword: '',
			administratorList: [],
			selectedId: null
		};
	},
	computed: {
		administratorFieldList() {
			return [
				{ key: 'name', label: '用户名' },
				{ key: 'createdAt', label: '创建于', class: 'col-datetime', sortable: true }
			];
		}
	},
	methods: {
		setSelectedId() {

		},
		async getAdministratorList() {
			this.administratorList = await this.$app.Api.Administrator.query();
		},
		deleteSelectedAdministrator() {

		}
	},
	mounted() {
		this.getAdministratorList();
	}
};
</script>
