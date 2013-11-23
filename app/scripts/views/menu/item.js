/*global define*/

define([
  'lodash',
  'backbone',
  'templates'
], function (
  _,
  Backbone,
  JST
  ) {
  'use strict';

  var MenuItemView = Backbone.View.extend({
    template: JST['app/scripts/templates/menu/item.hbs'],

    events: {
      'click': 'onClick'
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    onClick: function() {
      this.trigger('click', this.model);
    }
  });

  return MenuItemView;
});
