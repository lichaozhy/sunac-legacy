module.exports = {
	Api: require('./Api'),
	Principal: require('./Principal'),
	Administrator: require('./Principal/Administrator'),

	Customer: require('./Principal/Customer'),

	City: require('./City'),

	Reference: require('./City/Reference'),
	Photo: require('./City/Photo'),
	Topic: require('./City/Topic'),
	Share: require('./City/Share'),
	Comment: require('./City/Comment'),
	Post: require('./City/Post'),
};
