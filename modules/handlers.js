var fs = require('fs')

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


exports.init = function(ws) {
  return {
    connect: function(keyPath) {
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
    },
    connected: function(savePath, key) {
      fs.writeFile(savePath, key, function (err) {
        if (err)
          console.log('Error occured when trying to save connection key: ' + err);
      });
    },
    reconnect: function() {
      establishConnection(ws);
    },
    userCommand: function(message) {
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
  }
}
