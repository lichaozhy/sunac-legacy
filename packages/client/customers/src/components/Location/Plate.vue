<template>

<div class="app-location-plate position-relative">
	<b-img
		class="w-100"
		v-if="!active"
		:style="padStyle"
		src="./image/pad-blur.png"
	/>

	<b-img
		class="w-100"
		v-if="active"
		:style="padStyle"
		src="./image/pad-focus.png"
	/>

	<b-aspect
		aspect="16:9"
		class="position-absolute w-100"
		style="top:0"
	>
		<div
			class="position-absolute"
			style="top:40%;width:45%"
			:style="contentStyle"
		>
			<h4
				style="font-size: 12px"
				class="text-white text-center mb-0"
			>{{ title }}</h4>
			<p
				class="text-white mb-0"
				style="font-size: 10px"
			>{{ description }}</p>

			<div
				class="position-absolute"
				style="top: -140%;width: 32%"
				:style="flagStyle"
			>
				<p
					class="w-100 position-absolute mx-auto text-center"
					style="font-size: 100%;top:5%; line-height:120%;color:#4E4B78"
					:class="{ 'text-white': active }"
				>{{ name }}</p>
				<b-img
					v-if="!active"
					class="w-100"
					src="./image/flag-blur.png"
				/>
				<b-img
					v-if="active"
					class="w-100"
					src="./image/flag-focus.png"
				/>
			</div>
		</div>

		<b-img
			class="position-absolute"
			style="width:45%;top:25%"
			:style="plateSytle"
			:src="`plate/${plate}.png`"
		/>
	</b-aspect>

	<b-aspect
		aspect="1:1"
		style="width: 8.5%"
	></b-aspect>
</div>

</template>

<script>
export default {
	props: {
		name: {},
		title: {},
		description: {},
		plate: {},
		align: {},
		active: {}
	},
	computed: {
		padStyle() {
			return {
				transform: `scaleX(${this.align === 'left' ? -1 : 1})`
			};
		},
		plateSytle() {
			const style = {};

			if (this.align === 'left') {
				style.left = '5%';
			} else {
				style.right = '5%';
			}

			return style;
		},
		contentStyle() {
			const style = {};

			if (this.align === 'left') {
				style.right = '8%';
			} else {
				style.left = '8%';
			}

			return style;
		},
		flagStyle() {
			const style = {};

			if (this.align === 'left') {
				style.right = '0';
			} else {
				style.left = '0';
			}

			return style;
		}
	}
};
</script>

<style>

</style>
