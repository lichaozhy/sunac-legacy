<template>

<div
	id="app-figure"
	class="overflow-auto h-100 pb-5"
>
	<b-img src="./image/banner.png" class="w-100" />

	<div
		class="px-2"
	>
		<b-card
			class="mt-3 app-shadow round-sm"
		>
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
				.slice(0, Math.floor(this.figureList.length / 2))
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
				.slice(Math.floor(this.figureList.length / 2))
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
