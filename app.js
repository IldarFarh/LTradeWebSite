import config from './config';
import path from 'path';
import sassMiddleware from 'node-sass-middleware'
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import express 	from 'express';
import http from 'http';

const app = express();

//mongoose connection
import './db';

//sass converting by server
app.use(sassMiddleware({
	src: path.join(__dirname, 'sass'),
	dest: path.join(__dirname, 'public'),
    outputStyle: 'compressed'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// use favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//body parser connect
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use( cookieParser());

//static main folder
app.use(express.static(path.join(__dirname, 'public')));

//main route
import index from './routes/index';
app.use('/', index);

import mongoose from 'mongoose';
var Directory = mongoose.model('Directory');

var server = http.createServer(app);
var connections = [];

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	socket.once('disconnect', function() {
		connections.splice(connections.indexOf(socket), 1);
		socket.disconnect();
		console.log("Disconnected: %s sockets remaining.", connections.length);
	});
	
	socket.on('searchBar', function(filterText) {
		Directory
		.find()
    	.populate({path: 'people',
    				match: {name: { "$regex": new RegExp(filterText, "i") } }})
    	.sort('title')
		.exec( (err,dir) => {
      if (err) return next(err);
      			socket.emit('getphonebook', {
					directoryList: dir
				});
		}
	);

	});

	Directory
		.find()
    .populate('people')
    .sort('title')
		.exec( (err,dir) => {
      if (err) return next(err);
      			socket.emit('getphonebook', {
					directoryList: dir
				});
		}
	); 

	connections.push(socket);
    console.log("Connected: %s sockets connected.", connections.length);
});

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});