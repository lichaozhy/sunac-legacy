<template>

<div>
	<h4>非遗圈的分享（作品）</h4><hr>

	<b-button-toolbar>
		<b-input-group
			prepend="按城市"
		>
			<b-form-select
				:options="cityOptionList"
				style="width: 8em"
				class="mr-auto"
				v-model="city"
				@change="getShareList"
			></b-form-select>
		</b-input-group>

		<b-form-radio-group
			buttons
			class="mx-auto"
			button-variant="primary"
			v-model="validated"
			@change="getShareList"
		>
			<b-form-radio :value="null">全部</b-form-radio>
			<b-form-radio :value="true">已审核</b-form-radio>
			<b-form-radio :value="false">未审核</b-form-radio>
		</b-form-radio-group>

		<b-pagination
			v-model="pagination.current"
			:per-page="pagination.size"
			:total-rows="pagination.total"
			size="sm"
			class="mb-0 mx-auto"
		></b-pagination>

		<b-button
			variant="success"
			@click="requestCreatingReference"
		>创建</b-button>
	</b-button-toolbar>

	<app-share-creation
		ref="creation"
	/>
</div>

</template>

<script>
import AppShareCreation from './Creation.vue';

export default {
	components: { AppShareCreation },
	data() {
		return {
			meta: {
				shareList: [],
				cityList: [],
				managedCityList: []
			},
			validated: null,
			city: null,
			keyword: '',
			pagination: {
				current: 1,
				total: 100,
				size: 20
			},
			selectedId: null
		};
	},
	computed: {
		cityOptionList() {
			const managedCityOptionList = this.meta.cityList.map(city => {
				return { text: city.name, value: city.adcode };
			});

			return [{ text: '全部', value: null }].concat(managedCityOptionList);
		}
	},
	methods: {
		requestCreatingReference() {
			this.$refs.creation.open();
		},
		refreshTable() {

		},
		async getAdministrator() {
			const { cityList } = await this.$app.Api.Principal.Administrator.get();

			this.meta.managedCityList = cityList;
		},
		async getAllCityList() {
			this.meta.cityList = await this.$app.Api.City.query();
		},
		async getShareList() {
			const query = {
				pageSize: this.pagination.size,
				pageCurrent: this.pagination.current
			};

			if (this.city !== null) {
				query.city = this.city;
			}

			if (this.validated !== null) {
				query.validated = this.validated;
			}

			const { list, total } = await this.$app.Api.Share.query(query);

			this.meta.shareList = list;
			this.pagination.total = total;
		}
	},
	async mounted() {
		await this.getAllCityList();
		await this.getAdministrator();
		this.getShareList();
	}
};
</script>

<style>

</style>
