/*global define*/

define([
  'jquery',
  'backbone',
  'views/game/main',
  'views/game/dice'
], function (
  $,
  Backbone,
  GameMainView,
  DiceView
  ) {
  'use strict';

  var GameRouter = Backbone.Router.extend({
    routes: {
      'game': 'index',
      'game/dice': 'dice'
    },

    index: function() {
      var view = new GameMainView();
      view.render();
      $('body').html(view.el);
    },

    dice: function() {
      var view = new DiceView();
      view.render();
      $('body').html(view.el);
    }

  });

  return GameRouter;
});
