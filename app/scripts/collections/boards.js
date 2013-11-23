/*global define*/

define([
  'backbone',
  'models/board'
],

function(
  Backbone,
  BoardModel
) {
  'use strict';
  var Boards = Backbone.Collection.extend({
    model: BoardModel,
    url: 'boards/list.json'
  });

  return Boards;
});