/*global define*/

define([
  'jquery',
  'backbone',
  'views/menu/main',
  'views/game/main'
], function(
  $,
  Backbone,
  MainMenuView,
  GameMainView
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
      var gameView = new GameMainView();
      $('body').html(gameView.render().el);
      $.ajax('boards/1.json', {
        success: function(response) {
          gameView.createBoard(response);
        }
      });
    }

  });

  return MenuRouter;
});