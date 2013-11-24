/*global define*/

define([
  'app',
  'backbone',
  'views/menu/main',
  'views/help-screen',
  'views/story',
  'routes/game'
], function(
  app,
  Backbone,
  MainMenuView,
  HelpScreenView,
  StoryView,
  GameRouter
) {
  'use strict';

  var MenuRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'board': 'board',
      'the-story': 'theStory',
      'help': 'help'
    },

    routers: {},

    initialize: function() {
      this.routers.game = new GameRouter();
    },

    index: function() {
      var view = new MainMenuView();
      app.switchView(view);
    },

    theStory: function() {
      var view = new StoryView();
      app.switchView(view);
    },

    help: function() {
      var view = new HelpScreenView();
      app.switchView(view);
    }

  });

  return MenuRouter;
});
