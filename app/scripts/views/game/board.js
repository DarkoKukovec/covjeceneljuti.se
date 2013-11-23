/*global define*/

define([
  'jquery',
  'lodash',
  'backbone',
  'app',
  'views/game/point'
], function($, _, Backbone, app, PointView) {
  'use strict';

  var GameBoardView = Backbone.View.extend({
    className: 'board',
    pawns: [
      [],
      [],
      [],
      []
    ],
    points: [],
    players: ['1', '2', '3', '4'],

    initialize: function(options) {
      options = options || {};
      this.game = options.game;
      this.board = options.board;
      this.players = app.currentGame ? app.currentGame.players : this.players;

      this.listenTo(this.game, 'player:move', function(event) {
        this.movePawnToPoint(event.playerId, event.pawnId, event.pointId);
      }, this);

      this.addPointsToBoard();
      this.addPawnsToBoard();
      this.addHomeBoxes();
      // window.b = this;
      // window.g = this.game;
    },

    addPointsToBoard: function() {
      _.forOwn(this.board.points, function(point, pointId) {
        var pointView = new PointView({
          board: this.board,
          point: point,
          pointId: pointId
        });
        this.points[pointId] = pointView;
        this.listenTo(pointView, 'point:click', this.onPointClick, this);
        this.listenTo(pointView, 'pawn:click', this.onPawnClick, this);
        this.$el.append(pointView.el);
      }, this);
      this.$points = this.$('.point');
    },

    addPawnsToBoard: function() {
      for (var i = 0; i < this.board.homes.length; i++) {
        var home = this.board.homes[i];
        for (var j = 0; j < home.length; j++) {
          this.pawns[i][j] = {
            point: this.points[home[j]],
            pointIndex: home[j]
          };
          this.setPawnToPoint(i, j, home[j]);
        }
      }
    },

    addHomeBoxes: function() {
      if (!this.board.homeBoxes) {
        return;
      }

      for (var i = 0; i < this.board.homeBoxes.length; i++) {
        this.$el.append($('<div>')
          .addClass('home-box home-box-' + i)
          .css(this.board.style.homeBox)
          .css(this.board.homeBoxes[i])
          .css('color', this.board.colors[i].player)
          .html(this.players[i].substring(0, 1)));
      }
    },

    onPawnClick: function(playerIndex, pawnIndex, point) {
      // this.movePawnForward(playerIndex, pawnIndex, 42);
      this.trigger('pawn:click', playerIndex, pawnIndex, point);
    },

    onPointClick: function(point) {
      this.trigger('point:click', point);
    },

    movePawnForward: function(playerIndex, pawnIndex, dice) {
      var pawn = this.pawns[playerIndex][pawnIndex];
      var path = this.board.paths[playerIndex];
      var pawnPathIndex = path.indexOf(pawn.pointIndex);

      if (pawnPathIndex < 0) {
        this.setPawnToPoint(playerIndex, pawnIndex, path[0]);
        this.pawnPathIndex = 0;
      }

      var pointPathIndex = pawnPathIndex + dice;

      if (pawnPathIndex === -1 || pointPathIndex === -1 || pointPathIndex >= path.length) {
        console.log('Cant move forward');
        return;
      }

      this.movePawnToPoint(playerIndex, pawnIndex, path[pawnPathIndex + dice]);
    },

    movePawnToPoint: function(playerIndex, pawnIndex, pointIndex) {
      var pawn = this.pawns[playerIndex][pawnIndex];
      var path = this.board.paths[playerIndex];
      var pawnPathIndex = path.indexOf(pawn.pointIndex);
      var pointPathIndex = path.indexOf(pointIndex);

      // if (pawnPathIndex === -1 || pointPathIndex === -1 || pawnPathIndex > pointPathIndex || !this.points[pointIndex].canAddPawn(playerIndex, pawnIndex)) {
      //   console.log('Invalid move: ', playerIndex, pawnIndex, pointIndex, pawnPathIndex, pointPathIndex);
      //   return;
      // }

      // eat = this.points[pointIndex].canEatPawn(playerIndex);
      // if (eat) {
      //   console.log('Will eat pawn');
      // }

      this.animatePawnMove(playerIndex, pawnIndex, pawnPathIndex, pointPathIndex);
    },

    animatePawnMove: function(playerIndex, pawnIndex, currPointIndex, endPointIndex) {
      currPointIndex++;
      var pointIndex = this.board.paths[playerIndex][currPointIndex];

      this.setPawnToPoint(playerIndex, pawnIndex, pointIndex);

      if (currPointIndex < endPointIndex) {
        setTimeout(_.bind(this.animatePawnMove, this, playerIndex, pawnIndex, currPointIndex, endPointIndex), 300);
      }
    },

    setPawnToPoint: function(playerIndex, pawnIndex, pointIndex) {
      var newPoint = this.points[pointIndex];
      var pawn = this.pawns[playerIndex][pawnIndex];

      if (pawn.point && pawn.pointIndex !== pointIndex) {
        pawn.point.removePawn();
      }

      newPoint.addPawn(playerIndex, pawnIndex);

      pawn.pointIndex = pointIndex;
      pawn.point = newPoint;
    },

    getEmptyHomePoint: function(playerIndex) {
      var home = this.board.homes[playerIndex];
      for (var i = 0; i < home.length; i++) {
        if (!this.points[home[i]].hasPawn()) {
          return this.points[home[i]];
        }
      }
    },

    getRatio: function() {
      return this.board.style.boardRatio;
    },

    setDimensions: function(width, height) {
      this.$el.css({
        width: width + 'px',
        height: height + 'px'
      });
    }

  });

  return GameBoardView;
});