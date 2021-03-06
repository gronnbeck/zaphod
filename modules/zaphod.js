var WebSocket = require('ws')
, Handlers = require('../modules/handlers')
, Connection = require('../modules/connection')

var connect = function(url, ircConfig) {
  console.log('Establishing connection to ' + url)
  var ws = new WebSocket(url)
  , handlers = Handlers.init(ws)
  , connection = Connection.init(ws, ircConfig)

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
      connection.connected(message.key)
    }
    else if (message.type == 'msg') {
      handlers.userCommand(message)
    }

  });

  ws.on('close', function() {
    console.log('ws closed. Handle reconnection.');
  });

}

exports.connect = function(url, ircConfig) {
    connect(url, ircConfig)
}
