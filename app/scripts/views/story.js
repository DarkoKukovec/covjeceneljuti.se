/*global define*/

define([
  'lodash',
  'backbone',
  'templates'
], function (_, Backbone, JST) {
  'use strict';

  var StoryView = Backbone.View.extend({
    template: JST['app/scripts/templates/story.hbs'],
    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  return StoryView;
});
