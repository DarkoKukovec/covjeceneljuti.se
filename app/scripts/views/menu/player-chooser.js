/*global define*/

define([
  'lodash',
  'backbone',
  'templates'
], function (_, Backbone, JST) {
  'use strict';

  var MenuPlayerChooserView = Backbone.View.extend({
    className: 'player-chooser',
    template: JST['app/scripts/templates/menu/player-chooser.hbs'],
    newPlayerInputTemplate: JST['app/scripts/templates/menu/new-player-input.hbs'],
    events: {
      'change .player-number select': 'onPlayerNumberChange',
      'click .start-game-btn': 'onStartGameClick'
    },

    initialize: function(options) {
      this.options = options;
    },

    render: function() {
      var data = {
        playerNum: this.options.playerNum
      };
      this.$el.html(this.template(data));
      this.currentPlayerNumber = 0;
      this.onPlayerNumberChange();
      return this;
    },

    getPlayerNumber: function() {
      return this.$('.player-number select').val() ;
    },

    onPlayerNumberChange: function() {
      var number = parseInt(this.getPlayerNumber(), 10);
      var change = number - this.currentPlayerNumber;

      if (change > 0) {
        //add items
        for (var i = 0; i < change; i++) {
          this.$('.player-input-fields').append(this.newPlayerInputTemplate({num: this.currentPlayerNumber+i+1}));
        }
      } else if (change < 0) {
        //remove items
        this.$('.player-input:gt('+ (this.currentPlayerNumber + change - 1) +')').remove();
      }
      this.$('.player-number-inner').text('Players:' + number);
      this.currentPlayerNumber = number;
    },

    getPlayerData: function() {
      var data = [];
      this.$('.player-name').each(function() {
        data.push($(this).val());
      });
      return data;
    },

    onStartGameClick: function() {
      this.trigger('game:start', this.getPlayerData());
    }


  });

  return MenuPlayerChooserView;
});