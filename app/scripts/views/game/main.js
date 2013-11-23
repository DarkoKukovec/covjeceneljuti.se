/*global define*/

define([
  'jquery',
  'lodash',
  'backbone',
  'templates',
  'views/game/board'
], function(
  $, _, Backbone, JST,
  GameBoardView
) {
  'use strict';

  var GameMainView = Backbone.View.extend({
    className: 'game',
    template: JST['app/scripts/templates/game/main.hbs'],

    initialize: function() {

    },

    render: function() {
      this.$el.html(this.template());
      this.$boardContainer = this.$('.board-container');
      return this;
    },

    createBoard: function(board) {
      this.boardView = new GameBoardView(board);
      this.$boardContainer.html(this.boardView.el);

      this.updateBoardDimensions();

      $(window).on('resize', _.bind(function() {
        this.updateBoardDimensions();
      }, this));
    },

    updateBoardDimensions: function() {
      var bcWidth = this.$boardContainer.width();
      var bcHeight = this.$boardContainer.height();
      var bcRatio = bcHeight / bcWidth;
      var bHeight = bcHeight;
      var bWidth = bcWidth;

      if (bcRatio < this.boardView.getRatio()) {
        bWidth = bcHeight * (1 / this.boardView.getRatio());
      } else {
        bHeight = bcWidth * this.boardView.getRatio();
      }

      this.boardView.setDimensions(bWidth, bHeight);
      this.$boardContainer.css('font-size', (bWidth * 0.025) + 'px');
    }
  });

  return GameMainView;
});