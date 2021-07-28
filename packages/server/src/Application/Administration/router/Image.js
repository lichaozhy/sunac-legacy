const { Router } = require('@produck/duck-web-koa-router');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');

function Image(data) {
	return {
		id: data.id,
		size: data.size,
		createdAt: data.createdAt
	};
}

module.exports = Router(function SunacLegacyApi(router, {
	AccessControl: $ac, Utils, Workspace, Model
}) {
	router
		.post('/', $ac('signed'), async function createImage(ctx) {
			const { image } = ctx.request.files;
			const imageFileBuffer = await fs.readFile(image.path);
			const hash = Utils.encodeSHA256(imageFileBuffer);

			const existedImage = await Model.Image.findOne({ where: { id: hash } });

			if (existedImage) {
				return ctx.body = Image(existedImage);
			}

			const pngBuffer = await sharp(imageFileBuffer).png().toBuffer();
			const storeDir = Workspace.resolve('image', hash);

			if (!await fs.pathExists(storeDir)) {
				await fs.mkdir(storeDir);
				await fs.move(image.path, path.join(storeDir, 'raw'));
				await fs.writeFile(path.join(storeDir, 'image.png'), pngBuffer);
			}

			const imageData = await Model.Image.create({
				id: hash,
				size: image.size,
				createdAt: new Date()
			});

			ctx.body = Image(imageData);
		})
		.get('/:imageId/image.png', conditional(), etag(), async function getImage(ctx) {
			const { imageId } = ctx.params;
			const image = await Model.Image.findOne({ where: { id: imageId } });

			if (!image) {
				return ctx.throw(404, 'image is not found.');
			}

			const filepath = Workspace.resolve('image', path.join(imageId, 'image.png'));

			ctx.type = 'png';
			ctx.body = fs.createReadStream(filepath);
		});
});
