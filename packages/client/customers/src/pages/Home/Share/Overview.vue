<template>

<div
	class="p-2 w-100 pb-5"
	id="app-home-share-overview"
>
	<vue-masonry-wall
		:items="allShareList"
		:options="{width: 200, padding: 5}"
		@append="append"
	>
		<template v-slot:default="{item, index}">
			<b-card
				no-body
				footer-class="px-2 py-1"
				footer-bg-variant="white"
				v-if="item"
				style="border-radius:6px;overflow:hidden;box-shadow:1px 1px 6px 0 rgba(0,0,0,0.2)"
			>
				<b-img
					v-if="item.top && index < 3"
					src="./image/hot.png"
					class="position-absolute"
					style="height: 36px;top:0;right:0"
				/>

				<b-img
					v-if="item.top && index < 3"
					:src="`/static/no/${index + 1}.png`"
					class="position-absolute"
					style="height: 20px;top:0;left:0"
				/>

				<b-img
					:src="`/api/image/${item.imageList[0]}/image.png`"
					class="w-100"
					@click="goShare(item)"
				/>

				<template #footer>
					<div
						style="font-size:14px"
						class="mb-1 font-weight-bold"
					>{{ item.title | substring }}</div>

					<div class="d-flex">
						<b-avatar size="sm" :src="item.createdBy.headimgurl" />
						<b-form-text class="ml-1 mr-auto">{{ item.createdBy.nickname }}</b-form-text>
						<b-link
							:disabled="likedMap[item.id]"
							v-if="item.validatedAt !== null"
							@click="likeShare(item)"
						><span class="mr-1">{{ item.like }}</span><b-icon-heart
							v-if="!likedMap[item.id]"
						/><b-icon-heart-fill
							v-if="likedMap[item.id]"
						/></b-link>
						<b-form-text v-if="item.validatedAt === null">未审核</b-form-text>
					</div>
				</template>
			</b-card>
		</template>
	</vue-masonry-wall>

	<div
		v-if="total === shareList.length"
		class="text-center mt-5"
	>
		<b-form-text>已经到底啦</b-form-text>
	</div>

	<b-button
		variant="default"
		size="lg"
		class="position-fixed p-0 text-white border-0"
		:to="{ name: 'Creation.Share' }"
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
		<div style="font-size:24px;margin-top:0"><b-icon-plus /></div>
		<div style="font-size:14px;margin-top: -6px">发布</div>
	</b-button>
</div>

</template>

<script>
import VueMasonryWall from 'vue-masonry-wall';

export default {
	components: { VueMasonryWall },
	data() {
		return {
			likedMap: {},
			lastUpdatedAt: new Date(),
			sharetop3: [],
			shareList: [],
			total: 0
		};
	},
	filters: {
		substring(string) {
			return string.length < 10 ? string : (string.substr(0, 10) + '...');
		}
	},
	computed: {
		allShareList() {
			return this.sharetop3
				.map(share => Object.assign(share, { top: true }))
				.concat(this.shareList);
		}
	},
	methods: {
		append() {
			if (this.shareList.length < this.total) {
				this.getShareList();
			}
		},
		async getLiked() {
			const list = await this.$app.Api.Customer.TodayLiked.query();

			list.forEach(like => this.$set(this.likedMap, like.share, true));
		},
		async getShareTop3List() {
			this.sharetop3 = await this.$app.Api.Share.top({ number: 3 });
		},
		async getShareList() {
			const from = this.shareList.length;

			const { total, list } = await this.$app.Api.Share.query({
				from: from,
				size: 10,
				createdAt: this.lastUpdatedAt
			});

			this.total = total;
			list.forEach((share) => this.shareList.push(share));
		},
		async likeShare(share) {
			console.log(share);
			await this.$app.Api.Share(share.id).like();
			share.like++;
			this.$set(this.likedMap, share.id, true);
		},
		goShare(shareId) {
			this.$router.push({ name: 'Share.Detail', params: { shareId } });
		},
		async refresh() {
			this.lastUpdatedAt = new Date();
			this.shareList = [];
			await this.getShareTop3List();
			await this.getShareList();
		}
	},
	mounted() {
		this.refresh();
		this.getLiked();
	}
};
</script>

<style>
</style>
