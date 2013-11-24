/*global define*/

define([
  'app',
  'lodash',
  'backbone',
  'templates',
  'views/game/board',
  'views/abstract/zoom'
], function(
  app,
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
      debugger
      this.listenTo(this.game, 'die:thrown', this.onThrowDie, this);
      // this.game.on('die:thrown', this.onThrowDie, this);
    },

    onThrowDie: function(object) {
      console.log(object);
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
    },

    setPlayer: function(playerId) {
      var player = app.currentGame.players[playerId];
      this.$('.player-name').text(player.name);
      this.$('.player-color').css('background-color', player.color);
    }
  });

  return MenuMenuView;
});