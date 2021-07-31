import Sequelize from 'sequelize';

export namespace Model {
	const
		Administrator: typeof Sequelize.Model,
		AdministratorCredential: typeof Sequelize.Model,
		AdministratorCity: typeof Sequelize.Model,

		Maintainer: typeof Sequelize.Model,
		MaintainerCredential: typeof Sequelize.Model,

		Customer: typeof Sequelize.Model,
		WechatOpenid: typeof Sequelize.Model,

		Content: typeof Sequelize.Model,

		Share: typeof Sequelize.Model,
		ShareImage: typeof Sequelize.Model,
		CustomerLikeShare: typeof Sequelize.Model,

		Reference: typeof Sequelize.Model,

		Topic: typeof Sequelize.Model,
		Post: typeof Sequelize.Model,
		PostImage: typeof Sequelize.Model,

		Banner: typeof Sequelize.Model,

		Image: typeof Sequelize.Model,
		PrizeTopic: typeof Sequelize.Model;
}
