<template>

<div>
	<h4>所有话题</h4><hr>

	<b-button-toolbar>
		<b-form-input
			v-model="keyword"
			class="mr-0"
			style="width:9em"
			placeholder="标题关键字"
		/>
		<b-button
			variant="primary"
			class="mr-3"
			@click="getAllTopicList"
		>搜索</b-button>

		<b-input-group
			prepend="城市"
			class="mr-3"
		>
			<b-form-select
				:options="cityOptionList"
				style="width: 6em"
				v-model="city"
				@change="getAllTopicList"
			></b-form-select>
		</b-input-group>

		<b-form-radio-group
			buttons
			class="mr-auto"
			button-variant="primary"
			v-model="validated"
			@change="getAllTopicList"
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
			class="mb-0 mr-auto"
		></b-pagination>

		<b-button
			@click="requestCreatingTopic"
			variant="success"
		>创建</b-button>
	</b-button-toolbar>

	<b-row class="align-items-stretch">
		<b-col
			v-for="topic in meta.topicList"
			:key="topic.id"
			cols="4"
			class="mt-3"
		>
			<b-card
				no-body
				footer-class="py-1 px-2"
				class="position-relative app-topic-item justify-content-between h-100"
				@click="requestViewTopic(topic.id)"
			>
				<div
					class="position-absolute"
					style="top: 10px; left: 10px; background: rgba(0,0,0,0.3); color:#fff"
				>{{ cityMap[topic.city].name }}</div>

				<b-aspect
					aspect="16:9"
					class="app-photo-thumb"
					style="background-color: #f0f0f0; cursor: pointer"
					:style="{
						'background-image': `url(/api/image/${topic.banner}/image.png)`
					}"
				>
				</b-aspect>

				<p class="m-3 h-100">{{ topic.description.substr(0, 50) }}...</p>

				<template #footer>
					<div
						style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
					><small>{{ topic.title }}</small></div>
					<b-button-toolbar class="align-items-center">
						<div
							class="text-right mr-auto"
						><small>{{ topic.createdAt | localDatetime }}</small></div>
						<b-button
							variant="primary"
							class="mr-1"
							:disabled="!managedCityMap[topic.city] || topic.createdAt !== null"
							@click.stop="validateTopic(topic.id)"
						><b-icon-check2-circle /></b-button>
						<b-button
							variant="danger"
							:disabled="!managedCityMap[topic.city]"
							@click.stop="deleteTopic(topic.id)"
						><b-icon-trash /></b-button>
					</b-button-toolbar>
					<div>
						<b-avatar
							:src="topic.createdBy.wechat.headimgurl"
							size="sm"
							class="mr-1"
						/><small>{{ topic.createdBy.wechat.nickname }}</small>
					</div>
				</template>
			</b-card>
		</b-col>

	</b-row>

	<app-topic-creation ref="creation" @created="getAllTopicList" />
	<app-topic-detail ref="detail" />
</div>

</template>

<script>
import AppTopicCreation from './Creation.vue';
import AppTopicDetail from './Detail.vue';

export default {
	components: {
		AppTopicCreation,
		AppTopicDetail
	},
	data() {
		return {
			meta: {
				topicList: [],
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
	computed: {
		cityOptionList() {
			const managedCityOptionList = this.meta.cityList.map(city => {
				return { text: city.name, value: city.adcode };
			});

			return [{ text: '全部', value: null }].concat(managedCityOptionList);
		},
		isSelectedDeletable() {
			if (this.selectedId === null) {
				return false;
			}

			const topicCity = this.meta.topicList
				.find(topic => topic.id === this.selectedId).city;

			return this.meta.managedCityList.some(adcode => adcode === topicCity);
		},
		managedCityMap() {
			const map = {};

			this.meta.managedCityList.forEach(adcode => map[adcode] = true);

			return map;
		},
		cityMap() {
			const map = {};

			this.meta.cityList.forEach(city => map[city.adcode] = city);

			return map;
		}
	},
	methods: {
		requestCreatingTopic() {
			this.$refs.creation.open();
		},
		requestViewTopic(topicId) {
			this.$refs.detail.open(topicId);
		},
		async deleteTopic(topicId) {
			await this.$app.Api.Topic(topicId).delete();
			this.getAllTopicList();
		},
		async validateTopic(topicId) {
			await this.$app.Api.Topic(topicId).update();
			this.getAllTopicList();
		},
		async getAllTopicList() {
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

			if (this.keyword) {
				query.title = this.keyword;
			}

			const { list, total } = await this.$app.Api.Topic.query(query);

			list.forEach(topic => {
				topic.cityName = this.meta.cityList.find(city => city.adcode === topic.city).name;
			});

			this.meta.topicList = list;
			this.pagination.total = total;
		},
		async getAdministrator() {
			const { cityList } = await this.$app.Api.Principal.Administrator.get();

			this.meta.managedCityList = cityList;
		},
		async getAllCityList() {
			this.meta.cityList = await this.$app.Api.City.query();
		},
	},
	async mounted() {
		await this.getAllCityList();
		await this.getAdministrator();
		this.getAllTopicList();
	}
};
</script>

<style>
@keyframes expanding {
  from {
		transform: scale(1);
	}

  to {
		transform: scale(1.02);
	}
}

.app-topic-item:hover {
	animation: expanding 0.3s;
	transform: scale(1.02);
}
</style>
