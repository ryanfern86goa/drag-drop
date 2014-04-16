define(function(require){
  var _ = require('underscore');

  var Store = function(namespace){
    _.bindAll(this);

    this.namespace = namespace || 'book:store:default';
  };


  Store.prototype.getAll = function(){
    return JSON.parse(localStorage.getItem(this.namespace) || null) || {};
  };

  Store.prototype.save = function(data){
    localStorage[this.namespace] = JSON.stringify(data);
  };

  Store.prototype.set = function(key, value){
    var items = this.getAll();
    items[key] = value;
    this.save(items);
  }

  Store.prototype.clear = function(){
    localStorage.removeItem(this.namespace); 
  }

  Store.prototype.get = function(key) {
    return this.getAll()[key];
  };

  return Store;
});