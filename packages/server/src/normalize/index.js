const path = require('path');

module.exports = function normalize(_options = {}) {
	const options = {
		server: {
			administration: {
				host: '0.0.0.0',
				port: 8080,
				tls: null
			},
			maintenance: {
				host: '0.0.0.0',
				port: 9000,
				tls: null
			},
			customers: {
				host: '0.0.0.0',
				port: 443,
				tls: {}
			},
		},
		wx: {},
		database: {
			type: 'sqlite',
			options: {
				path: 'db/sunac.sqlite'
			}
		},
		storage: {
			path: path.resolve('storage')
		},
		log: {
			path: 'log',
			system: 'system.log',
			database: 'database.log',
			access: {
				maintenance: 'maintenance/access.log',
				administration: 'maintenance/access.log',
				customers: 'maintenance/access.log'
			}
		}
	};

	return options;
};
