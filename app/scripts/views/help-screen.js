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

  var HelpScreenView = Backbone.View.extend({
    template: JST['app/scripts/templates/help-screen.hbs'],
    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  return HelpScreenView;
});
