import * as express from 'express';
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

module.exports = router;
