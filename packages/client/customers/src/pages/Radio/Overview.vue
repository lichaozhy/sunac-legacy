<template>

<div
	id="app-radio"
	class="h-100 pb-5"
>
	<b-link><b-img src="./image/banner.png" class="w-100" /></b-link>

	<div class="px-2 pt-3">
		<vue-masonry-wall
			:items="programmeList"
			:options="{width: 400, padding: 5}"
			@append="append"
			v-if="programmeList.length > 0"
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
								cols="10"
								class="p-2 d-flex align-items-center"
							><h6
								class="m-0 text-dark font-weight-bold"
							>{{ item.title }}</h6></b-col>

							<b-col cols="2" class="p-2">
								<b-aspect
									aspect="1:1"
									class="app-background-center"
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

		<!-- <div
			v-if="total === programmeList.length"
			class="text-center mt-5"
		>
			<b-form-text>已经到底啦</b-form-text>
		</div> -->
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
			programmeList: [],
			total: 0
		};
	},
	methods: {
		append() {
			if (this.programmeList.length < this.total) {
				this.getProgrammeList();
			}
		},
		async getProgrammeList() {
			const from = this.programmeList.length;

			const { total, list } = await this.$app.Api.Programme.query({
				from, size: 10, createdAt: this.lastUpdatedAt
			});

			this.total = total;
			list.forEach(programme => this.programmeList.push(programme));
		}
	},
	mounted() {
		this.getProgrammeList();
	}
};
</script>

<style>

</style>
