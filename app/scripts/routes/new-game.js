/*global define*/

define([
  'app',
  'backbone',
  'views/menu/board-chooser',
  'views/menu/player-chooser'
], function (
  app,
  Backbone,
  BoardChooser,
  PlayerChooser
  ) {
  'use strict';

  var NewGameRouter = Backbone.Router.extend({
    routes: {
      'new-game': 'main',
      'player-chooser': 'playerChooser'
    },

    main: function() {
      //first show board chooser
      var me = this;
      var boardChooser = new BoardChooser();
      app.switchView(boardChooser);
      boardChooser.on('board:choosen', function(board) {
        me.choosenBoard = board;
        me.navigate('player-chooser', {trigger: true});
      });
    },

    playerChooser: function() {
      var me = this;
      this.choosenBoard.fetch().done(function(r) {
        var playerNumber = r.homes.length;
        var playerChooser = new PlayerChooser({playerNum: playerNumber});
        app.switchView(playerChooser);
        playerChooser.on('game:start', function(playerData) {
          app.currentGame = {
            board: me.choosenBoard,
            players: playerData
          };
          me.navigate('game-start', {trigger: true});
        });
      });
    }
  });

  return NewGameRouter;
});
