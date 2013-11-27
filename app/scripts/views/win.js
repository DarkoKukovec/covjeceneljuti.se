/*global define*/

define([
  'lodash',
  'backbone',
  'templates'
], function (_, Backbone, JST) {
  'use strict';

  var WinView = Backbone.View.extend({
    className: 'winning-screen',
    templateFinalWin: JST['app/scripts/templates/final-win.hbs'],
    templateWin: JST['app/scripts/templates/win.hbs'],

    events: {
      'click .action-button': 'onButtonClick'
    },

    initialize: function(options) {
      this.options = options || {
        winnerName: 'Player',
        finalWin: false
      };
    },

    render: function() {
      var template = this.templateWin;
      if (this.options.finalWin) {
        template = this.templateFinalWin;
      }
      this.$el.html(template({name: this.options.winnerName}));
      return this;
    },

    onButtonClick: function(e) {
      var action = $(e.target).data('action');
      if (action === 'continue-game') {
        this.trigger('continue');
      } else {
        Backbone.trigger('navigate', action);
      }
    }
  });

  return WinView;
});
