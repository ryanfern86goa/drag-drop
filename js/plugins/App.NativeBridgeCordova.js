/*global app: false cordoba: false */
define([
  'underscore'
  // + implicit dependency on Cordoba
  ],
  function(_) {

    var CordobaNativeBridge = function() {};

    CordobaNativeBridge.prototype.init = function() {
      if (! window.cordova) {
        document.write('<p>Cannot initialise app. Missing Cordova.');
      }
      document.addEventListener("deviceready", _.bind(this.deviceReady, this), false);
      document.addEventListener("pause", _.bind(this.pause, this), false);
      document.addEventListener("resume", _.bind(this.resume, this), false);
    };
    
    CordobaNativeBridge.prototype.emit = function(eventType, eventArguments, cb, eb, service) {
      eventArguments = eventArguments || [];

      // success callback, error callback, service, action, arguments
      // http://docs.phonegap.com/en/2.2.0/guide_plugin-development_index.md.html
      cordova.exec(
        cb || function(winParam) {},
        eb || function(error) {},
        service || "PublicationHelper",
        eventType,
        eventArguments
      );
      
    };

    CordobaNativeBridge.prototype.pause = function() {
      app.emit("pause");
    };

    CordobaNativeBridge.prototype.resume = function() {
      app.emit("resume");
    };

    CordobaNativeBridge.prototype.deviceReady = function() {
      app.emit("bridgeready");
    };

    return CordobaNativeBridge;
  
});