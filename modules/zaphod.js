var WebSocket = require('ws')
, Handlers = require('../modules/handlers')
, Connection = require('../modules/connection')

exports.connect = function(url, keyPath) {

  console.log('Establishing connection to ' + url)
  var ws = new WebSocket(url)
  , handlers = Handlers.init(ws)
  , config = {
    keyPath: keyPath,
    connection: {
      server: 'irc.freenode.net',
      nick: 'nplol-zaphod',
      channels: ['#pekkabot']
    },
    raw: true
  }
  , connection = Connection.init(ws, config)

  ws.on('open', function() {
    console.log('[ws] ws discovered');
    connection.connect()
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

}
