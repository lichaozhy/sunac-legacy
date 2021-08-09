<template>

<div
	id="app-location"
	class="overflow-auto h-100 w-100 position-fixed"
	style="top:0;left:0;z-index:9999"
	v-if="$store.state.isLocationShow"
>
	<div class="position-relative">
		<b-img
			class="w-100"
			src="./image/background.png"
		/>

		<b-button
			variant="link"
			block
			class="position-absolute text-white"
			style="bottom: 1.75em;font-size:1rem"
			@click="$store.commit('closeLocation')"
		>&nbsp;</b-button>
	</div>

	<b-aspect
		aspect="1:1"
		class="position-absolute"
		style="width:100%;top:0;left:0"
	>
		<div
			class="position-absolute"
			v-for="location in list"
			:key="location.adcode"
			style="margin-top:-21px;margin-left:-25px"
			:style="location.style"
			@click="setCustomerCity(location.adcode)"
		>
			<b-img
				style="width: 50px"
				:src="`/static/location/flag-${customer.cityAs === location.adcode ? 'focus' : 'blur'}.png`"
			/>

			<b-img
				class="position-absolute"
				src="/static/location/car.png"
				style="width:48px;bottom:0"
				:class="`app-car-${location.direction}`"
				v-if="customer.cityAs === location.adcode"
				:style="location.car"
			/>

			<p
				class="position-absolute w-100 text-center"
				:style="{
					color: customer.cityAs === location.adcode ? '#fff' : '#4E4B78'
				}"
				style="top:0;left:0"
			>{{ location.name }}</p>
		</div>
	</b-aspect>
</div>

</template>

<script>

export default {
	data() {
		return {
			customer: {
				cityAs: null
			}
		};
	},
	watch: {
		'$store.state.isLocationShow'(value) {
			if (value === true) {
				this.getCustomer();
			}
		}
	},
	computed: {
		list() {
			return [
				{
					name: '苏州',
					title: '桃花坞',
					adcode: '320500',
					direction: 'right',
					style: { left: '77%', top: '74%' },
					car: { left: '56px', top: '27px' }
				},
				{
					name: '南京',
					title: '纸鸢',
					adcode: '320100',
					direction: 'right',
					style: { left: '72%', top: '170%' },
					car: { left: '71px', top: '19px' }
				},
				{
					name: '无锡',
					title: '惠山泥人',
					adcode: '320200',
					direction: 'right',
					style: { left: '35%', top: '114%' },
					car: { left: '75px', top: '3px' }
				},
				{
					name: '新疆',
					title: '桑皮纸',
					adcode: '650000',
					direction: 'left',
					style: { left: '23%', top: '161%' },
					car: { left: '-51px', top: '30px' }
				},
				{
					name: '南通',
					title: '棕编',
					adcode: '320600',
					direction: 'right',
					style: { left: '50%', top: '145%' },
					car: { left: '60px', top: '31px' }
				},
				{
					name: '芜湖',
					title: '石器雕刻',
					adcode: '340200',
					direction: 'right',
					style: { left: '27%', top: '188%' },
					car: { left: '68px', top: '-24px' }
				},
				{
					name: '上海',
					title: '皮影戏',
					adcode: '310000',
					direction: 'right',
					style: { left: '21%', top: '86%' },
					car: { left: '54px', top: '28px' }
				},
				{
					name: '扬州',
					title: '江都漆画',
					adcode: '321000',
					direction: 'left',
					style: { left: '19%', top: '131%' },
					car: { left: '-39px', top: '31px' }
				},
				{
					name: '徐州',
					title: '剪纸',
					adcode: '320300',
					direction: 'right',
					style: { left: '72%', top: '131%' },
					car: { left: '56px', top: '23px' }
				},
				{
					name: '镇江',
					title: '太平泥',
					adcode: '321100',
					direction: 'right',
					style: { left: '77%', top: '108%' },
					car: { left: '56px', top: '27px' }
				},
			];
		}
	},
	methods: {
		async getCustomer() {
			const customer = await this.$app.Api.Customer.get();

			this.customer.cityAs = customer.cityAs;
		},
		async setCustomerCity(adcode) {
			await this.$app.Api.Customer.update({ cityAs: adcode });
			this.$store.commit('closeLocation');
		}
	},
	mounted() {
		this.getCustomer();
	}
};
</script>

<style>
.app-car-right {
	transform: scaleX(-1);
}
</style>
