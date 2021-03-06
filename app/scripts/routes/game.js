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
  'views/win',
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
  WinView,
  BoardCollection,
  GameLogic
) {
  'use strict';

  var GameRouter = Backbone.Router.extend({
    routes: {
      'game': 'index',
      'game/test/:name': 'test'
    },

    diceResult: null,
    game: null,
    currentPlayer: null,
    gameView: null,
    diceEvents: true,
    playerFinishCount: 0,

    index: function() {
      var board = app.currentGame.board;
      this.game = GameLogic.create({
        board: board.toJSON(),
        playerCount: app.currentGame.players.length
      });
      this.gameView = new GameView({
        game: this.game,
        board: board
      });
      this.gameView.on('pawn:eat', this.goSraz, this);
      this.gameView.on('dice:throw', this.move, this);
      this.gameView.on('player:finish', this.playerFinish, this);

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

      // this.gameView.render();
      app.switchView(this.gameView);

      this.game.start();
    },

    move: function() {
      var newPlayer = this.game.getCurrentPlayerId();
      console.log(newPlayer, this.currentPlayer);
      if (newPlayer !== this.currentPlayer) {
        this.currentPlayer = newPlayer;
        this.gameView.setPlayer(this.currentPlayer);
        this.nextPlayer(this.currentPlayer);
      } else {
        this.dice(this.currentPlayer);
      }
    },

    playerFinish: function(playerId) {
      this.playerFinishCount++;
      var view;
      if (this.playerFinishCount === 1) {
        this.playerName = app.currentGame.players[playerId].name;
        view = new WinView({
          winnerName: this.playerName,
          finalWin: false
        });
      } else if (this.playerFinishCount === app.currentGame.players.length - 1) {
        view = new WinView({
          winnerName: this.playerName,
          finalWin: true
        });
      }
      if (view) {
        view.on('continue', function() {
          view.remove();
          $('.overlay').hide();
        }, this);
        $('.overlay').html(view.render().el).show();
      }
    },

    dice: function() {
      if (!this.diceEvents) {
        return;
      }
      this.diceEvents = false;
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
        me.diceEvents = true;
        me.game.throwDie(me.diceResult);
      });
      view.render();
      $('.overlay').html(view.el).show();
    },

    nextPlayer: function(playerId) {
      if (!this.diceEvents) {
        return;
      }
      this.diceEvents = false;
      var me = this;
      var view = new NextPlayerView({
        // TODO: promjeniti ovo za network game
        player: app.currentGame.players[playerId],
        local: true
      });
      view.on('game:continue', function() {
        $('.overlay').hide();
        view.remove();
        me.diceEvents = true;
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

    test: function(boardName) {
      boardName = boardName || 'standard';
      var game;
      var gameView = new TestGameView();

      var SequentialThrowGenerator = function(sequence) {
        this._sequence = sequence;
        this._index = 0;

        this.generate = function() {
          this._index += 1;
          return this._sequence[this._index - 1];
        };
      };

      app.currentGame = {
        players: [{
          name: 'Ivan'
        }, {
          name: 'Pero'
        }, {
          name: 'Luka'
        }, {
          name: 'Marko'
        }]
      };

      $('body').html(gameView.render().el);
      $.ajax('boards/' + boardName + '.json', {
        success: function(response) {
          window.throws = [6, 6, 6, 1, 6, 3];
          game = GameLogic.create({
            board: response,
            dieThrowGenerator: new SequentialThrowGenerator(window.throws),
            playerCount: app.currentGame.players.length
          });
          gameView.createBoard(response, game);
          game.start();
        }
      });
    }

  });

  return GameRouter;
});
