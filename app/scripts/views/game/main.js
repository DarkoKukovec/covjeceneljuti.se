/*global define*/

define([
  'lodash',
  'backbone',
  'templates',
  'views/game/board',
  'views/abstract/zoom'
], function(
  _,
  Backbone,
  JST,
  BoardView,
  ZoomView
) {
  'use strict';

  var MenuMenuView = Backbone.View.extend({
    className: 'game-container',
    template: JST['app/scripts/templates/game/main.hbs'],

    board: null,
    game: null,

    initialize: function(options) {
      this.board = options.board;
      this.game = options.game;
    },

    render: function() {
      this.$el.html(this.template());

      var boardView = new BoardView({
        game: this.game,
        board: this.board.toJSON()
      });
      var zoomView = new ZoomView({
        board: boardView
      });
      this.$('.board-container').html(zoomView.render().el);

      this.once('ready', function() {
        zoomView.updateBoardDimensions();
      });

      return this;
    }
  });

  return MenuMenuView;
});
