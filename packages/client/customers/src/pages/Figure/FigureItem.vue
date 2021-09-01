<template>

<b-card
	class="mb-3 app-shadow round-sm"
	footer-class="bg-white py-1 px-2"
	no-body
>
	<b-link
		:to="{ name: 'Figure.File', params: { figureId: options.id } }"
	>
		<b-aspect
			aspect="3:4"
			class="app-background-center"
			:style="`background-image: url(/api/image/${options.image}/image.png)`"
		></b-aspect>
	</b-link>

	<template #footer>
		<div class="">
			<div class="font-weight-bold">{{ options.name }}</div>
			<div style="font-size: 14px;">{{ options.profile | sub16 }}</div>
		</div>
	</template>
</b-card>

</template>

<script>
export default {
	props: ['options'],
	filters: {
		sub16(string) {
			return string.length < 16 ? string : `${string}...`;
		}
	}
};
</script>

<style>

</style>
