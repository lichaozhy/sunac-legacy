import '@produck/duck';
import Sequelize from 'sequelize'
import { Options as AppOptions } from './src/normalize/options';
import * as Utils from './src/utils/index';
import { Model } from './src/sequelize/model';

declare module '@produck/duck' {
	interface InstalledInjection {
		options: AppOptions;
		Sequelize: Sequelize.Sequelize;
		Utils: typeof Utils;
		Model: typeof Model;
		Wechat: Wechat;
		ShareLike: ShareLike;
		Config: ConfigureManager;
	}
}

interface ShareLike {
	commit(shareId: string): number;
	get(shareId: string): number;
	compute(): Promise<void>;
}

interface Wechat {
	readonly accessToken: string;
	readonly jsSdkTicket: string;
}

interface ConfigureManager {
	init(dirpath): Promise<void>;
	get(key: string): any;
	set<T>(key: string, value: T): T;
}

interface SunacLegacy {
	start(): Promise<void>;
	install(): Promise<void>;
	readonly sequelize: Sequelize.Sequelize;
}

declare function SunacLegacyConstructor(options: AppOptions): SunacLegacy;

export = SunacLegacyConstructor;
