<template>

<div
	class="p-2 w-100 pb-5"
>
	<vue-masonry-wall
		:items="shareList"
		:options="{width: 200, padding: 5}"
		@append="append"
	>
		<template v-slot:default="{item}">
			<b-card
				no-body
				footer-class="px-2 py-1"
				footer-bg-variant="white"
				:img-src="`/api/image/${item.imageList[0]}/image.png`"
				v-if="item"
			>
				<template #footer>
					<div>{{ item.raw | substring }}</div>
					<b-form-text>{{ item.createdAt | localDatetime }}</b-form-text>
					<div class="d-flex">
						<b-avatar size="sm" :src="item.createdBy.headimgurl" />
						<b-form-text class="ml-1 mr-auto">{{ item.createdBy.nickname }}</b-form-text>
						<b-link v-if="item.validatedAt !== null"><b-icon-heart /></b-link>
						<b-form-text v-if="item.validatedAt === null">未审核</b-form-text>
					</div>
				</template>
			</b-card>
		</template>
	</vue-masonry-wall>

	<div
		v-if="total === this.shareList.length"
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
			lastUpdatedAt: new Date(),
			shareList: [],
			total: 0
		};
	},
	filters: {
		substring(string) {
			return string.length < 10 ? string : (string.substr(0, 10) + '...');
		}
	},
	methods: {
		append() {
			if (this.shareList.length < this.total) {
				this.getShareList();
			}
		},
		async getShareList() {
			const { total, list } = await this.$app.Api.Share.query({
				from: this.shareList.length,
				size: 10,
				createdAt: this.lastUpdatedAt
			});

			this.total = total;
			list.forEach(share => this.shareList.push(share));
		},
		refresh() {
			this.lastUpdatedAt = new Date();
			this.shareList = [];
			this.getShareList();
		}
	},
	mounted() {
		this.refresh();
	}
};
</script>

<style>

</style>
