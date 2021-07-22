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

	interface Maintainer {
		id: string;
		name: string;
		createdAt: string;
		credential: {}
	}
}

namespace Api {
	namespace Principal {
		function signin(options: Model.Principal): Promise<Model.Principal>;
		function signout(): Promis<Model.Principal>;

		namespace Maintainer {
			function get():  Promise<Model.Maintainer>;
		}
	}

	namespace City {
		function query(): Promise<Model.City[]>;
		function get(adcode: Adcode): Promise<Model.City>;
	}

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
