<template>

<b-card
	header-class="bg-white border-0 pb-0"
	footer-class="bg-white border-0 px-2 pt-0"
	body-class="px-2 pb-2 pt-2"
	class="round-sm border-0 mb-3"
	style="box-shadow: 0 2px 4px rgba(0,0,0,0.3)"
>
	<template #header>
		<b-button-toolbar class="align-items-center">
			<b-avatar class="mr-2 rounded-circle" :src="createdBy.headimgurl" />
			<div class="mr-auto">{{ createdBy.nickname }}</div>
			<b-form-text class="mt-0">{{ createdAt | localDatetime }}</b-form-text>
		</b-button-toolbar>
	</template>

	<template #footer>
		<b-button-toolbar>
			<b-form-input
				class="w-75 rounded-pill mr-1 bg-secondary border-0"
				size="sm"
				placeholder="说点什么吧…"
				v-if="validatedAt !== null"
				v-model="form.raw"
			/>

			<b-button
				variant="link"
				class="mr-auto text-black-50"
				style="margin-left:-40px"
				@click="createReply"
				:disabled="form.raw.length===0"
			><b-icon-reply /></b-button>

			<b-button
				variant="link"
				v-if="validatedAt !== null"
				@click="likePost"
			>{{ like }}<b-icon-heart
				class="ml-1"
			/></b-button>

			<b-button
				variant="link"
				v-if="validatedAt === null"
				disabled
			>正在审核</b-button>
		</b-button-toolbar>
	</template>

	<pre
		class="mb-0 w-100"
		style="font-size:14px;white-space:break-spaces"
		v-if="raw.length >= 64 && !expanded"
	>{{ raw | sub64 }}</pre>

	<pre
		class="mb-0 w-100"
		style="font-size:14px;white-space:break-spaces"
		v-if="raw.length < 64 || expanded"
	>{{ raw }}</pre>

	<span v-if="raw.length >= 64" style="font-size:14px">
		<b-link
			v-if="!expanded"
			@click="expanded = true"
		>展开</b-link>
		<b-link
			v-if="expanded"
			@click="expanded = false"
		>收起</b-link>
	</span>

	<b-form-row v-if="imageList.length > 0" class="mt-2">
		<b-col
			cols="4"
			class="mb-2"
			v-for="imageId in imageList"
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

	<h6 class="my-3">#{{ topicTitle }}#</h6>

	<div
		v-if="replyList.length > 0"
		class="app-topic-post-reply-list bg-secondary p-2 round-sm w-75"
		style="font-size: 12px"
	>
		<div
			v-for="reply in replyList"
			:key="reply.id"
		>
			<b-link
				class="mr-1"
				disabled
			>{{ reply.createdBy.nickname }}:</b-link>{{ reply.raw }}
		</div>
	</div>
</b-card>

</template>

<script>
export default {
	data() {
		return {
			expanded: false,
			id: null,
			raw: '',
			imageList: [],
			like: 0,
			validatedAt: null,
			createdAt: null,
			createdBy: {
				headimgurl: null,
				nickname: ''
			},
			replyList: [],
			replyTotal: [],
			form: {
				raw: ''
			}
		};
	},
	filters: {
		sub64(string) {
			return string.length < 64 ? string : `${string.substr(0, 64)}...`;
		}
	},
	props: {
		post: {},
		topicId: { type: String },
		topicTitle: { type: String }
	},
	methods: {
		async likePost() {
			const { like } = await this.$app.Api.Topic(this.topicId).Post(this.id).like();

			this.like = like;
		},
		async getReplyList() {
			const { list, total } = await this.$app.Api
				.Topic(this.topicId)
				.Post(this.id)
				.Reply
				.query({ top: 5 });

			this.replyList = list;
			this.replyTotal = total;
		},
		async createReply() {
			await this.$app.Api.Topic(this.topicId).Post(this.id).Reply.create({
				raw: this.form.raw
			});

			this.form.raw = '';
			this.getReplyList();
		}
	},
	mounted() {
		const {
			id,
			raw,
			imageList,
			like,
			validatedAt,
			createdAt,
			createdBy
		} = this.post;

		this.id = id;
		this.raw = raw;
		this.imageList = imageList;
		this.like = like;
		this.validatedAt = validatedAt;
		this.createdAt = createdAt;
		this.createdBy.nickname = createdBy.nickname;
		this.createdBy.headimgurl = createdBy.headimgurl;

		if (this.validatedAt !== null) {
			this.getReplyList();
		}
	}
};
</script>

<style>

</style>
