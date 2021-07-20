namespace Options {
	namespace Server {
		interface Tls {
			/**
			 * TLS key path.
			 */
			key: string;
	
			/**
			 * TLS cert path.
			 */
			cert: string;
		}

		interface Assignment {
			administration: Server;
			maintenance: Server;
			customers: Server;
		}
	}
	
	interface Server {
		host?: string;
		port?: number;
		tls?: ServerTls;
	}

	interface WX {
		appid: string;
		appsecret: string;
	}

	interface Storage {
		path: string;
	}

	interface Log {
		path: string;
		system: object;
		database: object;
		access: {
			maintenance: object;
			administration: object;
			customers: object;
		}
	}

	namespace Database {
		interface Sqlite {
			path: string;
		}
	}

	interface Database {
		type: 'sqlite' | 'mysql' | 'mssql' | 'mariadb' | 'postgre';
		options: Database.Sqlite;
	}
}

interface Options {
	server: Options.Server;
	wx: Options.WX;
	database: Options.Database;
	storage: Options.Storage;
	log: Options.Log;
}