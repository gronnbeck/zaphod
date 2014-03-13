var Nano = require('nano')
, Q = require('q')
, _ = require('underscore')

function Channel(obj) {
  this.network = obj.network
  this.channel = obj.channel
  this.from = obj.from
  this.ts = obj.ts
  this.log = obj.log
  return this
}

Channel.prototype.merge = function(chan, message) {
  if (_.isEmpty(chan.log)) {
    return _.extend(chan, { log: [message] })
  } else {
    return _.extend(chan, { log: _.flatten([ chan.log, message ])})
  }
}

var channelModel = function(db, nano) {
  return function(network, chan) {
    var id = network + "_" + chan
    var channel = nano.db.use(db)

    function insert(chanObj) {
      var deferred = Q.defer()
      var obj = new Channel(chanObj)
      var update = _.extend(obj, { _rev: chanObj._rev })
      channel.insert(update
      , id
      , function(err, body) {
          if (err) deferred.reject(new Error(err))
          else deferred.resolve(body)
      })
      return deferred.promise
    }

    return {
      insert: function(message) {
        return this.get(id)
        .then(function(chan) {
            return Channel.prototype.merge(chan, message)
        })
        .then(function(chan) {
            return insert(chan)
        })
      },
      get: function(id) {
        var deferred = Q.defer()
        channel.get(id, function(err, body) {
          deferred.resolve(body)
        })
        return deferred.promise
      }
    }
  }
}

exports.init = function(conf) {
  var defaults = { url: 'http://127.0.0.1:5984/' }
  , config = _.defaults(conf || {}, defaults)
  , nano = Nano(config)

  return {
    createdb: function(name) {
      var deferred = Q.defer()
      nano.db.create(name, function(err, body) {
        if (err) {
          deferred.reject(new Error('Database already exists'))
        } else {
          deferred.resolve('Database {name} created'.replace('{name}', name))
        }
      })
      return deferred.promise
    },
    getdb: function(name) {
      var deferred = Q.defer()
      nano.db.get(name, function(error, body) {
        if (error) deferred.reject(new Error(error))
        else deferred.resolve({
          channel: channelModel(name, nano)
        })
      })
      return deferred.promise
    },
  }
}