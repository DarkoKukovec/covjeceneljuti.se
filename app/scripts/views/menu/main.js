/*global define*/

define([
  'lodash',
  'backbone',
  'templates'
], function (_, Backbone, JST) {
  'use strict';

  var MenuMenuView = Backbone.View.extend({
    template: JST['app/scripts/templates/menu/main.hbs'],

    render: function() {
      this.$el.html(this.template());
    }
  });

  return MenuMenuView;
});
