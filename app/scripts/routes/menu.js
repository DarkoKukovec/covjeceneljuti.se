/*global define*/

define([
  'jquery',
  'backbone',
  'views/menu/main',
  'routes/game'
], function (
  $,
  Backbone,
  MainMenuView,
  GameRouter
  ) {
  'use strict';

  var MenuRouter = Backbone.Router.extend({
    routes: {
      '': 'index'
    },

    routers: {},

    initialize: function() {
      this.routers.game = new GameRouter();
    },

    index: function() {
      var view = new MainMenuView();
      view.render();
      $('body').html(view.el);
      console.log('first view!');
    }

  });

  return MenuRouter;
});
