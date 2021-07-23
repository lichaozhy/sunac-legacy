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

	interface Administrator {
		id: string;
		name: string;
		createdAt: string;
		credential: {};
		cityList: Adcode[];
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

	interface

	interface MaintainerInstance {
		get(): Promise<Model.Maintainer>;
		delete(): Promise<Model.Maintainer>;
	}

	interface Maintainer {
		(maintainerId: string): MaintainerInstance;
		query(): Promise<Model.Maintainer>;
		create(options: Model.Maintainer): Promise<Model.Maintainer>;
	}

	interface AdministratorInstance {
		get(): Promise<Model.Administrator>;
		delete(): Promise<Model.Administrator>;
	}

	interface Administrator {
		(administratorId: string): AdministratorInstance;
		query(): Promise<Model.Administrator[]>;
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
