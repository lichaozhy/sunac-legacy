<template>

<div
	id="app-figure"
	class="h-100 pb-5"
>
	<b-link
		href="https://mp.weixin.qq.com/s/subQEWe_5NUuxAz_QaeF8A"
	><b-img src="./image/banner.png" class="w-100" /></b-link>

	<div
		class="px-2"
	>
		<b-card
			class="mt-3 app-shadow round-sm"
		>
			<b-row class="text-center text-nowrap">
				<b-col cols="6">
					<b-link href="https://mp.weixin.qq.com/s/60J283xJXunOL8SrHTb0Ew">
						<b-img src="./image/radio.svg" style="height: 60px"  />
						<h5 class="mt-3 font-weight-bold text-dark">非遗电台</h5>
					</b-link>
				</b-col>
				<b-col cols="6">
					<b-link href="https://mp.weixin.qq.com/s/cA9CUQZx-gETOh0C3fULdQ">
						<b-img src="./image/figure.png" style="height: 60px"  />
						<h5 class="mt-3 font-weight-bold text-dark">我是非遗传承人</h5>
					</b-link>
				</b-col>
			</b-row>
		</b-card>

		<div id="app-figure-list" class="mt-3 pb-5" style="background-color:#FAFAFA">
			<b-form-row>
				<b-col
					cols="6"
					v-for="(list, side) in [leftList, rightList]"
					:key="side"
				>
					<component
						v-for="(item, index) in list"
						:key="index"
						:is="ItemComponent[item.type]"
						:options="item.options"
					/>
				</b-col>
			</b-form-row>
		</div>
	</div>

	<div style="height: 60px;background-image:linear-gradient(#FAFAFA, rgba(0,0,0,0))"></div>
</div>

</template>

<script>
import StaticItem from './StaticItem.vue';
import FigureItem from './FigureItem.vue';

const staticItem = {
	a: {
		type: 'static',
		options: {
			imageUrl: '/static/figure/a.png'
		}
	},
	b: {
		type: 'static',
		options: {
			imageUrl: '/static/figure/b.png'
		}
	}
};

export default {
	data() {
		return {
			figureList: []
		};
	},
	computed: {
		ItemComponent() {
			return {
				static: StaticItem,
				figure: FigureItem,
			};
		},
		leftList() {
			const list = this.figureList
				.slice(0, Math.ceil(this.figureList.length / 2))
				.map(figure => {
					return { type: 'figure', options: figure };
				});

			if (this.figureList.length % 2 === 0) {
				list.push(staticItem.b);
			}

			return list;
		},
		rightList() {
			const list = this.figureList
				.slice(Math.ceil(this.figureList.length / 2))
				.map(figure => {
					return { type: 'figure', options: figure };
				});

			list.unshift(staticItem.a);

			if (this.figureList.length % 2 === 1) {
				list.push(staticItem.b);
			}

			return list;
		}
	},
	methods: {
		async getFigureList() {
			this.figureList = await this.$app.Api.Figure.query();
		}
	},
	mounted() {
		this.getFigureList();
	}
};
</script>

<style>

</style>
