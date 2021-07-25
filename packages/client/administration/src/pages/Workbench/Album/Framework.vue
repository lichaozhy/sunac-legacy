<template>

<b-container class="pt-3">
	<b-breadcrumb>
    <b-breadcrumb-item
			:to="{ name: 'Home' }"
		>首页</b-breadcrumb-item>
    <b-breadcrumb-item
			active
		>相册</b-breadcrumb-item>
	</b-breadcrumb>

	<b-row>
		<b-col xxl="2" xl="3">
			<b-form-group
				label="切换城市"
			>
				<b-form-select></b-form-select>
			</b-form-group>

			<b-list-group class="mt-3">
				<b-list-group-item
					:to="{ name: 'Workbench.Album.Overview' }"
				>总览</b-list-group-item>
				<b-list-group-item
					:to="{ name: 'Workbench.Album.Creation' }"
				>上传新照片</b-list-group-item>
			</b-list-group>
		</b-col>
		<b-col>
			<router-view>Present Panel</router-view>
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
