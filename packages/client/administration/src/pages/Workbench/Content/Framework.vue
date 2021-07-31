<template>

<b-container class="pt-3">
	<b-breadcrumb>
    <b-breadcrumb-item
			:to="{ name: 'Home' }"
		>首页</b-breadcrumb-item>
    <b-breadcrumb-item
			active
		>官方内容</b-breadcrumb-item>
	</b-breadcrumb>

	<b-row>
		<b-col xxl="2" xl="3">
			<b-list-group>
				<b-list-group-item
					:to="{ name: 'Workbench.Content.Reference' }"
				>非遗新闻</b-list-group-item>
				<b-list-group-item
					:to="{ name: 'Workbench.Content.Photo' }"
				>相册</b-list-group-item>
			</b-list-group>

			<b-list-group class="mt-3">
				<b-list-group-item
					:to="{ name: 'Workbench.Content.Banner' }"
				>城市BANNER</b-list-group-item>
			</b-list-group>
		</b-col>

		<b-col>
			<router-view></router-view>
		</b-col>
	</b-row>
</b-container>

</template>

<script>
export default {

};
</script>

<style>

</style>
