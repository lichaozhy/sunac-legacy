module.exports = {
	devServer: {
		port: 9080,
		proxy: {
			'/api': {
				target: 'http://localhost:9000'
			}
		}
	}
};
