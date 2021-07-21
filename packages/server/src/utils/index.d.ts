export namespace City {
	type Adcode = string;

	interface CityObject {
		adcode: Adcode;
		name: string;
		center: string;
	}

	export function getCity(adcode: Adcode): CityObject | null;
	export function getCityList(): CityObject[];
}
