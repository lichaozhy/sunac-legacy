<template>

<div>
	<h4>非遗电台节目</h4><hr>

	<b-form-row>
		<b-col clos="6">
			<b-input-group
				prepend="推荐节目"
				class="w-100"
			>
				<b-form-input
					v-model="form.recommended"
					class="mr-0 ml-auto"
					placeholder="推荐节目地址"
				/>

				<template #append>
					<b-button
						variant="primary"
						@click="setRecommanded"
						:disabled="recommended === form.recommended"
					>更新</b-button>
				</template>
			</b-input-group>
		</b-col>

		<b-col clos="6">
			<b-input-group
				prepend="主播招募"
				class="w-100"
			>
				<b-form-input
					v-model="form.recruit"
					class="mr-0 ml-auto"
					placeholder="招募地址"
				/>

				<template #append>
					<b-button
						variant="primary"
						@click="setRecruit"
						:disabled="recruit === form.recruit"
					>更新</b-button>
				</template>
			</b-input-group>

		</b-col>
	</b-form-row>

	<b-button-toolbar class="mt-3">
		<b-pagination
			v-model="pagination.current"
			:per-page="pagination.size"
			:total-rows="pagination.total"
			size="sm"
			class="mb-0 mr-5 ml-auto"
		></b-pagination>

		<b-button
			variant="danger"
			class="mr-1"
			@click="deleteProgramme"
			:disabled="selectedId === null"
		>删除</b-button>

		<b-button
			@click="requestCreatingProgramme"
			variant="success"
			class="mr-auto"
		>创建</b-button>
	</b-button-toolbar>

	<b-table
		class="mt-3"
		ref="table"
		:items="provideProgrammeList"
		:fields="programmeFieldList"
		small
		bordered
		:per-page="pagination.size"
		:current-page="pagination.current"
		show-empty
		select-mode="single"
		selectable
		@row-selected="setSelectedId"
	>
		<template #empty>
			没有符合要求的条目
		</template>

		<template #cell(thumb)="row">
			<b-aspect
				aspect="4:3"
				class="border previewer"
				style="background-color: #f0f0f0; background-size: cover; background-position: center"
				:style="{
					'background-image': `url(/api/image/${row.item.thumb}/image.png)`
				}"
			></b-aspect>
		</template>

		<template #cell(title)="row">
			<b-link
				:href="row.item.href"
				target="__blank"
			>{{ row.item.title }}<b-icon-box-arrow-up-right
				class="ml-2"
			/></b-link>
		</template>
	</b-table>

	<app-creation
		@created="refreshTable"
		ref="creation"
	/>
</div>

</template>

<script>
import Creation from './Creation.vue';

export default {
	components: { AppCreation: Creation },
	data() {
		return {
			recommended: '',
			recruit: '',
			form: {
				recommended: '',
				recruit: ''
			},
			selectedId: null,
			pagination: {
				current: 1,
				total: 100,
				size: 10
			},
		};
	},
	computed: {
		programmeFieldList() {
			return [
				{ key: 'title', label: '标题' },
				{ key: 'thumb', label: '缩略图', class: 'col-thumb' },
				{ key: 'publishedAt', label: '发布于', class: 'col-date' },
				{ key: 'createdAt', label: '创建于', class: 'col-datetime' },
			];
		},
	},
	methods: {
		async deleteProgramme() {
			await this.$app.Api.Programme(this.selectedId).delete();
			this.$bvToast.toast('删除非遗电台节目成功', { variant: 'success' });
			this.refreshTable();
		},
		requestCreatingProgramme() {
			this.$refs.creation.open();
		},
		setSelectedId(rows) {
			this.selectedId = rows.length > 0 ? rows[0].id : null;
		},
		async provideProgrammeList(ctx) {
			const query = {
				title: this.keyword,
				pageSize: ctx.perPage,
				pageCurrent: ctx.currentPage,
				sortBy: ctx.sortBy,
				sortDesc: ctx.sortDesc
			};

			const { list, total } = await this.$app.Api.Programme.query(query);

			this.pagination.total = total;

			return list.map(programme => {
				return {
					id: programme.id,
					title: programme.title,
					href: programme.href,
					thumb: programme.thumb,
					createdAt: this.$app.Filter.localDatetime(programme.createdAt),
					publishedAt: this.$app.Filter.localDate(programme.publishedAt)
				};
			});
		},
		async refreshTable() {
			this.$refs.table.refresh();
		},
		async getRecommanded() {
			const { value } = await this.$app.Api.Config.get('recommand');

			this.form.recommended = value;
			this.recommended = value;
		},
		async setRecommanded() {
			const { value } = await this.$app.Api.Config.set('recommand', this.form.recommended);

			this.recommended = value;
		},
		async getRecruit() {
			const { value } = await this.$app.Api.Config.get('recruit');

			this.form.recruit = value;
			this.recruit = value;
		},
		async setRecruit() {
			const { value } = await this.$app.Api.Config.set('recruit', this.form.recruit);

			this.recruit = value;
		}
	},
	async mounted() {
		this.getRecommanded();
		this.getRecruit();
	}
};
</script>

<style>

</style>
