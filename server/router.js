let express = require('express'),
	router = express.Router();

router.route('/')
	.get(function (req, res) {
		try {
			res.json({response: true});
		} catch (e) {
			console.log( "ERROR " + e + e.stack);
		}
	});

router.route('/api')
	.get(function (req, res) {
		try {
			res.send({test: 'SuperTest'});
		} catch (e) {
			console.log( "ERROR " + e + e.stack);
		}
	});

module.exports = router;
