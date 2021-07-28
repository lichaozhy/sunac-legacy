<template>

<div>
	<h4>所有话题</h4><hr>

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

		<b-input-group
			prepend="按城市"
		>
			<b-form-select
				:options="cityOptionList"
				style="width: 8em"
				class="mr-auto"
				v-model="city"
				@input="refreshTable"
			></b-form-select>
		</b-input-group>

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
</div>

</template>

<script>
export default {

};
</script>

<style>

</style>
