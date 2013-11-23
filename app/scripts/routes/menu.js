/*global define*/

define([
  'jquery',
  'backbone',
  'views/menu/main'
], function (
  $,
  Backbone,
  MainMenuView
  ) {
  'use strict';

  var MenuRouter = Backbone.Router.extend({
    routes: {
      '': 'index'
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
