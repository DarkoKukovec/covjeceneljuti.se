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
    // movablePawns: {},
    // movablePlayer: -1,

    initialize: function(options) {
      options = options || {};
      this.game = options.game;
      this.board = options.board;
      this.players = app.currentGame ? app.currentGame.players : this.players;

      this.listenTo(this.game, 'player:move', this.onGamePlayerMove, this);
      this.listenTo(this.game, 'die:thrown', this.onGameDieThrow, this);
      this.listenTo(this.game, 'pawn:eaten', this.onGamePawnEaten, this);
      this.listenTo(this.game, 'player:finished', this.onGamePlayerFinished, this);
      this.listenTo(this.game, 'player:change', this.onGamePlayerChange, this);

      this.addPointsToBoard();
      this.addPawnsToBoard();
      this.addHomeBoxes();
      this.addCurrentPlayerBox();

      window.b = this;
      window.g = this.game;
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
        this.listenTo(pointView, 'transition:end', this.onPointTransitionEnd, this);
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
          .html(this.getPlayerNameFirstLetter(i)));
      }
    },

    addCurrentPlayerBox: function() {
      if (!this.board.currentPlayerBox) {
        return;
      }

      this.$currentPlayerBox = $('<div>')
        .addClass('current-player-box')
        .css(this.board.style.currentPlayerBox || {})
        .css(this.board.currentPlayerBox)
        .html('');
      this.$el.append(this.$currentPlayerBox);
      this.$currentPlayerBox.on('click', _.bind(this.onCurrentPlayerBoxClick, this));
    },

    onPointTransitionEnd: function() {
      this.checkIfMoveEnd();
    },

    // TODO: Remove this
    onCurrentPlayerBoxClick: function() {
      this.game.throwDie();
    },

    onPawnClick: function(pawnPlayerId, pawnId, point) {
      // this.movePawnForward(playerIndex, pawnIndex, 10);
      this.trigger('pawn:click', pawnPlayerId, pawnId, point);

      pawnPlayerId = parseInt(pawnPlayerId, 10);
      pawnId = parseInt(pawnId, 10);

      var possibleMoves = this.game.getMovablePawns();
      var playerId = parseInt(this.game.getCurrentPlayerId(), 10);
      var dieValue = this.game.getCurrentDieValue();

      console.log('Pawn click', playerId, dieValue, possibleMoves);

      if (possibleMoves === undefined || playerId === undefined || dieValue === undefined || playerId !== pawnPlayerId || !possibleMoves.hasOwnProperty(pawnId)) {
        return;
      }

      this.clearPossibleMoves();
      this.game.playMove(pawnId);
    },

    onGamePlayerChange: function(e) {
      this.updateCurrentPlayerBox(e.playerId);
    },

    onGameDieThrow: function(e) {
      this.showPossibleMoves(e.playerId, e.movablePawns);
      this.updateCurrentPlayerBox(e.playerId, e.value);
    },

    onGamePlayerMove: function(e) {
      console.log('Player move', e.playerId, e.pawnId, e.pointId);
      this.movePawnToPoint(e.playerId, e.pawnId, e.pointId);
    },

    onGamePlayerFinished: function(playerId) {
      console.log('Player finished', playerId);
    },

    onGamePawnEaten: function(playerId, pawnId, pointId) {
      console.log('Pawn eaten', playerId, pawnId, pointId);
    },

    onPointClick: function(point) {
      this.trigger('point:click', point);
    },


    updateCurrentPlayerBox: function(playerId, diceValue) {
      if (!this.players[playerId]) {
        return;
      }

      this.$currentPlayerBox.html(this.getPlayerNameFirstLetter(playerId) + (diceValue ? ' - ' + diceValue : ''));
      this.$currentPlayerBox.css('color', this.board.colors[playerId].player);
    },



    showPossibleMoves: function(playerId, movablePawns) {
      this.clearPossibleMoves();

      this.lastMovablePawns = movablePawns;
      this.lastMovaplePlayer = playerId;

      _.forOwn(movablePawns, function(value, key) {
        // var path = this.getPathBetweenPoints(this.pawns[key].pointIndex, value);
        // for (var i = 0; i < path.length; i++) {
        //   this.points[path[i]].setPossibleMove(playerId);
        // }
        this.pawns[playerId][key].point.setPossibleMove(playerId);
        this.points[value].setPossibleMove(playerId);
      }, this);
    },

    clearPossibleMoves: function() {
      _.forOwn(this.lastMovablePawns, function(value, key) {
        this.pawns[this.lastMovaplePlayer][key].point.clearPossibleMove();
        this.points[value].clearPossibleMove();
      }, this);
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

      if (pawnPathIndex === -1 || pointPathIndex === -1 || pawnPathIndex > pointPathIndex) {
        // console.log('Invalid move: ', playerIndex, pawnIndex, pointIndex, pawnPathIndex, pointPathIndex);
        // return;
        this.setPawnToPoint(playerIndex, pawnIndex, pointIndex, true);
      } else {
        this.animatePawnMove(playerIndex, pawnIndex, pawnPathIndex, pointPathIndex);
      }

    },

    animatePawnMove: function(playerIndex, pawnIndex, currPointIndex, endPointIndex) {
      currPointIndex++;
      var pointIndex = this.board.paths[playerIndex][currPointIndex];
      var isLastMove = currPointIndex === endPointIndex;

      this.setPawnToPoint(playerIndex, pawnIndex, pointIndex, isLastMove);

      if (!isLastMove) {
        setTimeout(_.bind(this.animatePawnMove, this, playerIndex, pawnIndex, currPointIndex, endPointIndex), 300);
      }
    },

    setPawnToPoint: function(playerIndex, pawnIndex, pointIndex, triggerMoveEnd) {
      var newPoint = this.points[pointIndex];
      var pawn = this.pawns[playerIndex][pawnIndex];

      if (pawn.point && pawn.pointIndex !== pointIndex) {
        pawn.point.removePawn();
      }

      this.triggerMoveEnd = triggerMoveEnd || false;
      newPoint.addPawn(playerIndex, pawnIndex);

      pawn.pointIndex = pointIndex;
      pawn.point = newPoint;
    },

    checkIfMoveEnd: function() {
      if (this.triggerMoveEnd) {
        this.trigger('board:animation:end');
        this.triggerMoveEnd = false;
      }
    },

    getEmptyHomePoint: function(playerIndex) {
      var home = this.board.homes[playerIndex];
      for (var i = 0; i < home.length; i++) {
        if (!this.points[home[i]].hasPawn()) {
          return this.points[home[i]];
        }
      }
    },

    getPlayerNameFirstLetter: function(playerId) {
      return this.players[playerId] ? this.players[playerId].substring(0, 1) : '';
    },

    getPathBetweenPoints: function(playerId, startPointId, endPointId) {
      var result = [];
      var path = this.board.paths[playerId];
      var startIndex = path.indexOf(startPointId);
      var endIndex = path.indexOf(endPointId);

      if (startIndex < 0 || endIndex < 0 || startIndex > endIndex) {
        result.push(startPointId);
      } else {
        for (var i = startIndex; i < endIndex; i++) {
          result.push(path[i]);
        }
      }

      return result;
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