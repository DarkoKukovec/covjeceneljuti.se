/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'templates'
], function($, _, Backbone) {
  'use strict';

  var GameBoardView = Backbone.View.extend({
    render: function() {
      this.$el.html('Hello');
      return this;
    }
  });

  return GameBoardView;
});