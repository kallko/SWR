import * as express from 'express';
import { discordMain } from './integration/discord/discordMain';
const app = express();
const cors = require('cors');
const server = require('http').Server(app);

app.use(express.static(__dirname + '/public'));
const router = require('./router');
const port = 1976;

app.use(cors());
app.use('/', discordMain.logger);
app.use('/', router);
server.listen(port);
console.info('Listening on port ' + port + '...\n');
