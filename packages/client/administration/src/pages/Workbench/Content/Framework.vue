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
				>城市首页轮播图</b-list-group-item>
				<b-list-group-item
					:to="{ name: 'Workbench.Content.Photo' }"
				>活动相册</b-list-group-item>
				<b-list-group-item
					:to="{ name: 'Workbench.Content.News' }"
				>活动报道</b-list-group-item>
				<b-list-group-item
					:to="{ name: 'Workbench.Content.Figure' }"
				>非遗传承人</b-list-group-item>
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
