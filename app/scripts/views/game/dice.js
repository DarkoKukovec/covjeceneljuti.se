/*global define*/

define([
  'lodash',
  'backbone',
  'templates'
], function (_, Backbone, JST) {
  'use strict';

  var MenuMenuView = Backbone.View.extend({
    template: JST['app/scripts/templates/game/dice.hbs'],

    events: {
      'touchend .button': 'onDiceThrow'
    },

    cubeEl: null,
    xAngle: 0,
    yAngle: 0,
    prop: null,

    initialize: function() {
      this.listenTo(Backbone, 'shake', this.onDiceThrow, this);
      this.listenTo(Backbone, 'resize', this.resize, this);

      var props = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
        el = document.createElement('div');

      for (var i = 0, l = props.length; i < l; i++) {
        if (typeof el.style[props[i]] !== 'undefined') {
          this.prop = props[i];
          break;
        }
      }
    },

    animateDice: function(finalValue) {
      var baseTurn = [0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 3, 0, 3, 3, 2, 3, 2, 2, 2];
      var turns = {
        1: [3],
        2: [],
        3: [2, 2, 2],
        4: [2],
        5: [2, 2],
        6: [1]
      };
      console.log(finalValue);
      this.rotateCube(baseTurn.concat(turns[finalValue]));
    },

    render: function() {
      this.$el.html(this.template());
      this.cubeEl = this.$('.cube').get(0);
      this.cubeEl.style[this.prop] = 'rotateX(0deg) rotateY(0deg)';
      if (('ondevicemotion' in window)) {
        this.$('.shakeable').show();
      }

      this.resize();
      this.$('.cube')
        .on('transitionend', this.onAnimationEnd)
        .on('webkitTransitionEnd', this.onAnimationEnd)
        .on('oTransitionEnd', this.onAnimationEnd);
    },

    onDiceThrow: function() {
      var result = this.getDiceNumber();
      Backbone.trigger('dice:result', result);
      this.animateDice(result);
    },

    getDiceNumber: function() {
      return Math.floor(Math.random() * 6) + 1;
    },

    rotateCube: function(moves) {
      this.xAngle = 0;
      this.yAngle = 0;

      for (var j = 0; j < moves.length; j++) {
        this.rotateStep(moves[j], j);
      }
    },

    rotateStep: function(move, step) {
      var me = this;
      setTimeout(function() {
        switch (move) {
        case 0: // left
          me.yAngle -= 90;
          break;

        case 1: // up
          me.xAngle += 90;
          break;

        case 2: // right
          me.yAngle += 90;
          break;

        case 3: // down
          me.xAngle -= 90;
          break;
        }
        me.cubeEl.style[me.prop] = 'rotateX(' + me.xAngle + 'deg) rotateY(' + me.yAngle + 'deg)';
      }, 100 * step);
    },

    onAnimationEnd: function() {
      Backbone.trigger('animation:end');
    },

    resize: function() {
      var s = Math.min($(window).width(), $(window).height() - 100) * 0.5;
      this.$('.cube-wrapper').css({
        'transform': 'scale(' + (s / 200) + ')'
      });
    }
  });

  return MenuMenuView;
});
