/*global define*/

define([
  'jquery',
  'backbone',
  'views/game/main',
  'views/game/dice',
  'views/game/next-player'
], function (
  $,
  Backbone,
  GameMainView,
  DiceView,
  NextPlayerView
  ) {
  'use strict';

  var GameRouter = Backbone.Router.extend({
    routes: {
      'game': 'index',
      'game/dice': 'dice',
      'game/next': 'nextPlayer'
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
    },

    nextPlayer: function() {
      var view = new NextPlayerView();
      view.render();
      $('body').html(view.el);
    }

  });

  return GameRouter;
});
