const { Router } = require('@produck/duck-web-koa-router');

module.exports = Router(function SunacLegacyAdministrationReference(router, {
	Model, AccessControl: $ac
}) {
	router
		.use($ac('signed'))
		.get('/', async function getAllReferenceList() {

		})
		.post('/', async function createReference() {

		})
		.param('referenceId', async function fetchReference(id, ctx, next) {

		})
		.get('/:referenceId', async function getReference() {

		})
		.put('/:referenceId', async function updateReference() {

		})
		.delete('/:referenceId', async function deleteReference() {

		});
});
