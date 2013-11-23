/*global define*/

define([
  'lodash',
  'backbone',
  'templates',
  'views/abstract/zoom'
], function (
  _,
  Backbone,
  JST,
  ZoomView
  ) {
  'use strict';

  var MenuMenuView = Backbone.View.extend({
    template: JST['app/scripts/templates/game/main.hbs'],

    render: function() {
      this.$el.html(this.template());

      // TODO: Board view
      // TODO: init zoom view
    }
  });

  return MenuMenuView;
});
