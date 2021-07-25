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
			<b-card
				header="内容管理端登录"
			>
				<b-form
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
							autocomplete="on"
							v-model="form.password"
						/>
					</b-form-group>
					<b-button
						type="submit"
						block
						variant="success"
					>登录</b-button>
				</b-form>
			</b-card>
		</b-col>
	</b-row>
</b-container>

</template>

<script>
function Form() {
	return {
		name: '',
		password: ''
	};
}

export default {
	data() {
		return {
			form: Form()
		};
	},
	methods: {
		async signin() {
			try {
				await this.$store.dispatch('signin', {
					username: this.form.name,
					password: this.form.password
				});

				this.$router.push({ name: 'Workbench' });
			} catch (err) {
				this.$bvToast.toast('用户名或密码错误', { variant: 'danger' });
				this.form = Form();
			}
		}
	}
};
</script>
