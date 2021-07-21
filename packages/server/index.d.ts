import '@produck/duck';
import Sequelize from 'sequelize'
import { Options as AppOptions } from './src/normalize/index';
import * as Utils from './src/utils/index';
import { Model } from './src/sequelize/model';

declare module '@produck/duck' {
	interface InstalledInjection {
		options: AppOptions;
		Sequelize: Sequelize.Sequelize;
		Utils: typeof Utils;
		Model: typeof Model;
	}
}

interface SunacLegacy {
	start(): Promise<void>;
	install(): Promise<void>;
	readonly sequelize: Sequelize;
}

export = function SunacLegacyConstructor(): SunacLegacy;
