const { Router } = require('@produck/duck-web-koa-router');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');

function Image(data) {
	return {
		id: data.id,
		size: data.size,
		createdAt: data.createdAt
	};
}

module.exports = Router(function SunacLegacyApi(router, {
	product, AccessControl: $ac, Utils, Workspace, Model
}) {
	router
		.use($ac('signed'))
		.post('/', async function createImage(ctx) {
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
		});
});
