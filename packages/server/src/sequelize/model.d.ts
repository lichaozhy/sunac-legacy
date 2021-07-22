import Sequelize from 'sequelize';

export namespace Model {
	const
		Administrator: typeof Sequelize.Model,
		AdministratorCredential: typeof Sequelize.Model,
		AdministratorCity: typeof Sequelize.Model,

		Maintainer: typeof Sequelize.Model,
		MaintainerCredential: typeof Sequelize.Model,

		Content: typeof Sequelize.Model,

		Share: typeof Sequelize.Model,
		ShareImage: typeof Sequelize.Model,

		Reference: typeof Sequelize.Model,
		ReferenceComment: typeof Sequelize.Model,

		Topic: typeof Sequelize.Model,
		TopicPost: typeof Sequelize.Model,
		TopicPostImage: typeof Sequelize.Model,

		Photo: typeof Sequelize.Model,

		Image: typeof Sequelize.Model;
}
