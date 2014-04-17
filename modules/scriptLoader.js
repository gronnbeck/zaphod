var fs = require('fs')
, _ = require('underscore')
, Q = require('q')

var isJavascript = function(file) {
  return file.indexOf('.js') != -1
}

var scriptFiles = function (dir) {
  var deferred = Q.defer()
  fs.readdir(dir, function(err, files) {
    if (err) {
      deferred.reject(err)
    }

    var filtered = _.filter(files, function(file) {
      return isJavascript(file)
    })
    deferred.resolve(filtered)
  })
  return deferred.promise
}

var loadLocalScripts = function() {
  var dir = 'scripts'
  return scriptFiles(dir).then(function(files) {
      return _.map(files, function(file) {
          return require('../' + dir + '/' + file)
      })
  })

}

exports.loadConfig = function(filename) {
  var deferred = Q.defer()
  fs.exists(filename, function(exists) {
    if (exists) {
      fs.readFile(filename, function(err, data) {
          deferred.resolve(JSON.parse(data))
      })
    }
    else {
      deferred.resolve({})
    }
  })
  return deferred.promise
}

exports.writeConfig = function(filename, config, success) {
  var data = JSON.stringify(config)
  fs.writeFile(filename, data, function(err) {
    success()
  })
}


exports.load = function() {
  return loadLocalScripts()
}
