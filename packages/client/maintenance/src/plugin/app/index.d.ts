import 'vue';

type Adcode = string;

namespace Model {
	interface City {
		name: string;
		adcode: string;
		center: string;
	}

	interface Principal {
		maintainerId: string;
		username: string;
		password: null;
	}

	interface MaintainerCredential {
		password: '';
	}

	interface Maintainer {
		id: string;
		name: string;
		createdAt: string;
		credential: MaintainerCredential;
	}

	interface AdministratorCredential {
		password: '';
	}

	interface Administrator {
		id: string;
		name: string;
		createdAt: string;
		credential: AdministratorCredential;
		cityList: Adcode[];
	}
}

namespace Query {
	interface Maintainer {
		name: string;
	}

	interface Administrator {
		name: string;
	}
}

namespace Api {
	interface PrincipalMaintainer {
		get():  Promise<Model.Maintainer>;
		update(options: Model.Maintainer): Promise<Model.Maintainer>;
	}

	interface Principal {
		signin(options: Model.Principal): Promise<Model.Principal>;
		signout(): Promis<Model.Principal>;
		Maintainer: PrincipalMaintainer;
	}

	interface CityInstance {
		get(adcode: Adcode): Promise<Model.City>;
	}

	interface City {
		(adcode: Adcode): CityInstance;
		query(): Promise<Model.City[]>;
	}

	interface MaintainerInstance {
		get(): Promise<Model.Maintainer>;
		delete(): Promise<Model.Maintainer>;
	}

	interface Maintainer {
		(maintainerId: string): MaintainerInstance;
		query(query: Query.Maintainer): Promise<Model.Maintainer>;
		create(options: Model.Maintainer): Promise<Model.Maintainer>;
	}

	interface AdministratorInstanceCity {
		create(options): Promise<void>;
		delete(adcode: Adcode): Promise<void>;
	}

	interface AdministratorInstance {
		get(): Promise<Model.Administrator>;
		update(options: Model.Administrator): Promise<Model.Administrator>;
		delete(): Promise<Model.Administrator>;
		City: AdministratorInstanceCity;
	}

	interface Administrator {
		(administratorId: string): AdministratorInstance;
		query(query: Query.Administrator): Promise<Model.Administrator[]>;
		create(options: Model.Administrator): Model.Administrator;
	}

	const Maintainer: Maintainer;
	const Administrator: Administrator;
	const City: City;
	const Principal: Principal;
}

interface App {
	Api: typeof Api;
}

declare module "vue/types/vue" {
	interface Vue {
		$app: App;
	}

	interface VueConstructor {
		$app: App;
	}
}
