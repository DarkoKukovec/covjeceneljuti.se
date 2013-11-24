/*global define*/

define([
  'lodash',
  'backbone',
  'templates'
], function (_, Backbone, JST) {
  'use strict';

  var WinView = Backbone.View.extend({
    className: 'winning-screen',
    template: JST['app/scripts/templates/win.hbs'],
    events: {
      'click .action-button': 'onButtonClick'
    },

    initialize: function(options) {
      this.options = options || {winnerName: 'Player'};
    },

    render: function() {
      this.$el.html(this.template({name: this.options.winnerName}));
      return this;
    },

    onButtonClick: function(e) {
      Backbone.trigger('navigate', $(e.target).data('action'));
    }
  });

  return WinView;
});
