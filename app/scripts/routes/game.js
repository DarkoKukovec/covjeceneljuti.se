/*global define*/

define([
  'jquery',
  'backbone',
  'views/game/test-game',
  'views/game/dice',
  'views/game/next-player'
], function(
  $,
  Backbone,
  TestGameView,
  DiceView,
  NextPlayerView
) {
  'use strict';

  var GameRouter = Backbone.Router.extend({
    routes: {
      'game': 'index',
      'game/dice': 'dice',
      'game/next': 'nextPlayer',
      'game/board/:name': 'board'
    },

    index: function() {
      var view = new TestGameView();
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
    },

    board: function(name) {
      var gameView = new TestGameView();
      $('body').html(gameView.render().el);
      $.ajax('boards/' + name + '.json', {
        success: function(response) {
          gameView.createBoard(response);
        }
      });
    }

  });

  return GameRouter;
});