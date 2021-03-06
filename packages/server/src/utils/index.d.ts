export namespace City {
	type Adcode = string;
	interface CityObject {
		adcode: Adcode;
		name: string;
		center: string;
	}

	export function getCity(adcode: Adcode): CityObject | null;
	export function getCityList(): CityObject[];
	export function isCityAdcode(): boolean;
}

export function encodeSHA256(raw: Buffer | string): string;
export function randomInt(from: number, to: number): number;
export function salt(length: number): string;

interface WechatOauthOptions {
	appid: string;
	origin: string;
	scope?: 'snsapi_base' | 'snsapi_userinfo';
	state?: string;
}

export function WechatOauthRedirectURL(options: WechatOauthOptions): string;
