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

  var NextPlayerView = Backbone.View.extend({
    template: JST['app/scripts/templates/game/next-player.hbs'],

    localPlayer: true,

    events: {
      'touchend .next-button': 'onButtonTap'
    },

    initialize: function(options) {
      this.listenTo(Backbone, 'player:continue', this.onPlayerContinue, this);
      this.localPlayer = options.local;
    },

    render: function() {
      this.$el.html(this.template());
      if (this.localPlayer) {
        this.$('.next-waiting').hide();
      } else {
        this.$('.next-button').hide();
      }
    },

    onButtonTap: function() {
      // Logika kod pritiska na button
      this.continueGame();
    },

    onPlayerContinue: function() {
      // Logika kod remote nastavka
      this.continueGame();
    },

    continueGame: function() {
      this.trigger('game:continue');
      this.remove();
    }
  });

  return NextPlayerView;
});
