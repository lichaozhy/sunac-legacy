const path = require('path');
const utils = require('../utils');

module.exports = function normalize(_options = {}) {
	const options = {
		server: {
			administration: {
				origin: 'http://127.0.0.1:3000',
				host: '0.0.0.0',
				port: 3000,
				tls: null
			},
			maintenance: {
				origin: 'http://127.0.0.1:9000',
				host: '0.0.0.0',
				port: 9000,
				tls: null
			},
			customers: {
				dev: false,
				origin: 'http://127.0.0.1',
				host: '0.0.0.0',
				port: 80,
				tls: null
			},
		},
		wx: {
			debug: false
		},
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
				administration: 'administration/access.log',
				customers: 'customers/access.log'
			}
		},
		cityList: [
			'310000', '320500', '320600', '320200', '320400',
			'321000', '321100', '321200', '340200', '320100',
			'341100', '340500', '320300', '320800', '321300',
			'340400', '320900', '150100', '150200', '650000',
		],
		defaultCity: '310000'
	};

	const {
		server: _server = options.server,
		cityList: _cityList = options.cityList,
		wx: _wx = options.wx,
		defaultCity: _defaultCity = options.defaultCity
	} = _options;

	if (typeof _server !== 'object') {
		throw new Error('Invalid ".server", an object expected.');
	} else {
		const {
			administration: _administration = options.server.administration,
			maintenance: _maintenance = options.server.maintenance,
			customers: _customers = options.server.customers
		} = _server;

		if (!isObject(_maintenance)) {
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
				origin: _origin = options.server.customers.origin,
				dev: _dev = options.server.customers.dev,
				tls: _tls
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

			if (!isBoolean(_dev)) {
				throw new Error('Invalid ".server.customers.origin", a string expected.');
			}

			if (!isObject(_tls) || !_tls.key || !_tls.cert) {
				throw new Error('Invalid ".server.customers.tls", a string expected.');
			}

			options.server.customers.dev = _dev;
			options.server.customers.host = _host;
			options.server.customers.port = _port;
			options.server.customers.origin = _origin;
			options.server.customers.tls = _tls;
		}

		if (!isObject(_administration)) {
			throw new Error('Invalid ".server.administration", an object expected.');
		} else {
			const {
				host: _host = options.server.administration.host,
				port: _port = options.server.administration.port
			} = _administration;

			if (typeof _host !== 'string') {
				throw new Error('Invalid ".server.administration.host", a string expected.');
			}

			if (typeof _port !== 'number') {
				throw new Error('Invalid ".server.administration.port", a port number expected.');
			}

			options.server.administration.host = _host;
			options.server.administration.port = _port;
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
			appsecret: _appsecret,
			debug: _debug = options.wx.debug
		} = _wx;

		if (!isString(_appid)) {
			throw new Error('Invalid ".wx.appid, a string expected, required.');
		}

		if (!isString(_appsecret)) {
			throw new Error('Invalid ".wx.appsecret, a string expected, required.');
		}

		if (!isBoolean(_debug)) {
			throw new Error('Invalid ".wx.debug, a boolean expected.');
		}

		options.wx.appid = _appid;
		options.wx.appsecret = _appsecret;
		options.wx.debug = _debug;
	}

	if (!isString(_defaultCity)) {
		throw new Error('Invalid ".defaultCity", a string expected.');
	}

	return options;
};

function isObject(any) {
	return typeof any === 'object';
}

function isString(any) {
	return typeof any === 'string';
}

function isBoolean(any) {
	return typeof any === 'boolean';
}
