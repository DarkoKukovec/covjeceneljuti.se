/*global define*/

define([
  'lodash',
  'backbone'
], function(_, Backbone) {
  'use strict';

  var MenuMenuView = Backbone.View.extend({
    className: 'zoom-view',
    boardView: null,
    zoom: {
      MIN: 1,
      MAX: 3,
      scaleFactor: 1,
      previousScaleFactor: 1,
      translateX: 0,
      translateY: 0,
      previousTranslateX: 0,
      previousTranslateY: 0,
      tch1: 0,
      tch2: 0,
      toX: 0,
      toY: 0,
      e: null,
      cssOrigin: '',
      inStart: false,
      outEnd: true
    },

    game: null,

    initialize: function(options) {
      this.listenTo(Backbone, 'resize', this.updateBoardDimensions, this);
      this.boardView = options.board;
    },

    render: function() {
      this.$el.html(this.boardView.el);
      var me = this;

      // this.$el.hammer({
      //   prevent_default: true,
      //   scale_treshold: 0,
      //   drag_min_distance: 0
      // });
      // this.$el.bind('transformstart', function(e) {
      //   me.onTransformStart.call(me, e);
      // });
      // this.$el.bind('transform', function(e) {
      //   me.onTransform.call(me, e);
      // });
      // this.$el.bind('transformend', function(e) {
      //   me.onTransformEnd.call(me, e);
      // });

      this.updateBoardDimensions();

      return this;
    },

    onTransformStart: function(ev) {
      //We save the initial midpoint of the first two touches to say where our transform origin is.
      this.zoom.tch1 = [ev.gesture.touches[0].screenX, ev.gesture.touches[0].screenY];
      this.zoom.tch2 = [ev.gesture.touches[1].screenX, ev.gesture.touches[1].screenY];

      this.zoom.toX = (this.zoom.tch1[0] + this.zoom.tch2[0]) / 2;
      this.zoom.toY = (this.zoom.tch1[1] + this.zoom.tch2[1]) / 2;

      var left = this.$el.offset().left;
      var top = this.$el.offset().top;

      this.cssOrigin = (-(left) + this.zoom.toX) / this.zoom.scaleFactor + 'px ' + (-(top) + this.zoom.toY) / this.zoom.scaleFactor + 'px';
    },

    onTransform: function(ev) {
      this.zoom.scaleFactor = this.zoom.previousScaleFactor * ev.gesture.scale;
      this.zoom.scaleFactor = Math.max(this.zoom.MIN, Math.min(this.zoom.scaleFactor, this.zoom.MAX));
      this.transform(ev);
    },

    onTransformEnd: function() {
      this.zoom.previousScaleFactor = this.zoom.scaleFactor;
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
    },

    transform: function() {
      //We're going to scale the X and Y coordinates by the same amount
      var cssScale = 'scaleX(' + this.zoom.scaleFactor + ') scaleY(' + this.zoom.scaleFactor + ')';

      if (this.zoom.scaleFactor > 1 && !this.zoom.inStart && this.zoom.outEnd) {
        this.zoom.inStart = true;
        this.zoom.outEnd = false;
        this.trigger('zoomin');
      } else if (this.zoom.scaleFactor === 1 && this.zoom.inStart && !this.zoom.outEnd) {
        this.zoom.inStart = false;
        this.zoom.outEnd = true;
        this.trigger('zoomout');
      }

      this.$el.css({
        top: 0,
        left: 0,
        webkitTransform: cssScale,
        transform: cssScale
      });
    }
  });

  return MenuMenuView;
});
