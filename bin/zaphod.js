#!/usr/local/bin/node

var WebSocket = require('ws')
	, _ = require('underscore')
	, GetOpt = require('node-getopt')
	, getopt = new GetOpt([
			['p', 'port='],
			['u', 'url=']
		])
	, argv = process.argv
	, opt = getopt.parse(argv)
  , defaults = {
		url: 'ws://localhost',
		port: 8080
	}
 , config = _.defaults(opt.options, defaults)
 , keyPath = 'zaphod.key'

console.log('Starting bot with config: ')
console.log(JSON.stringify(config, null, 4))

var url = config.url + ':' + config.port
console.log('Establishing connection to ' + url)
var ws = new WebSocket(url);

var Handlers = require('../modules/handlers')
 , Connection = require('../modules/connection')
 , handlers = Handlers.init(ws)
 , connection = Connection.init(ws)


ws.on('open', function() {
	console.log('[ws] ws discovered');
	connection.connect(keyPath)
});

ws.on('message', function(data) {
	var message = JSON.parse(data);

	if (message.success == false && message.type == 'disconnected') {
		connection.reconnect()
	}

	else if (message.type == 'connected') {
		connection.connected(keyPath, message.key)
	}
	else if (message.type == 'msg') {
		handlers.userCommand(message)
	}

});

ws.on('close', function() {
	console.log('ws closed. Handle reconnection.');
});
