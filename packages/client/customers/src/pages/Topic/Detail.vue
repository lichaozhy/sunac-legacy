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
		<template v-slot:default="{item}">
			<app-post
				:post="item"
				:topic-title="topic.title"
				:topic-id="$route.params.topicId"
			/>
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
		<div style="font-size:18px;margin-top:2px"><b-icon-chat-dots /></div>
		<div style="font-size:14px;margin-top: 0px">发布</div>
	</b-button>
</div>

</template>

<script>
import VueMasonryWall from 'vue-masonry-wall';
import AppPost from './Post.vue';

export default {
	components: { VueMasonryWall, AppPost },
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
	computed: {
		ThisPostApi() {
			return this.$app.Api.Topic(this.$route.params.topicId);
		}
	},
	methods: {
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
