<template>

<div
	v-if="$store.state.sharing"
	class="position-fixed w-100 h-100 d-flex flex-column adjustify-content-center px-5 pb-5"
	style="z-index:9999;background:rgba(0,0,0,0.7);top:0;left:0"
>
	<b-img src="./arrow.png" />
	<p class="text-white text-center">请点击右上角分享</p>
	<b-button
		size="lg"
		variant="outline-secondary"
		pill
		@click="$store.commit('closeSharing')"
	>知道了</b-button>
</div>

</template>
