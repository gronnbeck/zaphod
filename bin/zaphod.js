#!/usr/local/bin/node

var WebSocket = require('ws')
	, fs = require('fs')
	, _ = require('underscore')
	, argv = process.argv
	, parseConfig = require('../modules/parse-config')
  , defaults = {
		url: 'ws://localhost',
		port: 8080
	}
 , config = _.defaults(parseConfig.parse(argv), defaults)
 , keyPath = 'zaphod.key'


var establishConnection = function(ws) {
	ws.send( JSON.stringify({
		type: 'connect',
		connection: {
			server: 'irc.freenode.net',
			nick: 'nplol-zaphod',
			channels: ['#pekkabot']
		},
		raw: true
	}));
}

console.log('Starting bot with config: ')
console.log(JSON.stringify(config, null, 4))

var url = config.url + ':' + config.port
console.log('Establishing connection to ' + url)
var ws = new WebSocket(url);

ws.on('open', function() {
	console.log('[ws] ws discovered');

	// look for saved connection key
	fs.readFile(keyPath, function(err, data) {
		// establish new connection if no key is found
		if (err) {
			establishConnection(ws);
			return;
		}

		// try to ro reconnect using the saved key
		var key = data.toString();
		ws.send( JSON.stringify({
			type: 'reconnect',
			key: key
		}));
	});
});

ws.on('message', function(data) {
	console.log(data);
	var message = JSON.parse(data);
	// establish new connection if it did not exist
	if (message.success == false && message.type == 'disconnected') {
		establishConnection(ws);
	}

	else if (message.type == 'connected') {
		fs.writeFile(keyPath, message.key, function (err) {
			if (err)
			console.log('Error occured when trying to save connection key: ' + err);
		});
	}
	else if (message.type == 'msg') {
		if (message.from == 'nplol-bot-marvin') {
			ws.send(JSON.stringify({
				key: message.key,
				type: 'msg',
				to: message.to,
				payload: 'Please ignore Marvin. He is depressed.'
			}));
		}
		else if (message.from == 'kengr') {
			if (message.payload.indexOf('!nick') == 0) {
				var args = message.payload.split(' ')
				if (args.length > 1) {
					ws.send(JSON.stringify({
						key: message.key,
						type: 'raw',
						cmd: ['NICK', args[1]]
					}))
				}
			}
		}
	}
});

ws.on('close', function() {
	console.log('ws closed. Handle reconnection.');
});
