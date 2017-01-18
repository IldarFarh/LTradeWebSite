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

import soap from 'soap';

  var url = 'http://192.168.0.7/WebCab/ws/wsWebCab.1cws?wsdl';
  var args = {'xsd1:script': 'Hello123 World'};
  soap.createClient(url, function(err, client) {
  	
    client.wsdl.definitions.xmlns.soap12bind="http://schemas.xmlsoap.org/wsdl/soap12/";
    client.wsdl.definitions.xmlns.soapbind="http://schemas.xmlsoap.org/wsdl/soap/";
    client.wsdl.definitions.xmlns.tns="http://localhost/WebCab";
    client.wsdl.definitions.xmlns.wsp="http://schemas.xmlsoap.org/ws/2004/09/policy";
    client.wsdl.definitions.xmlns.wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd";
    client.wsdl.definitions.xmlns.xsd="http://www.w3.org/2001/XMLSchema";
    client.wsdl.definitions.xmlns.xsd1="http://localhost/WebCab";
    client.wsdl.definitions.xmlns.xsi="http://www.w3.org/2001/XMLSchema-instance";

     if (err) console.log(err);
      client.HelloWorld(args, function(err, result) {
      	//if (err) console.log(err);
          console.log(result);
      });
  });

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});