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
      boardChooser.on('board:choosen', function(boardId) {
        this.choosenBoard = boardId;
        me.navigate('player-chooser', {trigger: true});
      });
    },

    playerChooser: function() {
      var playerChooser = new PlayerChooser();
      app.switchView(playerChooser);
    }
  });

  return NewGameRouter;
});
