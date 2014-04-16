/*global app:false*/
define(function(require) {

    var 
      _                     = require('underscore'),
      NativeBridgeCordova   = require('plugins/App.NativeBridgeCordova'),
      BB                    = require('lib/backbone');

    var instance;

    var CORDOVA_PATH = 'js/lib/cordova-2.3.0.js';

    var CordovaHub = function() {
      console.log('CordovaHub::initialize');

      _.bindAll(this);

      // Create App namespace / event hub
      window.app = {
        bridge: new NativeBridgeCordova()
      };
      
      window.app = _.extend(window.app, Backbone.Events);
      
      // Make API EventEmitter compatible
      app.emit = app.trigger;

      this.linkCordova();
    };

    CordovaHub.prototype.getPostParams = function(){
      var match,
          pl     = /\+/g,  // Regex for replacing addition symbol with a space
          search = /([^&=]+)=?([^&]*)/g,
          decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
          query  = window.location.search.substring(1);

      urlParams = {};
      while (match = search.exec(query)){
        urlParams[decode(match[1])] = decode(match[2]);
      }

      // Trim trailing slashes
      _.each(_.keys(urlParams), function(key){
        var value = urlParams[key];
        if(value.charAt(value.length - 1) === '/'){
          urlParams[key] = value.substr(0, value.length - 1);
        }
      });


      return urlParams;
    };

    CordovaHub.prototype.linkCordova = function() {
      setTimeout(function(){
        require([CORDOVA_PATH]);
      }, 1000);
    };

    return (function(){
      return (instance = (instance || new CordovaHub))
    })();
});