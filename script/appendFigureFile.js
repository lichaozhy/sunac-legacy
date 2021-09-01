function normalizeFigureFile(_options) {
	const finalOptions = {
		banner: null,
		profile: {
			name: '',
			title: '',
			bornIn: '',
			category: '',
			city: '',
			field: '',
			duration: '',
		},
		photo: '',
		workList: [],
		description: '',
		referenceList: []
	};

	const {
		banner: _banner = finalOptions.banner,
		profile: _profile = finalOptions.profile,
		photo: _photo = finalOptions.photo,
		workList: _workList = finalOptions.workList,
		description: _description = finalOptions.description,
		referenceList: _referenceList = finalOptions.referenceList
	} = _options;

	if (_profile) {
		const {
			name: _name = finalOptions.profile.name,
			title: _title = finalOptions.profile.title,
			bornIn: _bornIn = finalOptions.profile.bornIn,
			category: _category = finalOptions.profile.category,
			city: _city = finalOptions.profile.city,
			field: _field = finalOptions.profile.field,
			duration: _duration = finalOptions.profile.duration
		} = _profile;

		finalOptions.profile.name = _name;
		finalOptions.profile.title = _title;
		finalOptions.profile.bornIn = _bornIn;
		finalOptions.profile.category = _category;
		finalOptions.profile.city = _city;
		finalOptions.profile.field = _field;
		finalOptions.profile.duration = _duration;
	}

	finalOptions.banner = _banner;
	finalOptions.photo = _photo;
	finalOptions.description = _description;
	finalOptions.workList = _workList.map(work => String(work));
	finalOptions.referenceList = _referenceList.map(reference => String(reference));

	return finalOptions;
}

(async function append() {
	const legacy = require('./development');

	await legacy.sequelize.sync();

	const Model = {
		Figure: legacy.sequelize.model('Figure'),
		FigureFile: legacy.sequelize.model('FigureFile')
	};

	const figureList = await Model.Figure.findAll();

	for (figure of figureList) {
		const body = normalizeFigureFile({});

		body.id = figure.id;

		await Model.FigureFile.create({
			figureId: figure.id,
			body: JSON.stringify(body)
		});
	}

	console.log('ok');
}());
