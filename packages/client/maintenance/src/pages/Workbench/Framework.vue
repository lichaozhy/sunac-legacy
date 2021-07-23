<template>

<b-container
	id="app-page-workbench"
	class="d-flex flex-column justify-content-center"
	fluid
>
	<b-row class="h-75">
		<b-col
			xl="8"
			offset-xl="2"
			cols="12"
			class="h-100"
		>
			<b-card
				no-body
				class="h-100"
			>
				<template #header>
					<div class="text-center">融创上海区非物质文化遗产社区 - 运维控制台</div>
				</template>

				<b-row no-gutters class="h-100">
					<b-col
						cols="3"
						class="bg-light d-flex flex-column justify-content-between"
					>
						<b-nav vertical pills class="p-3">
							<b-nav-item
								:to="{ name: 'Workbench.Maintainer' }"
							>运维管理员</b-nav-item>
							<b-nav-item
								:to="{ name: 'Workbench.Administrator' }"
							>内容管理员</b-nav-item>
							<b-nav-item
								:to="{ name: 'Workbench.Principal.Maintainer' }"
							>我是:{{ currentMaintainer.name }}</b-nav-item>
						</b-nav>

						<b-button-toolbar class="p-3">
							<b-button
								@click="signout"
								block
								variant="link"
							>登出</b-button>
						</b-button-toolbar>
					</b-col>
					<b-col cols="9">
						<router-view
							id="czbank-rusher-workbench"
							class="h-100"
						></router-view>
					</b-col>
				</b-row>
			</b-card>
		</b-col>
	</b-row>
</b-container>

</template>

<script>
export default {
	data() {
		return {
			currentMaintainer: {
				id: '',
				name: '',
				createdAt: ''
			}
		};
	},
	methods: {
		async signout() {
			await this.$store.dispatch('signout');
			await this.$router.push({ name: 'Signin' });
		},
		async getCurrentMaintainer() {
			this.currentMaintainer = await this.$app.Api.Principal.Maintainer.get();
		}
	},
	mounted() {
		this.getCurrentMaintainer();
	}
};
</script>

<style>

</style>
