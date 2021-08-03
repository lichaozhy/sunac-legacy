<template>

<div class="h-100 overflow-auto pb-5">
	<b-aspect
		v-if="topic.banner"
		aspect="21:10"
		class="app-background-center w-100 position-relative"
		:style="{'background-image':`url(/api/image/${topic.banner}/image.png)`}"
	>
		<div
			style="background:rgba(0,0,0,0.5);height:80px;left:60px;right:60px;top:25px"
			class="text-white position-absolute p-3 d-flex flex-column justify-content-between round-sm"
		>
			<h6 class="text-truncate">{{ topic.title }}</h6>
			<b-button-toolbar style="font-size:12px">
				<div class="mr-auto">{{ topic.read }}<span class="ml-1">阅读</span></div>
				<div>{{ post.total }}<span class="ml-1">回复</span></div>
			</b-button-toolbar>
		</div>
	</b-aspect>

	<div class="px-2" style="margin-top: -3em">
		<b-card
			body-class="p-2 mb-3"
			header-class="font-weight-bold bg-white p-2 border-0 text-truncate"
			class="mb-3 round-sm app-shadow"
		>
			<template #header>
				<b-button-toolbar>
					<b-avatar :src="createdBy.headimgurl" />
					<b-button
						class="font-weight-bold text-dark"
						variant="link"
					>主持人：{{ createdBy.nickname }}</b-button>
				</b-button-toolbar>
			</template>
			<p style="height:4.25em;" class="mb-0">导语：{{topic.description | sub64}}</p>
		</b-card>

		<b-card
			header-class="bg-white p-2 text-truncate"
			no-body
			class="round-sm app-shadow"
		>
			<template #header>
				<b-button-toolbar id="app-topic-detail-heading">
					<b-nav class="font-weight-bold app-nav mr-auto">
						<b-nav-item active>动态</b-nav-item>
					</b-nav>

					<b-button
						class="mr-1"
						variant="link"
						:class="{'active':post.mode === 'hot'}"
						@click="setMode('hot')"
					><b-icon-star class="mr-1" />最热</b-button>
					<b-button
						variant="link"
						:class="{'active':post.mode === 'last'}"
						@click="setMode('last')"
					><b-icon-sort-down class="mr-1" />最新</b-button>
				</b-button-toolbar>
			</template>


			<vue-masonry-wall
				:items="post.list"
				:options="{width: 360, padding: 0}"
				@append="append"
			>
				<template v-slot:default="{item, index}">
					<div class="p-2 border-bottom">
						<b-button-toolbar>
							<div class="mr-auto d-flex">
								<b-avatar class="mr-2" :src="item.createdBy.headimgurl" rounded />
								<div class="d-flex flex-column adjust-content-center">
									<div>{{ item.createdBy.nickname }}</div>
									<b-form-text class="mt-0">{{ item.createdAt | localDatetime }}</b-form-text>
								</div>
							</div>
							<b-button
								variant="link"
								v-if="item.validatedAt !== null"
								@click="likePostByIndex(index)"
							><b-icon-heart
								class="mr-1"
							/>{{ item.like }}</b-button>

							<b-button
								variant="link"
								v-if="item.validatedAt === null"
								disabled
							>正在审核</b-button>
						</b-button-toolbar>

						<p
							class="mb-0"
							style="font-size:14px"
							v-if="item.raw.length >= 64 && !item.expanded"
						>{{ item.raw | sub64 }}</p>

						<p
							class="mb-0"
							style="font-size:14px"
							v-if="item.raw.length < 64 || item.expanded"
						>{{ item.raw }}</p>

						<span v-if="item.raw.length >= 64" style="font-size:14px">
							<b-link v-if="!item.expanded" @click="expand(index)">展开</b-link>
							<b-link v-if="item.expanded" @click="collapse(index)">收起</b-link>
						</span>

						<b-form-row v-if="item.imageList.length > 0" class="mt-2">
							<b-col
								cols="4"
								class="mb-2"
								v-for="imageId in item.imageList"
								:key="imageId"
							>
								<b-aspect
									class="w-100 border"
									aspect="1:1"
									style="background-size:cover;background-position:center"
									:style="{'background-image': `url(/api/image/${imageId}/image.png)`}"
								></b-aspect>
							</b-col>
						</b-form-row>
					</div>

				</template>

			</vue-masonry-wall>

			<div
				v-if="post.total <= post.list.length"
				class="text-center my-3"
			>
				<b-form-text>已经到底啦</b-form-text>
			</div>
		</b-card>
	</div>

	<b-button
		variant="default"
		size="lg"
		class="position-fixed p-0 text-white border-0"
		:to="{ name: 'Creation.Post' }"
		style="
			right:10px;
			bottom:50px;
			width:60px;
			height:60px;
			background:#ccc;
			border-radius:100%;
			background-image: linear-gradient(45deg, #4E4B78, #74B1BE);
		"
	>
		<div style="font-size:24px;margin-top:0"><b-icon-reply /></div>
		<div style="font-size:14px;margin-top: -6px">回复</div>
	</b-button>
</div>

</template>

<script>
import VueMasonryWall from 'vue-masonry-wall';

export default {
	components: { VueMasonryWall },
	data() {
		return {
			createdBy: {
				nickname: '',
				headimgurl: '',
			},
			topic: {
				title: '',
				banner: '',
				description: '',
				read: '',
			},
			post: {
				lastUpdatedAt: new Date(),
				list: [],
				total: 0,
				mode: 'last'
			}
		};
	},
	filters: {
		sub64(string) {
			return string.length < 64 ? string : `${string.substr(0, 64)}...`;
		}
	},
	computed: {
		ThisPostApi() {
			return this.$app.Api.Topic(this.$route.params.topicId);
		}
	},
	methods: {
		expand(index) {
			this.post.list[index].expanded = true;
		},
		collapse(index) {
			this.post.list[index].expanded = false;
		},
		async getTopic() {
			const topic = await this.ThisPostApi.get();

			this.createdBy.nickname = topic.createdBy.nickname;
			this.createdBy.headimgurl = topic.createdBy.headimgurl;
			this.topic.title = topic.title;
			this.topic.banner = topic.banner;
			this.topic.description = topic.description;
			this.topic.read = topic.read;
		},
		async getPostList() {
			const { total, list } = await this.ThisPostApi.Post.query({
				from: this.post.list.length,
				size: 10,
				createdAt: this.lastUpdatedAt,
				[this.post.mode]: true
			});

			list.forEach(post => {
				post.expanded = false;
				this.post.list.push(post);
			});
			this.post.total = total;

			console.log(this.post.total, this.post.list.length);
		},
		async likePostByIndex(index) {
			const post = this.post.list[index];
			const { like } = await this.ThisPostApi.Post(post.id).like();

			post.like = like;
		},
		setMode(value) {
			this.post.mode = value;
			this.refresh();
		},
		append() {
			if (this.post.list.length < this.post.total) {
				this.getPostList();
			}
		},
		refresh() {
			this.post.lastUpdatedAt = new Date();
			this.post.list = [];
			this.getPostList();
		}
	},
	mounted() {
		this.getTopic();
		this.refresh();
	}
};
</script>

<style>
#app-topic-detail-heading button {
	color: #ccc;
}

#app-topic-detail-heading button.active {
	font-weight: bold;
	color: #4E4B78;
}
</style>
