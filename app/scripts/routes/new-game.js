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
      'new-game': 'main'
    },

    main: function() {
      //first show board chooser
      var boardChooser = new BoardChooser();
      boardChooser.render();
      $('#main').html(boardChooser.el);
    }
  });

  return NewGameRouter;
});
