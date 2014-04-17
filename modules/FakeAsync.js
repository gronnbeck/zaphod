var Q = require('q')

module.exports = function(result) {
  var deferred = Q.defer()
  deferred.resolve(result)
  return deferred.promise
}
