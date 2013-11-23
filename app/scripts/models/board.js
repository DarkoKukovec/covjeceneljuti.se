/*global define*/

define([
  'backbone'
],

function(Backbone) {
  'use strict';
  var Board = Backbone.Model.extend({
    url: function() {
      return 'boards/' + this.get('id') + '.json';
    }
  });

  return Board;
});