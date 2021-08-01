module.exports = {
	pages: {
		index: {
			entry: 'src/main.js',
			title: '城市记忆博物馆'
		}
	},
	devServer: {
		port: 80,
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:8000'
			}
		}
	},
	configureWebpack: config => {
		config.externals = {
			wx: 'wx'
		};

		config.module.rules[0].use[1].options.transformAssetUrls = {
			video: ['src', 'poster'],
			source: 'src',
			img: 'src',
			image: 'xlink:href',
			'b-avatar': 'src',
			'b-img': 'src',
			'b-img-lazy': ['src', 'blank-src'],
			'b-card': 'img-src',
			'b-card-img': 'src',
			'b-card-img-lazy': ['src', 'blank-src'],
			'b-carousel-slide': 'img-src',
			'b-embed': 'src'
		};
	}
};
