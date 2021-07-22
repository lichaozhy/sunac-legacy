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
	tls?: ServerTls | null;
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
		path?: string;
	}
}

interface Database {
	type?: 'sqlite' | 'mysql' | 'mssql' | 'mariadb' | 'postgre';
	options?: Database.Sqlite;
}

export interface Options {
	server: Server.Assignment;
	wx: WX;
	database: Database;
	storage: Storage;
	log: Log;
}
