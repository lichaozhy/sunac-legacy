<template>

<b-container class="pt-3">
	<b-breadcrumb>
    <b-breadcrumb-item
			:to="{ name: 'Home' }"
		>首页</b-breadcrumb-item>
    <b-breadcrumb-item
			active
		>互动中心</b-breadcrumb-item>
	</b-breadcrumb>

	<b-row>
		<b-col xxl="2" xl="3">
			<b-form-group
				label="选择代表城市"
			>
				<b-form-select></b-form-select>
			</b-form-group>
			<b-list-group class="mt-3">
				<b-list-group-item
					:to="{ name: 'Workbench.Interaction.Comment' }"
				>外引用</b-list-group-item>
				<b-list-group-item
					:to="{ name: 'Workbench.Interaction.Topic' }"
				>话题</b-list-group-item>
				<b-list-group-item
					:to="{ name: 'Workbench.Interaction.Share' }"
				>非遗圈分享</b-list-group-item>
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
