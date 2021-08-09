<template>

<div
	id="app-topic-detail"
	class="h-100 overflow-auto pb-5 px-2 pt-2"
	style="background:#fafafa"
>
	<vue-masonry-wall
		:items="post.list"
		:options="{width: 360, padding: 0}"
		@append="append"
	>
		<template v-slot:default="{item, index}">

			<b-card
				header-class="bg-white border-0 pb-0"
				footer-class="bg-white border-0 px-2 pt-0"
				body-class="px-2 pb-2 pt-2"
				class="round-sm border-0 mb-3"
				style="box-shadow: 0 2px 4px rgba(0,0,0,0.3)"
			>
				<template #header>
					<b-button-toolbar class="align-items-center">
						<b-avatar class="mr-2 rounded-circle" :src="item.createdBy.headimgurl" />
						<div class="mr-auto">{{ item.createdBy.nickname }}</div>
						<b-form-text class="mt-0">{{ item.createdAt | localDatetime }}</b-form-text>
					</b-button-toolbar>
				</template>

				<template #footer>
					<b-button-toolbar>
						<b-form-input
							class="w-75 rounded-pill mr-auto bg-secondary border-0"
							size="sm"
							placeholder="说点什么吧…"
							readonly
						/>

						<b-button
							variant="link"
							v-if="item.validatedAt !== null"
							@click="likePostByIndex(index)"
						>{{ item.like }}<b-icon-heart
							class="ml-1"
						/></b-button>

						<b-button
							variant="link"
							v-if="item.validatedAt === null"
							disabled
						>正在审核</b-button>
					</b-button-toolbar>
				</template>

				<pre
					class="mb-0 w-100"
					style="font-size:14px;white-space:break-spaces"
					v-if="item.raw.length >= 64 && !item.expanded"
				>{{ item.raw | sub64 }}</pre>

				<pre
					class="mb-0 w-100"
					style="font-size:14px;white-space:break-spaces"
					v-if="item.raw.length < 64 || item.expanded"
				>{{ item.raw }}</pre>

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

				<h6 class="my-3">#{{ topic.title }}#</h6>
			</b-card>
		</template>

	</vue-masonry-wall>

	<div
		v-if="post.total <= post.list.length"
		class="text-center my-2"
	>
		<b-form-text>已经到底啦</b-form-text>
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
