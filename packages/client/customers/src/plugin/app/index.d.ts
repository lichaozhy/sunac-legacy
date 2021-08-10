import 'vue';

declare namespace Model {
	interface Image {
		id: string;
		size: string;
		createdAt: string;
	}

	interface Page<T> {
		size: number;
		total: number;
		current: number;
		list: T[];
	}

	interface Reference {
		id: string;
		title: string;
		abstract: string;
		thumb: string;
		href: string;
		createdAt: string;
	}

	interface Banner {
		id: string;
		image: string;
		createdAt: string;
	}

	interface CustomerWechat {
		openid: string;
		nickname: string;
		sex: number;
		headimgurl: string;
	}

	interface Customer {
		id: string;
		name: string;
		wechat: CustomerWechat;
		createdAt: string;
		cityAs: Adcode;
	}

	interface City {
		name: string;
		adcode: string;
		center: string;
	}

	interface Photo {
		id: string;
	}

	interface Like {
		like: number;
	}

	interface Share {
		id: string;
		title: string;
		raw: string;
		imageList: string[];
		createdAt: string;
		createdBy: Customer;
	}

	interface Topic {
		id: string;
		title: string;
		banner: string;
		description: string;
		read: number;
		like: number;
		createdAt: string;
		createdBy: Customer;
	}

	interface Post {
		raw: string;
		imageList: string[];
	}

	interface Reply {
		id: string;
		title: string;
		raw: string;
		createdAt: string;
		createdBy: Customer;
	}

	interface WechatConfig {
		debug: boolean;
		appId: string;
		timestamp: string;
		nonceStr: string;
		signature: string;
	}

	interface Figure {
		id: string;
		name: string;
		profile: string;
		image: string;
		href: string;
		createdAt: string;
	}
}

declare namespace Api {
	interface Banner {
		query(): Promise<Model.Banner[]>;
	}

	interface Customer {
		get(): Promise<Model.Customer>;
		update(options: Model.Customer): Promise<Model.Customer>;
		TodayLiked: CustomerTodayLiked;
	}

	type ShareId = string;

	interface CustomerTodayLiked {
		query(): Promise<ShareId[]>;
	}

	interface City {
		(adcode: Adcode): CityInstance;
		query(): Promise<Model.City[]>;
	}

	interface CityInstance {
		get(adcode: Adcode): Promise<Model.City>;
	}

	interface Photo {
		query(): Promise<Model.Page<Model.Photo>>;
		(photoId: string): PhotoInstance;
	}

	interface PhotoInstance {
		like(): Promise<Like>;
	}

	interface Reference {
		query(): Promise<Model.Page<Model.Reference>>;
	}

	interface Share {
		(shareId: string): ShareInstance;
		top(): Promise<Model.Share[]>;
		query(): Promise<Model.Page<Model.Share>>;
		create(options: Model.Share): Promise<Model.Share>;
	}

	interface ShareInstance {
		get(): Promise<Model.Share>;
		like(): Promise<Model.Like>;
		unlike(): Promise<Model.Like>;
	}

	interface Topic {
		(topicId: string): TopicInstance;
		query(): Promise<Model.Page<Model.Topic>>;
		create(options: Model.Topic): Promise<Model.Topic>;
	}

	interface TopicInstance {
		get(): Promise<Model.Topic>;
		delete(): Promise<Model.Topic>;
		like(): Promise<Model.Like>;
		Post: TopicInstancePost;
	}

	interface TopicInstancePost {
		(postId): TopicInstancePostInstance;
		query(): Promise<Model.Page<Model.Post>>;
		create(options: Model.Post): Promise<Model.Post>;
	}

	interface TopicInstancePostInstance {
		get(): Promise<Model.Post>;
		delete(): Promise<Model.Post>;
		like(): Promise<Model.Like>;
		Reply: TopicInstancePostInstanceReply;
	}

	interface TopicInstancePostInstanceReply {
		query(): Promise<Model.Page<Model.Reply>>;
		create(options: Model.Reply): Promise<Model.Reply>;
	}

	interface Wechat {
		getConfig(): Promise<Model.WechatConfig>;
	}

	interface Image {
		create(options: { mediaId: string }): Model.Image;
	}

	interface Figure {
		query(): Promise<Model.Figure[]>;
	}
}

interface Api {
	Banner: Api.Banner;
	Customer: Api.Customer;
	City: Api.City;
	Photo: Api.Photo;
	Reference: Api.Reference;
	Share: Api.Share;
	Topic: Api.Topic;
	Wechat: Api.Wechat;
	Image: Api.Image;
	Figure: Api.Figure;
}

interface App {
	Api: Api;
	Filter: typeof Filter;
}

namespace Wechat {
	interface ChooseImageRes {
		localIds: string[];
	}

	interface ChooseImageOptions {
		count: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
		sizeType: ('original' | 'compressed')[];
		sourceType: ('album' | 'camera')[];
		success?: (res: ChooseImageRes) => void;
	}

	interface UploadImageRes {
		serverId: string;
	}

	interface UploadImageOptions {
		localId: string;
		isShowProgressTips?: 1;
		success?: (res: UploadImageRes) => void;
	}

	interface ShareData {
		title: string;
		link: string;
		imgUrl: string;
		success?: () => void;
	}

	interface MessageShareData extends ShareData {
		desc: string;
	}

	interface Promises {
		chooseImage(options: Wechat.ChooseImageOptions): Promise<ChooseImageRes>;
		uploadImage(options: Wechat.UploadImageOptions): Promise<UploadImageRes>;
		updateAppMessageShareData(options: Wechat.MessageShareData): Promise<void>;
		updateTimelineShareData(options: Wechat.ShareData): Promise<void>;
	}
}

interface WechatApi {
	chooseImage(options: Wechat.ChooseImageOptions): void;
	uploadImage(options: Wechat.UploadImageOptions): void;
	updateAppMessageShareData(options: Wechat.MessageShareData): void;
	updateTimelineShareData(options: Wechat.ShareData): void;

	promises: Wechat.Promises;
}

declare module "vue/types/vue" {
	interface Vue {
		$app: App;
		$wx: WechatApi;
	}

	interface VueConstructor {
		$app: App;
		$wx: WechatApi;
	}
}
