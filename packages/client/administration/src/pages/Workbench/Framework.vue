<template>

<div>
	<b-navbar
		type="dark"
		variant="dark"
		class="py-0"
	>
		<b-navbar-brand
			:to="{ name: 'Home' }"
		><b-icon-box-seam /></b-navbar-brand>

		<b-navbar-nav>
			<b-nav-item
				:to="{ name: 'Workbench.Validation' }"
			>审核中心</b-nav-item>
			<b-nav-item
				:to="{ name: 'Workbench.Album' }"
			>相册</b-nav-item>
			<b-nav-item
				:to="{ name: 'Workbench.Interaction' }"
			>互动中心</b-nav-item>
		</b-navbar-nav>

		<b-navbar-nav class="ml-auto">
			<b-nav-item
				:to="{ name: 'Workbench.Setting' }"
			>运营管理员：{{ administrator.name }}</b-nav-item>

			<b-nav-item
				@click="signout"
			><b-icon-door-open-fill  /></b-nav-item>
		</b-navbar-nav>
	</b-navbar>

	<router-view style="padding-bottom:400px">Workbench Framework</router-view>
</div>

</template>

<script>
export default {
	data() {
		return {
			administrator: {
				id: '',
				name: '',
			},
		};
	},
	computed: {

	},
	methods: {
		async getPrincipalAdministrator() {
			this.administrator = await this.$app.Api.Principal.Administrator.get();
		},
		async signout() {
			await this.$app.Api.Principal.signout();
			await this.$router.push({ name: 'Signin' });
		}
	},
	mounted() {
		this.getPrincipalAdministrator();
	}
};
</script>

<style>

</style>
