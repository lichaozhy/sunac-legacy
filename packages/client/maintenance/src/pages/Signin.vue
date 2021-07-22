<template>

<b-container
	id="app-page-signin"
	class="d-flex flex-column justify-content-center"
>
	<b-row>
		<b-col
			xl="4" offset-xl="4"
			lg="6" offset-lg="3"
			md="8" order-md="2"
			sm="12"
		>
			<b-form
				class="border"
				@submit.prevent="signin"
			>
				<b-form-group
					label="用户名"
				>
					<b-form-input
						v-model.trim="form.name"
					/>
				</b-form-group>

				<b-form-group
					label="密码"
				>
					<b-form-input
						type="password"
						v-model="form.password"
					/>
				</b-form-group>
				<b-button
					type="submit"
					block
					variant="success"
				>登录</b-button>
			</b-form>
		</b-col>
	</b-row>
</b-container>

</template>

<script>
export default {
	data() {
		return {
			form: {
				name: '',
				password: ''
			}
		};
	},
	methods: {
		async signin() {
			await this.$store.dispatch('signin', {
				username: this.form.name,
				password: this.form.password
			});

			this.$router.push({ name: 'Workbench' });
		}
	}
};
</script>
