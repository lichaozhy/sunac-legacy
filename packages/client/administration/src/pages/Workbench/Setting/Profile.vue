<template>

<div>
	<h4>基本属性</h4><hr>

	<b-row>
		<b-col cols="8">
			<b-form>
				<b-form-group
					label="管理员用户名"
				>
					<b-form-input
						:value="administrator.name"
						readonly
					/>
				</b-form-group>
				<b-form-group
					label="创建于"
				>
					<b-form-input
						readonly
						:value="$app.Filter.localDatetime(administrator.createdAt)"
					/>
				</b-form-group>
				<b-form-group
					label="可管理城市"
				>
					<b-form-tags
						:value="administratorCityList"
						disabled
						placeholder=""
						tag-pills
						tag-variant="primary"
					></b-form-tags>
					<b-form-text>内容管理员需要自行联系运维管理员修改管辖城市</b-form-text>
					<b-form-text>管辖城市只影响您的审核权限</b-form-text>
				</b-form-group>
				<b-form-group
					label="绑定普通用户身份"
				>
					<b-input-group>
						<b-form-input
							:value="customer.name || 'N/a'"
							readonly
						/>
						<template #append>
							<b-button
								variant="primary"
								@click="requestBindCustomer"
							>绑定普通用户身份</b-button>
						</template>
					</b-input-group>
					<b-form-text>绑定普通用户身份才能进行<b-link
						class="mx-1"
						:to="{ name: 'Workbench.Interaction' }"
					>互动中心</b-link>的创作</b-form-text>
					<b-form-text>当所代表城市为该管理员的管辖城市时，创作内容将自动通过审核</b-form-text>
				</b-form-group>
			</b-form>

		</b-col>
		<b-col cols="4">
			<b-aspect aspect="1:1">
				<b-avatar
					size="100%"
					:src="customer.headimgurl"
				></b-avatar>
			</b-aspect>
		</b-col>
	</b-row>

	<h4>修改密码</h4><hr>

	<b-row>
		<b-col cols="8">
			<b-form
				@submit="changePassword"
			>

				<b-form-group
					label="原始密码"
				>
					<b-form-input
						v-model="form.password.origin"
					/>
				</b-form-group>
				<b-form-group
					label="新密码"
				>
					<b-form-input
						v-model="form.password.target"
					/>
				</b-form-group>
				<b-form-group
					label="确认新密码"
				>
					<b-form-input
						v-model="form.password.confirm"
					/>
				</b-form-group>

				<b-form-text>密码长度至少为1位</b-form-text>

				<b-button
					variant="success"
					class="mt-3"
				>确认修改</b-button>
			</b-form>
		</b-col>
	</b-row>

	<b-modal
		title="选择绑定账户"
		centered
		ref="customer-selector"
		@ok="bindCustomer"
		hide-footer
		size="lg"
		@shown="customerSelector.isBusy=false"
		@hidden="resetCustomerSelector"
	>
		<div style="min-height: 600px">
			<b-button-toolbar>
				<b-form-input style="width: 12em" class="mr-1" v-model="customerSelector.keyword" />
				<b-button variant="primary" class="mr-auto" @click="getAllCustomerList">搜索</b-button>
				<b-pagination
					per-page="10"
					:total-rows="customerSelector.pagination.total"
					v-model="customerSelector.pagination.current"
					size="sm"
					class="mb-0 mx-auto"
				/>
				<b-button
					variant="success"
					:disabled="customerSelector.selectedCustomerId === null"
					@click="bindCustomer"
				>确认绑定</b-button>
			</b-button-toolbar>

			<b-table
				:busy="customerSelector.isBusy"
				ref="customerTable"
				per-page="10"
				:current-page="customerSelector.pagination.current"
				class="mt-3"
				small
				bordered
				select-mode="single"
				selectable
				:items="customerListProvider"
				:fields="customerFieldList"
				@row-selected="selectCustomer"
			>
				<template #cell(headimg)="row">
					<b-avatar
						:src="row.item.avatarSrc"
						size="sm"
					></b-avatar>
				</template>
			</b-table>
		</div>
	</b-modal>
</div>

</template>

<script>
export default {
	data() {
		return {
			cityList: [],
			administrator: {
				id: '',
				name: '',
				createdAt: '',
				cityList: []
			},
			form: {
				password: {
					origin: '',
					target: '',
					confirm: ''
				}
			},
			customer: {
				nickname: '',
				openid: '',
				sex: '',
				headimgurl: ''
			},
			customerSelector: {
				isBusy: true,
				keyword: '',
				selectedCustomerId: null,
				pagination: {
					current: 1,
					total: 0
				},
			}
		};
	},
	computed: {
		administratorCityList() {
			return this.administrator.cityList.map(adcode => {
				return this.cityList.find(city => city.adcode === adcode).name;
			});
		},
		customerFieldList() {
			return [
				{ key: 'openid', label: '开放ID', class: 'col-openid' },
				{ key: 'headimg', label: '头像', class: 'col-tiny-string text-center' },
				{ key: 'nickname', label: '微信昵称' },
				{ key: 'sex', label: '性别', class: 'col-tiny-string text-center' },
				{ key: 'createdAt', label: '首次登录于', class: 'col-datetime' }
			];
		}
	},
	methods: {
		requestBindCustomer() {
			this.$refs['customer-selector'].show();
		},
		async getPrincipalAdministrator() {
			const administrator = await this.$app.Api.Principal.Administrator.get();

			this.administrator = administrator;

			if (administrator.customer !== null) {
				this.customer.name = administrator.customer.name;
				this.customer.headimgurl = administrator.customer.wechat.headimgurl;
			}
		},
		async getAllCityList() {
			this.cityList = await this.$app.Api.City.query();
		},
		async getAllCustomerList() {
			this.$refs.customerTable.refresh();
		},
		async customerListProvider(ctx) {
			const { total, list } = await this.$app.Api.Customer.query({
				name: this.customerSelector.keyword,
				pageSize: ctx.perPage,
				pageCurrent: ctx.currentPage
			});

			this.customerSelector.pagination.total = total;

			return list.map(data => {
				return {
					id: data.id,
					openid: data.wechat.openid,
					nickname: data.wechat.nickname,
					avatarSrc: data.wechat.headimgurl,
					sex: data.wechat.sex,
					createdAt: data.createdAt
				};
			});
		},
		selectCustomer(rows) {
			this.customerSelector.selectedCustomerId = rows.length > 0 ? rows[0].id : null;
		},
		resetCustomerSelector() {
			this.customerSelector = {
				isBusy: true,
				keyword: '',
				selectedCustomerId: null,
				pagination: {
					current: 1,
					total: 0
				},
			};
		},
		async bindCustomer() {
			this.$refs['customer-selector'].hide();
			await this.$app.Api.Principal.Administrator.Customer.update({
				id: this.customerSelector.selectedCustomerId
			});
			await this.getPrincipalAdministrator();
		},
		async changePassword() {

		}
	},
	async mounted() {
		await this.getAllCityList();
		await this.getPrincipalAdministrator();
	}
};
</script>

<style>
.col-openid {
	width: 20em;
}
</style>
