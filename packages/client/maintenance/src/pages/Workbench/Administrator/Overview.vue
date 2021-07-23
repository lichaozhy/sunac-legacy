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
				params: { administratorId: selectedId }
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
		:filter="keyword"
	>
		<template #cell(createdAt)="row">
			{{ row.item.createdAt | localDatetime }}
		</template>

		<template #cell(cityCount)="row">
			{{ row.item.cityList.length }}
		</template>

		<template #cell(customer)="row">
			{{ row.item.customer ? '√' : '×' }}
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
				{ key: 'name', label: '用户名', sortable: true },
				{ key: 'cityCount', label: '城市数', class: '.col-short-number col-city-count' },
				{ key: 'customer', label: '绑定微信?', class: 'col-checkbox col-bind' },
				{ key: 'createdAt', label: '创建于', class: 'col-datetime', sortable: true }
			];
		}
	},
	methods: {
		setSelectedId(selectedList) {
			this.selectedId = selectedList.length > 0
				? selectedList[0].id
				: null;
		},
		async getAdministratorList() {
			this.administratorList = await this.$app.Api.Administrator.query();
		},
		async deleteSelectedAdministrator() {
			await this.$app.Api.Administrator(this.selectedId).delete();
			await this.getAdministratorList();
			this.selectedId = null;
		}
	},
	mounted() {
		this.getAdministratorList();
	}
};
</script>

<style lang="scss">
.col-bind {
	width: 6em;
}

.col-city-count {
	width: 4em;
}
</style>
