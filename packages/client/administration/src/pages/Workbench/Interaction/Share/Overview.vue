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
				@change="refreshTable"
			></b-form-select>
		</b-input-group>

		<b-form-radio-group
			buttons
			class="mx-auto"
			button-variant="primary"
			v-model="validated"
			@change="refreshTable"
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
			variant="danger"
			@click="deleteShare"
			:disabled="selectedId === null || !isSelectedDeletable"
			class="mr-1"
		>删除</b-button>

		<b-button
			variant="primary"
			@click="requestViewShare"
			:disabled="selectedId === null"
			class="mr-1"
		>查看</b-button>
		<b-button
			variant="success"
			@click="requestCreatingShare"
		>创建</b-button>
	</b-button-toolbar>

	<b-table
		class="mt-3"
		ref="table"
		:items="meta.shareList"
		:fields="shareFieldList"
		small
		bordered
		:per-page="pagination.size"
		:current-page="pagination.current"
		show-empty
		select-mode="single"
		selectable
		@row-selected="setSelectedId"
		hover
		:busy="isBusy"
	>
		<template #cell(headimg)="row">
			<b-avatar
				:src="row.item.createdBy.wechat.headimgurl"
				size="sm"
			></b-avatar>
		</template>

		<template #cell(nickname)="row">
			{{ row.item.createdBy.wechat.nickname }}
		</template>

		<template #cell(createdAt)="row">
			{{ row.item.createdAt | localDatetime }}
		</template>

		<template #cell(words)="row">
			{{ row.item.raw.length }}
		</template>

		<template #cell(images)="row">
			{{ row.item.imageList.length }}
		</template>

		<template #cell(abstract)="row">
			{{ row.item.raw.substr(0, 100) }}
		</template>

		<template #cell(city)="row">
			{{ row.item.cityName }}
		</template>

		<template #cell(validated)="row">
			{{ row.item.validatedAt ? '√' : '' }}
		</template>

		<template #cell(title)="row">
			<div :title="row.item.title">{{ row.item.title | subtitle }}</div>
		</template>

		<template #empty>
			没有符合要求的条目
		</template>

	</b-table>

	<app-share-creation ref="creation" @created="refreshTable" />
	<app-share-detail ref="detail" @validated="refreshTable" />
</div>

</template>

<script>
import AppShareCreation from './Creation.vue';
import AppShareDetail from './Detail.vue';

export default {
	components: { AppShareCreation, AppShareDetail },
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
			selectedId: null,
			isBusy: true
		};
	},
	filters: {
		subtitle(string) {
			return string.length < 8 ? string : `${string.substr(0, 8)}...`;
		}
	},
	computed: {
		cityOptionList() {
			const managedCityOptionList = this.meta.cityList.map(city => {
				return { text: city.name, value: city.adcode };
			});

			return [{ text: '全部', value: null }].concat(managedCityOptionList);
		},
		shareFieldList() {
			return [
				{ key: 'validated', label: '审核', class: 'col-tiny-string' },
				{ key: 'city', label: '城市', class: 'col-tiny-string' },
				{ key: 'title', label: '标题', class: 'col-short-string' },
				{ key: 'headimg', label: '头像', class: 'col-tiny-string text-center' },
				{ key: 'nickname', label: '作者昵称', class: 'col-short-string' },
				{ key: 'abstract', label: '节选(100字以内)' },
				{ key: 'like', label: '👍', class: 'col-tiny-number text-center' },
				{ key: 'words', label: '字数', class: 'col-tiny-string text-center' },
				{ key: 'images', label: '图片数', class: 'col-tiny-string text-center' },
				{ key: 'createdAt', label: '创建于', class: 'col-datetime' },
			];
		},
		isSelectedDeletable() {
			if (this.selectedId === null) {
				return false;
			}

			const shareCity = this.meta.shareList
				.find(share => share.id === this.selectedId).city;

			return this.meta.managedCityList.some(adcode => adcode === shareCity);
		}
	},
	methods: {
		setSelectedId(rows) {
			this.selectedId = rows.length > 0 ? rows[0].id : null;
		},
		requestCreatingShare() {
			this.$refs.creation.open();
		},
		requestViewShare() {
			this.$refs.detail.open(this.selectedId);
		},
		async deleteShare() {
			await this.$app.Api.Share(this.selectedId).delete();
			this.refreshTable();
		},
		async getAdministrator() {
			const { cityList } = await this.$app.Api.Principal.Administrator.get();

			this.meta.managedCityList = cityList;
		},
		async getAllCityList() {
			this.meta.cityList = await this.$app.Api.City.query();
		},
		async refreshTable() {
			this.selectedId = null;

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

			list.forEach(share => {
				share.cityName = this.meta.cityList.find(city => city.adcode === share.city).name;
			});

			this.meta.shareList = list;
			this.pagination.total = total;
		}
	},
	async mounted() {
		await this.getAllCityList();
		await this.getAdministrator();
		this.isBusy = false;
		this.refreshTable();
	}
};
</script>

<style>

</style>
