var vm = require('vm')
, Q = require('q')
, _ = require('underscore')

exports = VirtualScript

function VirtualScript(trigger, execute) {
  this.triggerScript = vm.createScript(trigger)
  this.executeScript = vm.createScript(execute)
}

VirtualScript.prototype.run = function(script, ctx) {
  var deferred = Q.defer()
  var context = _.extend({
    result: function(res) {
      deferred.resolve(res)
    }
  }, ctx)
  script.runInNewContext(context)
  return deferred.promise
}

VirtualScript.prototype.trigger = function(message) {
  return this.run(this.triggerScript, { message: message })
}

VirtualScript.prototype.execute = function(message) {
  return this.run(this.executeScript, { message: message })
}
