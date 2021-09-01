const fs = require('fs-extra');
const path = require('path');

const FILE_NAME = 'config.json';

const state = {
	dirpath: '',
	store: {}
};

function getFilePath() {
	return path.join(state.dirpath, FILE_NAME);
}

const ConfigureManager = {
	async init(dirpath) {
		state.dirpath = path.resolve(dirpath);

		const filepath = getFilePath();

		try {
			const config = await fs.readJson(filepath);

			Object.assign(state.store, config);
		} catch (err) {
			await fs.ensureFile(filepath);
			await fs.writeFile(filepath, '{}');
		}
	},
	get(key) {
		return state.store[key];
	},
	set(key, value) {
		state.store[key] = value;
		fs.writeFile(getFilePath(), JSON.stringify(state.store));

		return value;
	}
};

module.exports = ConfigureManager;
