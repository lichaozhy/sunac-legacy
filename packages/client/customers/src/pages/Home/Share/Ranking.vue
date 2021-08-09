<template>

<div
	id="app-home-share-ranking"
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
				<b-col
					cols="4"
					class="position-relative h-100"
					v-for="rank in [1, 0, 2]"
					:key="rank"
				>
					<div
						class="text-center position-absolute w-100"
						:style="{ top: podiumStyleList[rank].headTop }"
					>
						<b-img
							class="position-absolute crown side"
							src="./image/crown.png"
						/>

						<b-avatar
							:size="podiumStyleList[rank].headSize"
							class="mx-auto"
							:src="top3[rank].createdBy.headimgurl"
						/>
					</div>

					<div
						class="position-absolute w-100 text-center"
						style="bottom: -20%"
					>
						<h6 class="mb-0 font-weight-bold">{{ top3[rank].createdBy.nickname }}</h6>
						<p style="font-size:12px">{{ top3[rank].like }}赞</p>
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
				<b-col cols="9" class="d-flex align-items-center">
					<b-avatar size="md" class="border mx-4" :src="share.createdBy.headimgurl" />
					<p class="mb-0" style="font-size:14px">{{ share.createdBy.nickname }}</p>
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
	watch: {
		'$store.state.isLocationShow'(value) {
			if (value === false) {
				this.refresh();
			}
		}
	},
	computed: {
		podiumStyleList() {
			return [
				{ headTop: '34%', headSize: '50px' },
				{ headTop: '42%', headSize: '44px' },
				{ headTop: '55%', headSize: '40px' }
			];
		},
		top3() {
			return new Array(3).fill(null).map((_, index) => {
				const share = this.shareList[index];

				return share ? share : {
					headimgurl: '',
					like: '--',
					createdBy: { nickname: 'N/A' }
				};
			});
		}
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
