<template>

<b-container class="pt-3">
	<b-breadcrumb>
    <b-breadcrumb-item
			:to="{ name: 'Home' }"
		>首页</b-breadcrumb-item>
    <b-breadcrumb-item
			active
		>管理员设置</b-breadcrumb-item>
	</b-breadcrumb>

	<b-row>
		<b-col xxl="2" xl="3">
			<b-list-group>
				<b-list-group-item
					:to="{ name: 'Workbench.Setting.Profile' }"
				>基本信息</b-list-group-item>
			</b-list-group>
		</b-col>
		<b-col>
			<router-view>Present Panel</router-view>
		</b-col>
	</b-row>
</b-container>

</template>
