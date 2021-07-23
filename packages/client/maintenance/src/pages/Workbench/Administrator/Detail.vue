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
		>管理员：{{ administrator.name }}</b-breadcrumb-item>
	</b-breadcrumb>

	<h3>基本信息</h3><hr>

	<b-form
		class="w-50"
	>
		<b-form-group
			label="用户名"
		>
			<b-form-input
				:value="administrator.name"
				readonly
			/>
		</b-form-group>
		<b-form-group
			label="重置密码"
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
						@click="updateAdministrator"
						:disabled="!form.password"
					>修改</b-button>
				</template>
			</b-input-group>
		</b-form-group>
	</b-form>

	<h3 class="mt-3">管理的城市</h3><hr>

	<b-button-toolbar>
		<b-button-group class="ml-auto mr-5">
			<b-button
				variant="primary"
				@click="selectAll"
			>全选</b-button>
			<b-button
				variant="primary"
				@click="unselectAll"
			>全不选</b-button>
		</b-button-group>
		<b-button
			variant="success"
			class="mr-auto"
			:disabled="!isCityMapChanged"
			@click="saveCity"
		>保存城市修改</b-button>
	</b-button-toolbar>

	<b-row class="mt-3">
		<b-col
			cols="3"
			v-for="city in cityList"
			:key="city.adcode"
		>
			<b-form-checkbox
				v-model="form.cityMap[city.adcode]"
			>{{ city.name }}</b-form-checkbox>
		</b-col>
	</b-row>

</b-container>

</template>

<script>
export default {
	data() {
		return {
			cityList: [],
			administrator: {
				id: '',
				name: '',
				createdAt: '',
				cityList: []
			},
			form: {
				name: '',
				password: '',
				cityMap: {}
			}
		};
	},
	computed: {
		administratorId() {
			return this.$route.params.administratorId;
		},
		isCityMapChanged() {
			return this.cityList.some(city => {
				return this.form.cityMap[city.adcode] !==
					(this.administrator.cityList.indexOf(city.adcode) !== -1);
			});
		}
	},
	methods: {
		selectAll() {
			this.cityList.forEach(city => this.form.cityMap[city.adcode] = true);
		},
		unselectAll() {
			this.cityList.forEach(city => this.form.cityMap[city.adcode] = false);
		},
		resetPassword() {
			this.form.password = '';
		},
		rollPassword() {
			this.form.password = Math.random().toString(16).substr(2, 8);
		},
		async getAdministrator() {
			this.administrator = await this.$app.Api.Administrator(this.administratorId).get();
			this.administrator.cityList.forEach(adcode => this.form.cityMap[adcode] = true);
		},
		async updateAdministrator() {
			await this.$app.Api.Administrator(this.administratorId).update({
				name: this.form.name,
				credential: {
					password: this.form.password
				},
				cityList: Object.keys(this.form.cityMap)
					.filter(adcode => this.form.cityMap[adcode])
			});

			this.form.password = '';
			this.$bvToast.toast('修改内容管理员密码成功', { variant: 'success' });
		},
		async getCityList() {
			this.cityList = await this.$app.Api.City.query();
			this.cityList.forEach(city => {
				this.$set(this.form.cityMap, city.adcode, false);
			});
		},
		async saveCity() {
			const changedCityMap = {};

			this.cityList.forEach(city => {
				const { adcode } = city;
				const currentValue = this.form.cityMap[adcode];

				if (currentValue !== (this.administrator.cityList.indexOf(adcode) !== -1)) {
					changedCityMap[adcode] = this.form.cityMap[adcode];
				}
			});

			const iAdministrator = this.$app.Api.Administrator(this.administratorId);
			const updatingList = [];

			for (const adcode in changedCityMap) {
				const updating = changedCityMap[adcode] ? iAdministrator.City.create({
					administratorId: this.administratorId,
					adcode
				}) : iAdministrator.City.delete(adcode);

				updatingList.push(updating);
			}

			await Promise.all(updatingList);
			await this.getAdministrator();
		}
	},
	async mounted() {
		await this.getCityList();
		await this.getAdministrator();
	}
};
</script>

<style>

</style>
