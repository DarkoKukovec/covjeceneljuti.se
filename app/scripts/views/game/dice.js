/*global define*/

define([
  'lodash',
  'backbone',
  'templates'
], function(_, Backbone, JST) {
  'use strict';

  var MenuMenuView = Backbone.View.extend({
    className: 'dice-view',
    template: JST['app/scripts/templates/game/dice.hbs'],

    events: {
      'click .throw-button': 'onDiceThrow'
    },

    cubeEl: null,
    xAngle: 0,
    yAngle: 0,
    prop: null,

    thrown: false,
    localPlayer: false,
    game: null,
    result: null,

    initialize: function(options) {
      this.localPlayer = options.local;
      this.game = options.game;
      window.d = this;
      this.listenTo(Backbone, 'shake', this.onDiceThrow, this);
      this.listenTo(Backbone, 'resize', this.resize, this);
      this.listenTo(Backbone, 'dice:throw', this.animateDice, this); // network game

      var props = 'transform webkitTransform mozTransform oTransform msTransform'.split(' '),
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
      this.rotateCube(baseTurn.concat(turns[finalValue]));
    },

    render: function() {
      this.$el.html(this.template());
      this.cubeEl = this.$('.cube').get(0);
      this.cubeEl.style[this.prop] = 'rotateX(0deg) rotateY(0deg)';

      if (this.localPlayer) {
        if (('ondevicemotion' in window)) {
          this.$('.shakeable').show();
        }
        var animationEnd = $.proxy(this.onAnimationEnd, this);
        this.resize();
        this.$('.cube')
          .on('transitionend', animationEnd)
          .on('webkitTransitionEnd', animationEnd)
          .on('oTransitionEnd', animationEnd);
      } else {
        this.$('.throw-button, .shakeable').fadeOut();
        this.$('.waiting').show();
      }
    },

    onDiceThrow: function() {
      if (this.thrown || !this.localPlayer) {
        return;
      }
      this.$('.throw-button, .shakeable, .waiting').hide();
      this.thrown = true;
      this.result = this.getDiceNumber();
      this.trigger('dice:result', this.result);
      this.animateDice(this.result);
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
      }, 80 * step);
    },

    onAnimationEnd: function() {
      var me = this;
      this.$('.thrown-value').text(this.result);
      this.$('.thrown').show();
      setTimeout(function() {
        me.thrown = false;
        me.trigger('animation:end');
      }, 1000);
    },

    resize: function() {
      var size = Math.min($(window).width(), $(window).height() - 100) * 0.5;
      this.$('.cube-wrapper').css({
        'transform': 'scale(' + (size / 200) + ')'
      });
    }
  });

  return MenuMenuView;
});