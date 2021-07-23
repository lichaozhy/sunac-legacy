<template>

<b-container
	fluid
	id="app-page-workbench-maintainer"
	class="py-3"
>
	<b-breadcrumb class="border-0 mb-3">
		<b-breadcrumb-item
			active
		>我的</b-breadcrumb-item>
	</b-breadcrumb>

	<h3>修改密码</h3><hr>

	<b-form
		class="w-50"
		@submit.prevent="updateMaintainerCredential"
	>
		<b-form-group
			label="旧密码"
		>
			<b-form-input
				type="password"
				v-model="form.origin"
			/>
		</b-form-group>
		<b-form-group
			label="新密码"
		>
			<b-form-input
				type="password"
				v-model="form.target"
			/>
		</b-form-group>
		<b-form-group
			label="确认新密码"
		>
			<b-form-input
				type="password"
				v-model="form.confirm"
			/>
		</b-form-group>

		<b-button
			type="submit"
			variant="success"
			:disabled="!isValid"
		>保存修改</b-button>
	</b-form>
</b-container>

</template>

<script>
function Form() {
	return {
		origin: '',
		target: '',
		confirm: ''
	};
}

export default {
	data() {
		return {
			form: Form()
		};
	},
	computed: {
		isValid() {
			return this.form.origin &&
				this.form.target &&
				this.form.target !== this.form.origin &&
				this.form.target === this.form.confirm;
		}
	},
	methods: {
		reset() {
			this.form = Form();
		},
		async updateMaintainerCredential() {
			try {
				await this.$app.Api.Principal.Maintainer.update({
					credential: {
						_password: this.form.origin,
						password: this.form.target
					}
				});

				this.$bvToast.toast('修改成功', {
					variant: 'success'
				});
				this.reset();
			} catch (err) {
				this.$bvToast.toast('修改失败', {
					variant: 'danger'
				});
			}
		}
	}
};
</script>

<style>

</style>
