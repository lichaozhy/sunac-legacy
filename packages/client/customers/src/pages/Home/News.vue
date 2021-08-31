<template>

<div
	class="p-2 w-100 pb-5"
	id="app-home-news-overview"
>
	<vue-masonry-wall
		:items="newsList"
		:options="{width: 400, padding: 5}"
		@append="append"
		v-if="newsList.length > 0"
	>
		<template #default="{ item }">
			<b-link
				:href="item.href"
			>
				<b-card
					no-body
					footer-class="px-2 py-1"
					footer-bg-variant="white"
					v-if="item"
					v-show="!item.hide"
					style="border-radius:6px;overflow:hidden;box-shadow:1px 1px 6px 0 rgba(0,0,0,0.2)"
				>
					<b-row no-gutters>
						<b-col
							cols="9"
							class="p-2 d-flex align-items-center"
						><h5
							class="m-0 text-dark font-weight-bold"
						>{{ item.title }}</h5></b-col>

						<b-col cols="3" class="p-2">
							<b-aspect
								aspect="4:3"
								class="app-background-center round-sm"
								:style="{
									'background-image': `url(/api/image/${item.thumb}/image.png)`
								}"
							></b-aspect>
						</b-col>
					</b-row>
				</b-card>
			</b-link>
		</template>
	</vue-masonry-wall>

	<div
		v-if="total === newsList.length"
		class="text-center mt-5"
	>
		<b-form-text>已经到底啦</b-form-text>
	</div>
</div>

</template>

<script>
import VueMasonryWall from 'vue-masonry-wall';

export default {
	components: { VueMasonryWall },
	data() {
		return {
			lastUpdatedAt: new Date(),
			newsList: [],
			total: 0
		};
	},
	methods: {
		append() {
			if (this.newsList.length < this.total) {
				this.getNewsList();
			}
		},
		async getNewsList() {
			const from = this.newsList.length;

			const { total, list } = await this.$app.Api.News.query({
				from, size: 10, createdAt: this.lastUpdatedAt
			});

			this.total = total;
			list.forEach(news => this.newsList.push(news));
		}
	},
	mounted() {
		this.getNewsList();
	}
};
</script>

<style>

</style>
