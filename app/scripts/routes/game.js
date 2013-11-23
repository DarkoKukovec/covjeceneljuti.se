/*global define*/

define([
  'app',
  'jquery',
  'backbone',
  'views/game/main',
  'views/game/dice',
  'views/game/next-player',
  'views/game/test-game',
  'collections/boards'
], function(
  app,
  $,
  Backbone,
  GameView,
  DiceView,
  NextPlayerView,
  TestGameView,
  BoardCollection
) {
  'use strict';

  var GameRouter = Backbone.Router.extend({
    routes: {
      'game': 'index',
      'game/dice': 'dice',
      'game/next': 'nextPlayer',
      'game/board': 'board'
    },

    index: function() {

      // TODO: When everything is done, this would have a board model and it would only need to fetch it
      var boards = new BoardCollection();
      boards.fetch({
        success: function() {
          var board = boards.first();
          board.fetch({
            success: function() {
              var view = new GameView({
                board: board
              });
              view.render();
              app.switchView(view);
            }
          });
        }
      });
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

    board: function() {
      var gameView = new TestGameView();
      $('body').html(gameView.render().el);
      $.ajax('boards/1.json', {
        success: function(response) {
          gameView.createBoard(response);
        }
      });
    }

  });

  return GameRouter;
});
