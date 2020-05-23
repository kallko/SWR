import * as express from 'express';
import { modController } from './controller/modController';
import { guildController } from './controller/guildController';
import { IFrontColorUpMod } from './@types/IFrontEnd';
import { playerController } from './controller/playerController';
import { ILegendProgress } from './@types/IGuild';
const router = express.Router();
const serverStartTime = new Date();

router.route('/').get(function (req: express.Request, res: express.Response) {
	try {
		res.json({ response: 'main route success' });
	} catch (e) {
		console.log('ERROR ' + e + e.stack);
	}
});

router
	.route('/api')
	.get(function (req: express.Request, res: express.Response) {
		try {
			res.send({ response: 'api route success' });
		} catch (e) {
			console.log('ERROR ' + e + e.stack);
		}
	});

router
	.route('/serverstatus')
	.get(function (req: express.Request, res: express.Response) {
		try {
			res.send({ response: serverStartTime.toLocaleString() });
		} catch (e) {
			console.log('ERROR ' + e + e.stack);
		}
	});

router
	.route('/player/colorup/:id')
	.get(async function (req: express.Request, res: express.Response) {
		try {
			console.log('Receive req for id ', req.params.id);
			const result: IFrontColorUpMod[] = await modController.getColorUpMods(
				req.params && req.params.id.toString()
			);

			console.log('Send to front ', result);

			res.json({ result });
		} catch (e) {
			console.log('ERROR ' + e + e.stack);
		}
	});

router
	.route('/player/check/:id')
	.get(async function (req: express.Request, res: express.Response) {
		try {
			console.log('Receive req for id ', req.params.id);
			const result: any = await playerController.check(
				req.params && req.params.id.toString()
			);

			console.log('Send to front ', result);

			res.json({ result });
		} catch (e) {
			console.log('ERROR ' + e + e.stack);
		}
	});

router
	.route('/guild/legendprogress')
	.get(async function (req: express.Request, res: express.Response) {
		try {
			console.log('Receive REQ');
			const result = await guildController.getLegendProgress();
			res.json({ result });
		} catch (e) {
			console.log('ERROR ' + e + e.stack);
		}
	});

router
	.route('/player/legendprogress/:id')
	.get(async function (req: express.Request, res: express.Response) {
		try {
			console.log('Receive REQ with id ', req.params.id);
			const result: ILegendProgress[] = await playerController.getLegendProgress(
				req.params.id
			);
			res.json({ result });
		} catch (e) {
			console.log('ERROR ' + e + e.stack);
		}
	});

router
	.route('/guild/brazzers')
	.get(async function (req: express.Request, res: express.Response) {
		try {
			const result = guildController.getGuild();
			res.json({ result });
		} catch (e) {
			console.log('ERROR ' + e + e.stack);
		}
	});

module.exports = router;
