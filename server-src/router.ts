import * as express from 'express';
import {modController} from "./controller/modController";
const router = express.Router();
const serverStartTime = new Date();

router.route('/')
	.get(function (req: express.Request, res: express.Response) {
		try {
			res.json({response: 'main route success'});
		} catch (e) {
			console.log( "ERROR " + e + e.stack);
		}
	});

router.route('/api')
	.get(function (req: express.Request, res: express.Response) {
		try {
			res.send({response: 'api route success'});
		} catch (e) {
			console.log( "ERROR " + e + e.stack);
		}
	});

router.route('/serverstatus')
    .get(function (req: express.Request, res: express.Response) {
        try {
            res.send({response: serverStartTime.toLocaleString()});
        } catch (e) {
            console.log( "ERROR " + e + e.stack);
        }
    });

router.route('/mods/colorup')
    .get(async function (req: express.Request, res: express.Response) {
        try {
        	const result = await modController.getColorUpMods( req.body && req.body.id);
            res.json({result});
        } catch (e) {
            console.log( "ERROR " + e + e.stack);
        }
    });

module.exports = router;
