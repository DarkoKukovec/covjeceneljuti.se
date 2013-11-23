/*global define*/

define([
  'jquery',
  'backbone',
  'views/game/dice'
], function (
  $,
  Backbone,
  DiceView
  ) {
  'use strict';

  var GameRouter = Backbone.Router.extend({
    routes: {
      // 'game': 'index',
      'game/dice': 'dice'
    },

    dice: function() {
      var view = new DiceView();
      view.render();
      $('body').html(view.el);
    }

  });

  return GameRouter;
});
