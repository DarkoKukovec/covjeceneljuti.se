/*global define*/

define([
  'jquery',
  'lodash',
  'backbone',
], function($, _, Backbone) {
  'use strict';

  var GamePointView = Backbone.View.extend({
    className: 'point',
    events: {
      'click': 'onClick'
    },
    currPlayer: -1,
    currPawn: -1,
    lastPlayer: -1,
    lastPawn: -1,

    initialize: function(options) {
      options = options || {};
      this.board = options.board;
      this.position = options.point;
      this.pointId = parseInt(options.pointId, 10);
      this.baseWidth = parseInt(this.board.style.point.width, 10);
      this.baseHeight = parseInt(this.board.style.point.height, 10);
      this.baseTop = parseInt(this.position.top, 10);
      this.baseLeft = parseInt(this.position.left, 10);
      this.pawnInc = 2;

      this.$el.css({
        left: this.position.left,
        top: this.position.top
      });

      for (var i = 0; i < this.board.paths.length; i++) {
        var path = this.board.paths[i];
        var home = this.board.homes[i];
        var pathFirst = path[0];
        var pathLasts = path.slice(path.length - 4, path.length);

        if (pathFirst === this.pointId) {
          this.type = 'start';
          this.player = i;
          this.$el.addClass('point-first');
          break;
        } else if (pathLasts.indexOf(this.pointId) !== -1) {
          this.type = 'end';
          this.player = i;
          this.$el.addClass('point-end');
          break;
        } else if (home.indexOf(this.pointId) !== -1) {
          this.type = 'home';
          this.player = i;
          this.$el.addClass('point-home');
          break;
        }
      }

      this.setDefaultStyle();
    },

    onClick: function() {
      if (this.currPlayer >= 0 && this.currPawn >= 0) {
        this.trigger('pawn:click', this.currPlayer, this.currPawn, this);
      } else {
        this.trigger('point:click', this);
      }
    },

    setDefaultStyle: function() {
      this.$el.css(this.board.style.point);
      if (this.type === 'start') {
        this.$el.css('background-color', this.board.colors[this.player].start);
      } else if (this.type === 'end') {
        this.$el.css('background-color', this.board.colors[this.player].end);
      } else if (this.type === 'home') {
        this.$el.css('background-color', this.board.colors[this.player].home);
      }
    },

    canAddPawn: function(playerIndex, pawnIndex) {
      return !(this.currPlayer === playerIndex || this.pawnIndex === pawnIndex);
    },

    canEatPawn: function(playerIndex) {
      return this.hasPawn() && this.currPlayer !== playerIndex;
    },

    addPawn: function(playerIndex, pawnIndex, eat) {
      if (this.hasPawn() && !eat) {
        this.setLastPawn(this.currPlayer, this.currPawn);
      } else {
        this.clearLastPawn();
      }

      this.setCurrPawn(playerIndex, pawnIndex);
      this.updateStyle();
    },

    removePawn: function() {
      if (this.hasLastPawn()) {
        this.setCurrPawn(this.lastPlayer, this.lastPawn);
        this.clearLastPawn();
      } else {
        this.clearCurrPawn();
        this.clearLastPawn();
      }

      this.updateStyle();
    },

    updateStyle: function() {
      if (this.hasPawn()) {
        this.$el.addClass('point-player');
        this.$el.css({
          width: (this.baseWidth + this.pawnInc) + '%',
          height: (this.baseHeight + this.pawnInc) + '%',
          top: (this.baseTop - (this.pawnInc / 2)) + '%',
          left: (this.baseLeft - (this.pawnInc / 2)) + '%'
        });
        this.$el.css('background-color', this.board.colors[this.currPlayer].player);
      } else {
        this.$el.removeClass('point-player');
        this.$el.css({
          width: this.board.style.point.width,
          height: this.board.style.point.height,
          top: this.position.top,
          left: this.position.left
        });
        this.setDefaultStyle();
      }
    },

    hasPawn: function() {
      return this.currPlayer >= 0 && this.currPawn >= 0;
    },

    hasLastPawn: function() {
      return this.lastPawn >= 0 && this.lastPlayer >= 0;
    },

    setCurrPawn: function(player, pawn) {
      this.currPlayer = player;
      this.currPawn = pawn;
    },

    setLastPawn: function(player, pawn) {
      this.lastPlayer = player;
      this.lastPawn = pawn;
    },

    clearCurrPawn: function() {
      this.currPawn = -1;
      this.currPlayer = -1;
    },

    clearLastPawn: function() {
      this.lastPawn = -1;
      this.lastPlayer = -1;
    }

  });

  return GamePointView;
});