import Sequelize from 'sequelize';

export namespace Model {
	const
		Administrator: typeof Sequelize.Model,
		AdministratorCredential: typeof Sequelize.Model,
		AdministratorCity: typeof Sequelize.Model,

		Maintainer: typeof Sequelize.Model,
		MaintainerCredential: typeof Sequelize.Model,

		Customer: typeof Sequelize.Model,
		Content: typeof Sequelize.Model,
		Reference: typeof Sequelize.Model,
		Topic: typeof Sequelize.Model,
		Share: typeof Sequelize.Model,
		Comment: typeof Sequelize.Model,
		Photo: typeof Sequelize.Model,
		Post: typeof Sequelize.Model,
		WechatOpenid: typeof Sequelize.Model;
}
