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
      'game/board/:name': 'board',
      'game/test': 'test'
    },

    diceResult: null,
    game: null,

    index: function() {
      var board = app.currentGame.board;
      this.game = GameLogic.create({
        board: board.toJSON()
      });
      var view = new GameView({
        game: this.game,
        board: board
      });

      window.game = this.game;

      var players = [];
      for (var i = 0; i < app.currentGame.players.length; i++) {
        var name = app.currentGame.players[i];
        players.push({
          id: i,
          name: name,
          color: board.get('colors')[i].player
        });
      }
      app.currentGame.players = players;

      view.render();
      app.switchView(view);

      view.setPlayer(this.game.getCurrentPlayerId());

      this.nextPlayer(this.game.getCurrentPlayerId());
    },

    dice: function(playerId) {
      var me = this;
      var view = new DiceView({
        // TODO: promjeniti ovo za network game
        local: true,
        game: this.game
      });
      view.on('dice:result', function(result) {
        me.diceResult = result;
      });
      view.on('animation:end', function() {
        $('.overlay').hide();
        view.remove();
      });
      view.render();
      $('.overlay').html(view.el).show();
    },

    nextPlayer: function(playerId) {
      var me = this;
      var view = new NextPlayerView({
        // TODO: promjeniti ovo za network game
        player: app.currentGame.players[playerId],
        local: true
      });
      view.on('game:continue', function() {
        $('.overlay').hide();
        view.remove();
        me.dice(playerId);
      });
      view.render();
      $('.overlay').html(view.el).show();
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
      app.currentGame = {
        players: ['Ivan', 'Pero', 'Luka', 'Marko']
      };
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
