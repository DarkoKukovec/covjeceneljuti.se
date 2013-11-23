/*global define*/

define([
  'app',
  'jquery',
  'backbone',
  'views/game/main',
  'views/game/dice',
  'views/game/next-player',
  'views/game/test-game',
  'collections/boards',
  'logic/game'
], function(
  app,
  $,
  Backbone,
  GameView,
  DiceView,
  NextPlayerView,
  TestGameView,
  BoardCollection,
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

      // TODO: When everything is done, this would have a board model and it would only need to fetch it
      var boards = new BoardCollection();
      boards.fetch({
        success: function() {
          var board = boards.first();
          board.fetch({
            success: function() {
              var game = GameLogic.create({
                board: board.toJSON()
              });
              var view = new GameView({
                game: game,
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
