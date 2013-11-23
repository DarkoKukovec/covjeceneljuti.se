/*global define*/

define([
  'lodash',
  'backbone',
  'templates'
], function (_, Backbone, JST) {
  'use strict';

  var MenuPlayerChooserView = Backbone.View.extend({
    template: JST['app/scripts/templates/menu/player-chooser.hbs'],

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  return MenuPlayerChooserView;
});
