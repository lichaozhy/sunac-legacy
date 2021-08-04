<template>

<div class="p-2 h-100 overflow-auto">
	<b-button-toolbar>
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
		class="mt-3"
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
					style=""
					:header="item.title"
					@click="goDetail(item.id)"
				>
					<b-row no-gutters>
						<b-col class="pr-2 d-flex flex-column justify-content-between" cols="7">
							<p style="font-size:14px" class="mb-0">{{ item.description | sub32 }}</p>
							<b-button-toolbar style="font-size: 12px">
								<div
									class="mr-auto"
									v-if="item.validatedAt !== null"
								><b-icon-eye class="mr-1" />{{ item.read }}</div>

								<div
									class="mr-auto"
									v-if="item.validatedAt === null"
								>正在审核</div>

								<div><b-icon-person class="mr-1" />{{ item.createdBy.nickname }}</div>
							</b-button-toolbar>
						</b-col>
						<b-col cols="5">
							<b-aspect
								class="round-sm app-background-center"
								aspect="16:10"
								:style="{'background-image': `url(/api/image/${item.banner}/image.png)`}"
							></b-aspect>
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
		class="text-center mt-5"
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
				{ value: 'prize', text: '有奖话题' },
				{ value: 'hot', text: '热门' },
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
		goDetail(topicId) {
			this.$router.push({
				name: 'Topic.Detail',
				params: { topicId }
			});
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
