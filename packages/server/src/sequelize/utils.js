const BASIC_OPTIONS = {
	foreignKeyConstraint: false,
	constraints: false
};

exports.FK = function ForeignKeyOptions(foreignKey, other = {}) {
	return Object.assign({ foreignKey }, other, BASIC_OPTIONS);
};
