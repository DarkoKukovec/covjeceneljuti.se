/*global define*/

define([
  'app',
  'backbone',
  'views/menu/main',
  'routes/game'
], function (
  app,
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
      var me = this;
      var view = new MainMenuView();
      app.switchView(view);
      view.on('navigate', function(route) {
        me.navigate(route, {trigger: true});
      });
    }

  });

  return MenuRouter;
});
