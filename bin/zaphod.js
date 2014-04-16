#!/usr/local/bin/node

var WebSocket = require('ws')
	, _ = require('underscore')
	, argv = process.argv
	, parseConfig = require('../modules/parse-config')
  , defaults = {
		url: 'ws://localhost',
		port: 8080
	}
 , config = _.defaults(parseConfig.parse(argv), defaults)
 , keyPath = 'zaphod.key'

console.log('Starting bot with config: ')
console.log(JSON.stringify(config, null, 4))

var url = config.url + ':' + config.port
console.log('Establishing connection to ' + url)
var ws = new WebSocket(url);

var Handlers = require('../modules/handlers'),
 handlers = Handlers.init(ws)

ws.on('open', function() {
	console.log('[ws] ws discovered');
	handlers.connect(keyPath)
});

ws.on('message', function(data) {
	console.log(data);
	var message = JSON.parse(data);

	if (message.success == false && message.type == 'disconnected') {
		handlers.reconnect()
	}

	else if (message.type == 'connected') {
		handlers.connected(keyPath, message.key)
	}
	else if (message.type == 'msg') {
		handlers.userCommand(message)
	}

});

ws.on('close', function() {
	console.log('ws closed. Handle reconnection.');
});
