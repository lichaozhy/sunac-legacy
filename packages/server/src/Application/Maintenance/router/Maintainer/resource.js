module.exports = {
	Maintainer(data) {
		return {
			id: data.id,
			name: data.name,
			createdAt: data.createdAt,
			credential: {}
		};
	}
};
