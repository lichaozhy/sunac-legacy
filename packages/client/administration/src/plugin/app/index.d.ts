import 'vue';

type Adcode = string;

namespace Model {
	interface Page<T> {
		size: number;
		total: number;
		current: number;
		list: T[];
	}

	interface Content {
		id: string;
		like?: number;
		createdAt: string;
		updatedAt: string;
		validatedAt: string;
		createdBy: Customer;
	}

	interface City {
		name: string;
		adcode: string;
		center: string;
	}

	interface CustomerWechat {
		openid: string;
		nickname: string;
		sex: number;
		headimg: string;
	}

	interface Customer {
		id: string;
		name: string;
		wechat: CustomerWechat;
		createdAt: string;
		cityAs: Adcode;
	}

	interface Principal {
		administratorId: string;
		username: string;
		password: null
	}

	interface Administrator {
		id: string;
		name: string;
		createdAt: string;
		customer: null | Customer;
	}

	interface Image {
		id: string;
		size: string;
		createdAt: string;
	}

	interface Photo extends Content {
		id: string;
		title: string;
		image: Image;
	}

	interface Reference extends Content {
		title: string;
		abstract: string;
		thumb: Image;
		href: string;
		read: number;
	}

	interface Comment extends Content {
		raw: string;
	}

	interface Share extends Content {
		raw: string;
		imageList: Image[];
	}

	interface Topic extends Content {
		title: string;
		banner: Image;
		description: string;
		read: number;
	}

	interface Post extends Content {
		raw: string;
		imageList: Image[];
	}
}

namespace Query {

}

namespace Api {
	interface Principal {
		signin(options): Promise<Model.Principal>;
		signout(options): Promise<Model.Principal>;
		Administrator: PrincipalAdministrator;
	}

	interface PrincipalAdministrator {
		get(): Promise<Model.Administrator>;
		update(options: Model.Administrator): Promise<Model.Administrator>;
		Customer: PrincipalAdministratorCustomer;
	}

	interface PrincipalAdministratorCustomer {
		update(options: Model.Customer): Promise<Model.Customer>;
	}

	interface City {
		(adcode: Adcode): CityInstance;
		query(): Promise<Model.City[]>;
	}

	interface CityInstance {
		get(adcode: Adcode): Promise<Model.City>;
	}

	interface Customer {
		(customerId: string): CustomerInstance;
		query(): Promise<Model.Page<Model.Customer>>;
	}

	interface CustomerInstance {
		get(): Promise<Model.Customer>;
	}

	interface Photo {
		(photoId: string): PhotoInstance;
		query(): Promise<Model.Page<Model.Photo>>;
		create(options: Model.Photo): Promise<Model.Photo>;
	}

	interface PhotoInstance {
		get(): Promise<Model.Photo>;
		update(options: Model.Photo): Promise<Model.Photo>;
		delete(): Promise<Model.Photo>;
	}

	interface Reference {
		(): ReferenceInstance;
		create(options: Model.Reference): Promise<Model.Reference>;
		query(): Promise<Model.Page<Model.Reference>>;
		Comment: ReferenceComment;
	}

	interface ReferenceInstance {
		get(): Promise<Model.Reference>;
		update(options: Model.Reference): Promise<Model.Reference>;
		delete(): Promise<Model.Reference>;
		Comment: ReferenceInstanceComment;
	}

	interface ReferenceInstanceComment {
		create(options: Model.Comment): Promise<Model.Comment>;
		query(): Promise<Model.Page<Model.Comment>>;
	}

	interface ReferenceComment {
		(commentId: string): ReferenceCommentInstance;
		query(): Promise<Model.Page<Model.Comment>>;
		create(options: Model.Comment): Promise<Model.Comment>;
	}

	interface ReferenceCommentInstance {
		update(options: Model.Comment): Promise<Model.Comment>;
		delete(): Promise<Model.Comment>;
	}

	interface Share {
		(shareId: string): ShareInstance;
		query(): Promise<Page<Model.Share>>;
		create(options: Model.Share): Promise<Model.Share>;
	}

	interface ShareInstance {
		get(): Promise<Model.Share>;
		update(options: Model.Share): Promise<Model.Share>;
		delete(): Promise<Model.Share>;
	}

	interface Topic {
		(topicId: string): Promise<>;
		query(): Promise<Model.Page<Model.Topic>>;
		create(options: Model.Topic): Promise<Model.Topic>;
		Post: TopicPost;
	}

	interface TopicInstance {
		Post: TopicInstancePost;
		get(): Promise<Model.Post>;
		update(options: Model.Post): Promise<Model.Post>;
		delete(): Promise<Model.Post>;
	}

	interface TopicInstancePost {
		create(options: Model.Post): Promise<Model.Post>;
		query(): Promise<Model.Page<Model.Post>>;
	}

	interface TopicPost {
		(postId): TopicPostInstance;
		query(): Promise<Model.Page<Model.Post>>;
	}

	interface TopicPostInstance {
		get(): Promise<Model.Post>;
		update(options: Model.Post): Promise<Model.Post>;
		delete(): Promise<Model.Post>;
	}
}

interface Api {
	Principal: Api.Principal;
	City: Api.City;
	Customer: Api.Customer;
	Photo: Api.Photo;
	Reference: Api.Reference;
	Share: Api.Share;
	Topic: Api.Topic;
}

namespace Filter {
	export function localDatetime(any): string;
}

interface App {
	Api: Api;
	Filter: typeof Filter;
}

declare module "vue/types/vue" {
	interface Vue {
		$app: App;
	}

	interface VueConstructor {
		$app: App;
	}
}
