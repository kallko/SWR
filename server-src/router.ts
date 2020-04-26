import * as express from 'express';
const router = express.Router();

router.route('/')
	.get(function (req: express.Request, res: express.Response) {
		try {
			res.json({response: true});
		} catch (e) {
			console.log( "ERROR " + e + e.stack);
		}
	});

router.route('/api')
	.get(function (req: express.Request, res: express.Response) {
		try {
			res.send({test: 'SuperTest'});
		} catch (e) {
			console.log( "ERROR " + e + e.stack);
		}
	});

module.exports = router;
