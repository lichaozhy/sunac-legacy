<template>

<b-container
	fluid
	id="app-page-workbench-maintainer"
	class="py-3"
>
	<b-breadcrumb class="border-0 mb-3">
		<b-breadcrumb-item
			active
		>内容管理员</b-breadcrumb-item>
		<b-breadcrumb-item
			active
		>创建</b-breadcrumb-item>
	</b-breadcrumb>

	<h3>基本信息</h3><hr>

	<ul class="list-unstyled">
		<li>用户名至少4个字符</li>
		<li>密码至少1个字符</li>
	</ul>

	<b-form
		class="w-50"
		@submit.prevent="createAdministrator"
	>
		<b-form-group
			label="用户名"
		>
			<b-form-input
				v-model="form.name"
			/>
		</b-form-group>
		<b-form-group
			label="初始密码"
		>
			<b-input-group>
				<b-form-input
					v-model="form.password"
				/>
				<template #append>
					<b-button
						variant="primary"
						@click="rollPassword"
					>随机</b-button>
					<b-button
						variant="danger"
						@click="resetPassword"
					>重置</b-button>
				</template>
			</b-input-group>
		</b-form-group>

		<b-button
			type="submit"
			variant="success"
			:disabled="!isValid"
		>创建</b-button>
	</b-form>

	<h3 class="mt-3">管理的城市</h3><hr>
</b-container>

</template>

<script>
export default {
	data() {
		return {
			cityList: [],
			form: {
				name: '',
				password: '',
				cityMap: {}
			}
		};
	},
	computed: {
		isValid() {
			return this.form.name.length >= 4 && this.form.password.length > 0;
		}
	},
	methods: {
		resetPassword() {
			this.form.password = '';
		},
		rollPassword() {
			this.form.password = Math.random().toString(16).substr(2, 8);
		},
		async queryAdministratorListByName() {
			return this.$app.Api.Administrator.query({
				name: this.form.name
			});
		},
		async createAdministrator() {
			const existedAdministratorList = await this.queryAdministratorListByName();

			if (existedAdministratorList.length > 0) {
				return this.$bvToast.toast('该用户名已经被注册', { variant: 'danger' });
			}

			await this.$app.Api.Administrator.create({
				name: this.form.name,
				credential: {
					password: this.form.password
				},
				cityList: Object.keys(this.form.cityMap)
			});

			await this.$router.push({ name: 'Workbench.Administrator.Overview' });
		},
		async getCityList() {
			this.cityList = await this.$app.Api.City.query();
		}
	},
	mounted() {
		this.getCityList();
	}
};
</script>
