const express = require('express');
const app = express();
const cors = require("cors");
const server = require('http').Server(app);

app.use(express.static(__dirname + '/public'));
const router = require('./router');
const port = 1976;

app.use(cors());
app.use('/', router);
server.listen(port);
console.log('ENV = ', process.env.NODE_ENV);
console.info('Listening on port ' + (port) + '...\n');
