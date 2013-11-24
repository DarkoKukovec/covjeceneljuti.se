/*global define*/

define([
  'app',
  'jquery',
  'backbone',
  'views/game/main',
  'views/game/dice',
  'views/game/next-player',
  'views/game/test-game',
  'views/game/sraz',
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
  SrazView,
  BoardCollection,
  GameLogic
) {
  'use strict';

  var GameRouter = Backbone.Router.extend({
    routes: {
      'game': 'index',
      'game/board/:name': 'board',
      'game/test/:name': 'test'
    },

    diceResult: null,
    game: null,
    currentPlayer: null,
    gameView: null,

    index: function() {
      var board = app.currentGame.board;
      this.game = GameLogic.create({
        board: board.toJSON()
      });
      this.gameView = new GameView({
        game: this.game,
        board: board
      });
      this.gameView.on('pawn:eat', this.goSraz, this);

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

      this.gameView.render();
      app.switchView(this.gameView);

      this.move();
    },

    move: function() {
      var newPlayer = this.game.getCurrentPlayerId();
      if (newPlayer !== this.currentPlayer) {
        this.currentPlayer = newPlayer;
        this.gameView.setPlayer(this.currentPlayer);
        this.nextPlayer(this.currentPlayer);
      } else {
        this.dice(this.currentPlayer);
      }
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

    goSraz: function(callback, scope) {
      var view = new SrazView();
      view.render();
      $('.overlay').html(view.el).show();
      view.on('answer', function(correct) {
        $('.overlay').hide();
        view.remove();
        callback.call(scope, correct);
      });
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

    test: function(boardName) {
      boardName = boardName || 'standard';
      var game;
      var gameView = new TestGameView();

      // var SequentialThrowGenerator = function(sequence) {
      //   this._sequence = sequence;
      //   this._index = 0;

      //   this.generate = function() {
      //     this._index += 1;
      //     return this._sequence[this._index - 1];
      //   };
      // };

      app.currentGame = {
        players: ['Ivan', 'Pero', 'Luka', 'Marko']
      };

      $('body').html(gameView.render().el);
      $.ajax('boards/' + boardName + '.json', {
        success: function(response) {
          // window.throws = [6, 6, 6, 1, 6, 3];
          game = GameLogic.create({
            board: response
            // dieThrowGenerator: new SequentialThrowGenerator(window.throws)
          });
          gameView.createBoard(response, game);
        }
      });
    }

  });

  return GameRouter;
});