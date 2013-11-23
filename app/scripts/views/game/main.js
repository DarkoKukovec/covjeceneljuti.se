/*global define*/

define([
<<<<<<< HEAD
  'lodash',
  'backbone',
  'templates',
  'views/abstract/zoom'
], function (
  _,
  Backbone,
  JST,
  ZoomView
  ) {
  'use strict';

  var MenuMenuView = Backbone.View.extend({
    template: JST['app/scripts/templates/game/main.hbs'],

    render: function() {
      this.$el.html(this.template());

      // TODO: Board view
      // TODO: init zoom view
    }
  });

  return MenuMenuView;
});
=======
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
      this.listenTo(Backbone, 'resize', this.onWindowResize, this);
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
    },

    onWindowResize: function() {
      this.updateBoardDimensions();
    },

    updateBoardDimensions: function() {
      if (!this.boardView) {
        return;
      }

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
>>>>>>> feature/board
