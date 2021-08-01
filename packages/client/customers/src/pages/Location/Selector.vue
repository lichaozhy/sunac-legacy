<template>

<div
	id="app-location"
	class="overflow-auto h-100 position-relative"
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
			style="bottom: 2em;font-size:1rem"
			:to="{ name: 'Home' }"
		>暂不选择，跳过>></b-button>
	</div>

	<b-aspect
		aspect="1:1"
		class="position-absolute"
		style="width:100%;top:0;left:0"
	>
		<b-img
			class="position-absolute"
			style="top:5%;left:1em;width:22%"
			src="./image/logo.png"
		/>

		<div
			id="app-location-title"
			class="position-absolute p-3 text-white font-weight-bold"
			style="
				width:12em;top:20%;left:0;
				border-radius: 0 50px 50px 0;
				background-image:linear-gradient(to right, #4E4B78, #74B1BE);"
		>
			<h5>&nbsp;</h5>
			<h5 class="mb-0">&nbsp;</h5>
		</div>

		<b-img
			class="position-absolute"
			style="top: 10%; right:0; width: 65%"
			src="./image/heading.png"
		/>

		<div
			class="position-absolute p-3 text-white font-weight-bold"
			id="app-location-title-text"
			style="top:20%;left:0;text-shadow: 2px 2px 4px #000;"
		>
			<h5>了解城市历史变迁</h5>
			<h5 class="mb-0">弘扬传统文化</h5>
		</div>

		<div
			class="position-absolute p-3 text-white"
			id="app-location-welcome"
			style="top:47%;left:0;font-size:14px"
		>
			<p class="mb-1">Welcome</p>
			<p class="mb-0">城市记忆博物馆</p>
		</div>

		<b-img
			class="position-absolute ml-3"
			style="top: 78%; left:0; width: 30%"
			src="./image/notice.png"
		/>

		<div
			id="app-location-selection"
			class="position-absolute w-100"
			style="top: 97%"
		>

			<b-aspect
				aspect="1:1"
				class="position-absolute"
				style="width:100%;top:0;left:0"
			>
				<b-img
					class="position-absolute"
					style="left:5%;width: 90%"
					src="./image/plate-background.png"
				/>

				<b-img
					class="position-absolute"
					style="right:17%;width: 12%;top:18%"
					src="./image/car.png"
				/>

				<b-row
					no-gutters
					class="h-100"
				>
					<b-col
						cols="6"
						class="position-relative"
					>
						<div class="position-absolute" style="top:3.5%;width: 96%">
							<app-location-plate
								v-for="city in leftList"
								:key="city.plate"
								:name="city.name"
								:title="city.title"
								:description="city.description"
								:plate="city.plate"
								:active="customer.cityAs === city.adcode"
								align="left"
								@click.native="setCustomerCity(city.adcode)"
							/>
						</div>
					</b-col>
					<b-col
						cols="6"
						class="position-relative"
					>
						<div class="position-absolute" style="top:-16%;width: 96%;right: 0">
							<app-location-plate
								v-for="city in rightList"
								:key="city.plate"
								:name="city.name"
								:title="city.title"
								:description="city.description"
								:plate="city.plate"
								:active="customer.cityAs === city.adcode"
								align="right"
								@click.native="setCustomerCity(city.adcode)"
							/>
						</div>
					</b-col>
				</b-row>
			</b-aspect>

		</div>
	</b-aspect>
</div>

</template>

<script>
import AppLocationPlate from './Plate.vue';

export default {
	data() {
		return {
			customer: {
				cityAs: null
			}
		};
	},
	components: {
		AppLocationPlate
	},
	computed: {
		leftList() {
			return [
				{
					name: '苏州',
					title: '桃花坞',
					description: '源于宋代“姑苏版”年画',
					plate: 'taohuawu',
					adcode: '320500'
				},
				{
					name: '南京',
					title: '纸鸢',
					description: '距今2000多年“追风的梦',
					plate: 'zhiyuan',
					adcode: '320100'
				},
				{
					name: '无锡',
					title: '惠山泥人',
					description: '独特黑泥“不老娃娃”',
					plate: 'huishanniren',
					adcode: '320200'
				},
				{
					name: '新疆',
					title: '桑皮纸',
					description: '千年工艺“纸业活化石”',
					plate: 'sangpizhi',
					adcode: '650000'
				},
				{
					name: '南通',
					title: '棕编',
					description: '始于三国时期“千年奇葩”',
					plate: 'zongbian',
					adcode: '320600'
				},
				{
					name: '芜湖',
					title: '石器雕刻',
					description: '跨越时代“考古学重大发现”',
					plate: 'shiqidiaoke',
					adcode: '340200'
				},
			];
		},
		rightList() {
			return [
				{
					name: '上海',
					title: '皮影戏',
					description: '始于西汉“百戏之首”',
					plate: 'piyingxi',
					adcode: '310000'
				},
				{
					name: '苏州',
					title: '昆曲',
					description: '14世纪“中国最古老的戏曲”',
					plate: 'kunqu',
					adcode: '320500'
				},
				{
					name: '南京',
					title: '脸谱',
					description: '距今4000多年“戏说国粹”',
					plate: 'lianpu',
					adcode: '320100'
				},
				{
					name: '扬州',
					title: '江都漆画',
					description: '源于两汉“自成体系”',
					plate: 'jiangduqihua',
					adcode: '321000'
				},
				{
					name: '徐州',
					title: '剪纸',
					description: '公元六世纪“独特艺术语言”',
					plate: 'jianzhi',
					adcode: '320300'
				},
				{
					name: '镇江',
					title: '太平泥',
					description: '公元420年“仅当地黄土捏制”',
					plate: 'taipingni',
					adcode: '321100'
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
			await this.$router.replace({ name: 'Home' });
		}
	},
	mounted() {
		this.getCustomer();
	}
};
</script>

<style>

</style>
