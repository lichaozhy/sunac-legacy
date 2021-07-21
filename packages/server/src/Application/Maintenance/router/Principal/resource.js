module.exports = {
	Principal(data = {
		id: null,
		name: null,
		password: null
	}) {
		return {
			maintainerId: data.id,
			username: data.name,
			password: null
		};
	}
};
