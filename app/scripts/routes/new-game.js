/*global define*/

define([
  'backbone',
  'views/menu/board-chooser'
], function (
  Backbone,
  BoardChooser
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
      boardChooser.render();
      $('#main').html(boardChooser.el);
      boardChooser.on('board:choosen', function(boardId) {
        this.choosenBoard = boardId;
        me.navigate('player-chooser', {trigger: true});
      });
    },

    playerChooser: function() {

    }
  });

  return NewGameRouter;
});
