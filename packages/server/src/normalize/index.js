const path = require('path');
const utils = require('../utils');

module.exports = function normalize(_options = {}) {
	const options = {
		server: {
			administration: {
				host: '0.0.0.0',
				port: 3000,
				tls: null
			},
			maintenance: {
				host: '0.0.0.0',
				port: 9000,
				tls: null
			},
			customers: {
				origin: 'http://sunac-shanghai-dev.produckjs.net',
				host: '0.0.0.0',
				port: 80,
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
		},
		cityList: [
			'310100', '320500', '320600', '320200', '320400',
			'321000', '321100', '321200', '340200', '320100',
			'341100', '340500', '320300', '320800', '321300',
			'340400', '320900', '150100', '150200', '650000',
		]
	};

	const {
		server: _server = options.server,
		cityList: _cityList = options.cityList,
		wx: _wx = options.wx
	} = _options;

	if (typeof _server !== 'object') {
		throw new Error('Invalid ".server", an object expected.');
	} else {
		const {
			administration: _administration = options.server.administration,
			maintenance: _maintenance = options.server.maintenance,
			customers: _customers = options.server.customers
		} = _server;

		if (typeof _maintenance !== 'object') {
			throw new Error('Invalid ".server.maintenance", an object expected.');
		} else {
			const {
				host: _host = options.server.maintenance.host,
				port: _port = options.server.maintenance.port
			} = _maintenance;

			if (typeof _host !== 'string') {
				throw new Error('Invalid ".server.maintenance.host", a string expected.');
			}

			if (typeof _port !== 'number') {
				throw new Error('Invalid ".server.maintenance.port", a port number expected.');
			}

			options.server.maintenance.host = _host;
			options.server.maintenance.port = _port;
		}

		if (!isObject(_customers)) {
			throw new Error('Invalid ".server.customers", an object expected.');
		} else {
			const {
				host: _host = options.server.customers.host,
				port: _port = options.server.customers.port,
				origin: _origin = options.server.customers.origin
			} = _customers;

			if (typeof _host !== 'string') {
				throw new Error('Invalid ".server.customers.host", a string expected.');
			}

			if (typeof _port !== 'number') {
				throw new Error('Invalid ".server.customers.port", a port number expected.');
			}

			if (!isString(_origin)) {
				throw new Error('Invalid ".server.customers.origin", a string expected.');
			}

			options.server.customers.host = _host;
			options.server.customers.port = _port;
			options.server.customers.origin = _origin;
		}
	}

	if (!Array.isArray(_cityList)) {
		throw new Error('Invalid ".cityList", an array expected.');
	} else {
		options.cityList = _cityList.map((adcode, index) => {
			if (utils.City.getCity(adcode) === null) {
				throw new Error(`Invalid ".cityList[${index}]", an adcode expected.`);
			}

			return adcode;
		});
	}

	if (typeof _wx !== 'object') {
		throw new Error('Invalid ".wx", an object expected.');
	} else {
		const {
			appid: _appid,
			appsecret: _appsecret
		} = _wx;

		if (!isString(_appid)) {
			throw new Error('Invalid ".wx.appid, a string expected, required.');
		}

		if (!isString(_appsecret)) {
			throw new Error('Invalid ".wx.appsecret, a string expected, required.');
		}

		options.wx.appid = _appid;
		options.wx.appsecret = _appsecret;
	}

	return options;
};

function isObject(any) {
	return typeof any === 'object';
}

function isString(any) {
	return typeof any === 'string';
}
