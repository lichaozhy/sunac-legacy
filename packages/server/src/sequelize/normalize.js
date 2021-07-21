const path = require('path');

module.exports = function normalize(_options) {
	const options = {
		storage: path.resolve('output/czbrusher.sqlite'),
		namespace: '',
		onLog: sql => console.log(sql)
	};

	const {
		storage: _storage = options.storage,
		namespace: _namespace = options.namespace,
		onLog: _onLog = options.onLog
	} = _options;

	options.storage = _storage;
	options.namespace = _namespace;
	options.onLog = _onLog;

	return options;
};
