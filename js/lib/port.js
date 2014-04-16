define(function(require){

  var _ = require('underscore');

  Port  = {};

  Port.create = function(app) {
    _.extend(app, Port);
  };

  Port.sendMessage = function(messageID, data, targetID){
    if(!messageID){
      console.error('Port::messageID is required.');
      return;
    }
    
    var data = {
      messageID:  messageID,
      data:       data     || {},
      target:     targetID || '*'
    };

    console.log('Port::sendMessage', data.messageID);
    this.bridge.emit('message', [ data ] );
  };


  Port.onMessage = function(messageID, callback) {
    console.log('Port::added onMessage handler', messageID);
    this.on('message', function(message) {
      console.log('Port::message received.', message);
      // Cordova API returns escaped string instead of a JSON object
      // for this particular event, more info: https://www.pivotaltracker.com/story/show/60068486
      if(_.isString(message)){
        message = JSON.parse(message);
      }
      
      if(messageID === message.messageID){
        callback(message.data || {});
      }
    });
  };


  return Port;
});