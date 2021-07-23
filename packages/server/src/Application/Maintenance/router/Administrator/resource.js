const ADDCODE_GETTER = city => city.adcode;

module.exports = {
	Administrator(data) {
		return {
			id: data.id,
			name: data.name,
			createdAt: data.createdAt,
			cityList: data.cityList.map(ADDCODE_GETTER),
			customer: data.customer,
			credential: {}
		};
	},
	AdministratorCity(data) {
		return {
			id: data.id,
			administratorId: data.administratorId,
			adcode: data.adcode
		};
	}
};
