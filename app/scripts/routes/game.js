/*global define*/

define([
  'jquery',
  'backbone',
  'views/game/test-game',
  'views/game/dice',
  'views/game/next-player',
  'logic/game'
], function(
  $,
  Backbone,
  TestGameView,
  DiceView,
  NextPlayerView,
  GameLogic
) {
  'use strict';

  var GameRouter = Backbone.Router.extend({
    routes: {
      'game': 'index',
      'game/dice': 'dice',
      'game/next': 'nextPlayer',
      'game/board/:name': 'board',
      'game/test': 'test'
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
    },

    test: function() {
      var game;
      var gameView = new TestGameView();
      $('body').html(gameView.render().el);
      $.ajax('boards/standard.json', {
        success: function(response) {
          game = GameLogic.create({
            board: response
          });
          gameView.createBoard(response, game);
        }
      });
    }

  });

  return GameRouter;
});