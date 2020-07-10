import * as express from 'express';
import { modController } from './controller/modController';
import { IFrontColorUpMod } from './@types/IFrontEnd';
import { playerController } from './controller/playerController';
import { ILegendProgress } from './@types/IGuild';
import { discordMain } from './integration/discord/discordMain';
import { fetchDataService } from './service/fetchDataService';
const router = express.Router();
const serverStartTime = new Date();

router.route('/').get(function (req: express.Request, res: express.Response) {
	try {
		res.json({ response: 'main route success' });
	} catch (e) {
		console.error('ERROR ' + e + e.stack);
	}
});

router.route('/api').get(function (req: any, res: express.Response) {
	try {
		discordMain.sendToMaster('Route Api success');
		res.send({ response: 'api route success' });
	} catch (e) {
		console.error('ERROR ' + e + e.stack);
	}
});

router
	.route('/serverstatus')
	.get(function (req: express.Request, res: express.Response) {
		try {
			res.send({ response: serverStartTime.toLocaleString() });
		} catch (e) {
			console.error('ERROR ' + e + e.stack);
		}
	});

router
	.route('/player/colorup/:id')
	.get(async function (req: express.Request, res: express.Response) {
		try {
			const result: IFrontColorUpMod[] = await modController.getColorUpMods(
				req.params && Number(req.params.id)
			);
			res.json({ result });
		} catch (e) {
			console.error('ERROR ' + e + e.stack);
		}
	});

router
	.route('/player/check/:id')
	.get(async function (req: express.Request, res: express.Response) {
		try {
			const result: any = await playerController.check(
				req.params && Number(req.params.id)
			);

			res.json({ result });
		} catch (e) {
			console.error('ERROR ' + e + e.stack);
		}
	});

router
	.route('/guild/legendprogress/:id')
	.get(async function (req: express.Request, res: express.Response) {
		try {
			const result = await fetchDataService.getGuildPlayersCode(
				parseInt(req.params.id)
			);
			res.json({ result });
		} catch (e) {
			console.error('ERROR ' + e + e.stack);
		}
	});

router
	.route('/player/legendprogress/:id')
	.get(async function (req: express.Request, res: express.Response) {
		try {
			const result: ILegendProgress[] = await playerController.getLegendProgress(
				Number(req.params.id)
			);
			res.json({ result });
		} catch (e) {
			console.error('ERROR ' + e + e.stack);
		}
	});

module.exports = router;
