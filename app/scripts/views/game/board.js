/*global define*/

define([
  'jquery',
  'lodash',
  'backbone',
  'templates'
], function($, _, Backbone) {
  'use strict';

  var GameBoardView = Backbone.View.extend({
    className: 'board',

    initialize: function(board) {
      this.board = board;
      this.render();
    },

    render: function() {
      this.$el.html();
      this.addPointsToBoard();
      return this;
    },

    addPointsToBoard: function() {

      _.forOwn(this.board.points, function(point, pointId) {
        // console.log('Adding point ' + pointId + ' to ' + point.left + ' - ' + point.top);
        this.$el.append(this.createPoint(pointId, point));
      }, this);
    },

    createPoint: function(pointId, point) {
      var id = parseInt(pointId, 10);
      var $point = $('<div>')
        .addClass('point')
        .attr('data-id', pointId)
        .css({
          left: point.left + '%',
          top: point.top + '%'
        })
        .css(this.board.style.point);

      for (var i = 0; i < this.board.paths.length; i++) {
        var path = this.board.paths[i];
        var home = this.board.homes[i];
        var color = this.board.colors[i];
        var pathFirst = path[0];
        var pathLasts = path.slice(path.length - 4, path.length);
        // debugger
        if (pathFirst === id) {
          $point.css('background-color', color.start);
          $point.addClass('point-first');
        } else if (pathLasts.indexOf(id) !== -1) {
          $point.css('background-color', color.end);
          $point.addClass('point-end');
        } else if (home.indexOf(id) !== -1) {
          $point.css('background-color', color.home);
          $point.addClass('point-home');
        }
      }

      return $point;
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