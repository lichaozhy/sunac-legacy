<template>

<div
	class="px-0 w-100 pb-5"
>
	<b-aspect
		aspect="16:9"
		class="position-relative"
	>
		<b-img
			class="w-100"
			src="./image/board.png"
		/>

		<div
			class="position-absolute"
			style="width:67%;height:80%;top:0;left:16.5%;"
		>
			<b-row
				id="app-home-share-ranking-platform"
				no-gutters
				class="h-100"
				style="color:#4E4B78"
			>
				<b-col cols="4" class="position-relative h-100">
					<div
						class="text-center position-absolute w-100"
						style="top: 42%"
					>
						<b-img
							class="position-absolute crown side"
							src="./image/crown.png"
						/>

						<b-avatar
							size="44px"
							class="mx-auto"
							:src="shareList[1] && shareList[1].createdBy.headimgurl"
						/>
					</div>

					<div
						class="position-absolute w-100 text-center"
						style="bottom: -20%"
					>
						<h6 class="mb-0 font-weight-bold">{{ shareList[1] && shareList[1].createdBy.nickname }}</h6>
						<p style="font-size:12px">1000赞</p>
					</div>
				</b-col>
				<b-col cols="4" class="position-relative h-100">
					<div
						class="text-center position-absolute w-100"
						style="top: 34%"
					>
						<b-img
							class="position-absolute crown"
							src="./image/crown.png"
						/>

						<b-avatar
							size="50px"
							class="mx-auto"
							:src="shareList[0] && shareList[0].createdBy.headimgurl"
						/>
					</div>

					<div
						class="position-absolute w-100 text-center"
						style="bottom: -20%"
					>
						<h6 class="mb-0 font-weight-bold">{{ shareList[0] && shareList[0].createdBy.nickname }}</h6>
						<p style="font-size:12px">1000赞</p>
					</div>
				</b-col>
				<b-col cols="4" class="position-relative h-100">
					<div
						class="text-center position-absolute w-100"
						style="top: 55%"
					>
						<b-img
							class="position-absolute crown side"
							src="./image/crown.png"
						/>

						<b-avatar
							size="40px"
							class="mx-auto"
							:src="shareList[2] && shareList[2].createdBy.headimgurl"
						/>
					</div>

					<div
						class="position-absolute w-100 text-center"
						style="bottom: -20%"
					>
						<h6 class="mb-0 font-weight-bold">{{ shareList[2] && shareList[2].createdBy.nickname }}</h6>
						<p style="font-size:12px">1000赞</p>
					</div>
				</b-col>
			</b-row>
		</div>
	</b-aspect>

	<div id="app-home-share-ranking-list" class="p-2">
		<div
			v-for="(share, index) in shareList"
			:key="share.id"
			class="p-2 mb-3 position-relative"
			style="box-shadow: 0 0 6px 0 rgba(0,0,0,0.1)"
			@click="goShare(share.id)"
		>
			<b-row no-gutters>
				<b-col cols="4">
					<b-aspect
						aspect="16:10"
						class="w-100"
						style="
							background-position:center;
							background-size:cover;
							border-radius:4px;
							overflow:hidden;
							box-shadow: 2px 2px 6px 0 rgba(0,0,0,0.1);
						"
						:style="{
							'background-image': `url(/api/image/${share.imageList[0]}/image.png)`
						}"
					></b-aspect>
				</b-col>
				<b-col cols="5" class="d-flex align-items-center">
					<b-avatar size="md" class="border mx-2" :src="share.createdBy.headimgurl" />
					<p class="mb-0" style="font-size:12px">{{ share.createdBy.nickname }}</p>
				</b-col>
				<b-col cols="3" class="text-center align-middle">
					<b-img style="width:30px" class="mt-3" src="./image/liked.png" />
					<p class="mb-0" style="font-size:14px;color:#FFAE86">{{ share.like }}</p>
				</b-col>
			</b-row>

			<div class="position-absolute" style="top:0;left:0">
				<b-img style="width:24px" src="./image/flag.png" />
				<div
					class="position-absolute w-100 h-100 text-white font-weight-bolder text-center"
					style="top:2px"
				>{{ index + 1 }}</div>
			</div>
		</div>
	</div>
</div>

</template>

<script>
export default {
	data() {
		return {
			shareList: [],
		};
	},
	methods: {
		async getShareTop20List() {
			this.shareList = await this.$app.Api.Share.top({ number: 20 });
		},
		goShare(shareId) {
			this.$router.push({ name: 'Share.Detail', params: { shareId } });
		},
	},
	mounted() {
		this.getShareTop20List();
	}
};
</script>

<style lang="scss">
#app-home-share-ranking-platform {
	.b-avatar {
		border: 2px solid orange;
		box-shadow: 0px 3px 6px 0 rgba(0,0,0,0.5);
	}

	.crown {
		top: -12px;
		left: 50%;
		margin-left: -12px;
		width: 24px;
		z-index: 1;

		&.side {
			transform: rotate(-45deg);
			top: -4px;
			left: 12px;
			margin-left: 0;
		}
	}
}
</style>
