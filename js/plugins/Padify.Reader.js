/*global app:false*/
define([
  'underscore',
  'plugins/App.NativeBridgeCordova',
  'lib/CordovaHub',
  'text!plugins/homeButton.tpl'

  ],
  function(_, NativeBridgeCordova, CordovaHub, HomeButtonTemplate) {

    var CSS_PATH = 'css/padify-reader.css';
    var CORDOVA_PATH = 'js/lib/cordova-2.3.0.js';

    var PadifyReader = function() {
      _.bindAll(this);
      this.onCordovaHubReady();
    };

    PadifyReader.params = {};


    PadifyReader.prototype.onCordovaHubReady = function(){
      PadifyReader.params = _.defaults(CordovaHub.getPostParams(), {
        publicationGroupTitle: 'Back'
      });


      this.linkCSS();
      this.addHomeButton();
      this.bindEvents();
    }

    PadifyReader.prototype.linkCSS = function() {
      $(document.head).append('<link rel="stylesheet" href="' + CSS_PATH + '" />');
    };

    PadifyReader.prototype.addHomeButton = function() {
      /*jshint multistr:true */

      var $homeBtn = $(HomeButtonTemplate);
      $homeBtn
        .find('.app-nav__publication-group')
        .text(PadifyReader.params.publicationGroupTitle);

      $('.book-drawer-content').prepend($homeBtn);
    };

    PadifyReader.prototype.bindEvents = function() {
      var $homeBtn = $('.app-nav__home-btn');
      $homeBtn.hammer().on('tap', this.navigateHome);
    };

    PadifyReader.prototype.navigateHome = function() {
      event.preventDefault();
      event.stopImmediatePropagation();
      app.bridge.emit('publicationListView');
    };

    $('html').addClass('has-padify-reader');


    return PadifyReader;
});