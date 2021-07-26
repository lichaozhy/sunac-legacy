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
			<b-list-group>
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

			<b-form-group
				label="选择代表城市"
				class="mt-3"
			>
				<b-form-select
					v-model="currentCity"
					:disabled="!hasCustomer"
					:options="cityOptionList"
					@change="updateCustomer"
				></b-form-select>
				<b-form-text
					v-if="!hasCustomer"
				>您尚未绑定普通用户身份，不能参与互动，点击<b-link
					class="mx-1"
					:to="{ name: 'Workbench.Setting.Profile' }"
				>绑定</b-link></b-form-text>
				<b-form-text
					v-if="hasCustomer"
				>提示：此处“所代表城市”不同于“管辖城市”，其内涵与您以普通用户在公众号H5端的定义一致</b-form-text>
			</b-form-group>
		</b-col>
		<b-col>
			<router-view>Present Panel</router-view>
		</b-col>
	</b-row>
</b-container>

</template>

<script>
export default {
	data() {
		return {
			currentCity: null,
			meta: {
				cityList: [],
				customerId: ''
			}
		};
	},
	computed: {
		hasCustomer() {
			return Boolean(this.meta.customerId);
		},
		cityOptionList() {
			return [
				{ text: '请选择', value: null }
			].concat(this.meta.cityList.map(city => {
				return { text: city.name, value: city.adcode };
			}));
		}
	},
	methods: {
		async getAllCityList() {
			this.meta.cityList = await this.$app.Api.City.query();
		},
		async getAdministrator() {
			const { customer } = await this.$app.Api.Principal.Administrator.get();

			if (customer) {
				this.meta.customerId = customer.id;
				this.currentCity = customer.cityAs;
			}
		},
		async updateCustomer() {
			await this.$app.Api.Principal.Administrator.Customer.update({
				cityAs: this.currentCity
			});

			this.$bvToast.toast('修改“所在城市”成功！', { variant: 'success' });
			await this.getAdministrator();
		}
	},
	mounted() {
		this.getAllCityList();
		this.getAdministrator();
	}
};
</script>
