/*global define*/

define([
  'lodash',
  'backbone',
  'hammer'
], function (_, Backbone, Hammer) {
  'use strict';

  var MenuMenuView = Backbone.View.extend({
    className: 'zoom-view',
    boardView: null,

    initialize: function(options) {
      this.listenTo(Backbone, 'resize', this.updateBoardDimensions, this);
      this.boardView = options.board;
    },

    render: function() {
      this.$el.html(this.boardView.el);

      Hammer(this.el).on('pinch', function(ev) {
      });

      this.updateBoardDimensions();

      return this;
    },

    updateBoardDimensions: function() {
      if (!this.boardView) {
        return;
      }

      var bcWidth = this.$el.width();
      var bcHeight = this.$el.height();
      var bcRatio = bcHeight / bcWidth;
      var bHeight = bcHeight;
      var bWidth = bcWidth;

      if (bcRatio < this.boardView.getRatio()) {
        bWidth = bcHeight * (1 / this.boardView.getRatio());
      } else {
        bHeight = bcWidth * this.boardView.getRatio();
      }

      this.boardView.setDimensions(bWidth, bHeight);
      this.$el.css('font-size', (bWidth * 0.025) + 'px');
    }
  });

  return MenuMenuView;
});
