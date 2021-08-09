<template>

<div
	id="app-figure"
	style="background-color:#fafafa"
>

	<b-link
		href="https://fkwcd.cn/v/24ojmZ65"
	><b-img src="./image/banner.png" class="w-100" /></b-link>

	<div
		style="background-color:#fff"
		class="p-2"
	>
		<h5 class="mt-2 font-weight-bold">#咱的非遗去哪啦#</h5>
		<p
			class="text-black-50"
		>非遗，听起来遥不可及，原来，它一直就在我们身边，盘点一下我们生活中你不知道的非遗——</p>
	</div>

	<b-button-toolbar class="mt-3">
		<b-nav class="font-weight-bold app-nav mr-auto">
			<b-nav-item
				v-for="mode in modeList"
				:key="mode.value"
				:active="currentMode === mode.value"
				@click="selectMode(mode.value)"
			>{{ mode.text }}</b-nav-item>
		</b-nav>

		<b-button
			size="sm"
			class="mr-1 text-dark"
			variant="link"
			style="font-size: 16px"
			:to="{ name: 'Creation.Topic' }"
		><b-icon-camera-fill /></b-button>
	</b-button-toolbar>

	<vue-masonry-wall
		class="mt-3 px-2"
		:items="topicList"
		:options="{width: 360, padding: 0}"
		@append="append"
	>
		<template v-slot:default="{item}">
			<div class="position-relative" v-if="item">
				<b-card
					body-class="p-2"
					header-class="font-weight-bold bg-white px-2 pt-3 pb-0 border-0 text-truncate"
					class="mb-3 round-sm app-shadow"
				>
					<b-row no-gutters>
						<b-col cols="2">
							<b-aspect
								class="round-sm app-background-center w-100 rounded-circle"
								aspect="1:1"
								:style="{'background-image': `url(/api/image/${item.banner}/image.png)`}"
							></b-aspect>
						</b-col>
						<b-col cols="7" class="d-flex align-items-center px-3 font-weight-bold">
							<div class="text-truncate">{{ item.title }}</div>
						</b-col>
						<b-col cols="3" class="text-center text-nowrap d-flex align-items-center">
							<b-button
								pill
								block
								class="text-white"
								style="background-image:linear-gradient(#FFAE86 0%, #FFC886 100%)"
								:to="{ name: 'Topic.Detail', params: { topicId: item.id } }"
								v-if="item.validatedAt !== null"
							>一起讨论</b-button>

							<b-button
								block
								variant="link"
								disabled
								v-if="item.validatedAt === null"
							>未审核</b-button>
						</b-col>
					</b-row>
				</b-card>

				<div
					v-if="item.validatedAt === null"
					class="position-absolute w-100 h-100"
					style="background: rgba(255,255,255,0.3);top:0;left:0"
				></div>
			</div>
		</template>
	</vue-masonry-wall>

	<div
		v-if="total <= topicList.length"
		class="text-center mt-4"
	>
		<b-form-text>已经到底啦</b-form-text>
	</div>
</div>

</template>

<script>
import VueMasonryWall from 'vue-masonry-wall';
// last hot prize
export default {
	components: { VueMasonryWall },
	data() {
		return {
			lastUpdatedAt: new Date(),
			currentMode: 'hot',
			topicList: [],
			total: 0
		};
	},
	filters: {
		sub32(string) {
			return string.length < 32 ? string : `${string.substr(0, 32)}...`;
		}
	},
	computed: {
		modeList() {
			return [
				{ value: 'hot', text: '热门话题' },
				{ value: 'prize', text: '有奖话题' },
				{ value: 'last', text: '最新' },
			];
		}
	},
	methods: {
		async append() {
			if (this.topicList.length < this.total) {
				this.getTopicList();
			}
		},
		selectMode(value) {
			this.currentMode = value;
			this.refresh();
		},
		async getTopicList() {
			const from = this.topicList.length;

			const { total, list } = await this.$app.Api.Topic.query({
				from: from,
				size: 10,
				[this.currentMode]: true,
				createdAt: this.lastUpdatedAt
			});

			this.total = total;
			list.forEach((topic) => this.topicList.push(topic));
		},
		refresh() {
			this.lastUpdatedAt = new Date();
			this.topicList = [];
			this.getTopicList();
		}
	},
	mounted() {
		this.refresh();
	}
};
</script>

<style>

</style>
