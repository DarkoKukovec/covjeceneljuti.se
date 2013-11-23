/*global define*/

define([
  'jquery',
  'backbone',
  'views/menu/main',
  'views/game/board'
], function(
  $,
  Backbone,
  MainMenuView,
  GameBoardView
) {
  'use strict';

  var MenuRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'board': 'board'
    },

    index: function() {
      var view = new MainMenuView();
      view.render();
      $('body').html(view.el);
      console.log('first view!');
    },

    board: function() {
      var view = new GameBoardView();
      $('body').html(view.render().el);
    }

  });

  return MenuRouter;
});