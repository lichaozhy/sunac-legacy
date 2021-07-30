module.exports = {
	devServer: {
		port: 80,
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:8000'
			}
		}
	},
	configureWebpack: {
		externals: {
			wx: 'wx'
		}
	}
};
