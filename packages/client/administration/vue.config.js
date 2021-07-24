module.exports = {
	devServer: {
		port: 3080,
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:3000'
			}
		}
	}
};
