#!/usr/local/bin/node

var WebSocket = require('ws')
 , fs = require('fs');

var config = {
	url: 'ws://localhost',
	port: 8080
};

var establishConnection = function(ws) {
	ws.send( JSON.stringify({ 
		type: 'connect', 
		connection: {
			server: 'irc.freenode.net', 
			nick: 'nplol-magrathea', 
			channels: ['#nplol', '#pekkabot'] 
		}
	}));
}

var ws = new WebSocket(config.url + ':' + config.port);

ws.on('open', function() {
	console.log('[ws] ws discovered');

	// look for saved connection key
	fs.readFile('magrathea.key', function(err, data) {
		// establish new connection if no key is found
		if (err) {
			establishConnection(ws);		
			return;
		} 

		// try to ro reconnect using the saved key
		var key = data.toString();
		console.log(key);
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
});

ws.on('close', function() {
	console.log('ws closed. Handle reconnection.');
});