/*global define*/

define([
  'lodash',
  'backbone',
  'hammer'
], function (_, Backbone, Hammer) {
  'use strict';

  var MenuMenuView = Backbone.View.extend({

    child: null,

    posX: 0,
    posY: 0,
    scale: 1,
    lastScale: 0,
    lastPosX: 0,
    lastPosY: 0,
    maxPosX: 0,
    maxPosY: 0,

    initialize: function(option) {
      this.child = option;
    },

    render: function() {
      this.$el.html(this.child.render().el);

      Hammer.on('touch drag transform dragend', function(ev) {
        switch (ev.type) {
        case 'touch':
          this.lastScale = this.scale;
          break;

        case 'drag':
          if (this.scale !== 1){
            this.posX = this.lastPosX + ev.gesture.deltaX;
            this.posY = this.lastPosY + ev.gesture.deltaY;
            if (this.posX > this.maxPosX){
              this.posX = this.maxPosX;
            }
            if (this.posX < -this.maxPosX){
              this.posX = -this.maxPosX;
            }
            if (this.posY > this.maxPosY){
              this.posY = this.maxPosY;
            }
            if (this.posY < -this.maxPosY){
              this.posY = -this.maxPosY;
            }
          } else {
            this.posX = 0;
            this.posY = 0;
          }
          break;

        case 'transform':
          this.scale = Math.max(1, Math.min(this.lastScale * ev.gesture.scale, 10));
          this.maxPosX = Math.ceil((this.scale - 1) * this.el.clientWidth / 2);
          this.maxPosY = Math.ceil((this.scale - 1) * this.el.clientHeight / 2);
          if (this.posX > this.maxPosX){
            this.posX = this.maxPosX;
          }
          if (this.posX < -this.maxPosX){
            this.posX = -this.maxPosX;
          }
          if (this.posY > this.maxPosY){
            this.posY = this.maxPosY;
          }
          if (this.posY < -this.maxPosY){
            this.posY = -this.maxPosY;
          }
          break;
        case 'dragend':
          this.lastPosX = this.posX < this.maxPosX ? this.posX: this.maxPosX;
          this.lastPosY = this.posY < this.maxPosY ? this.posY: this.maxPosY;
          break;
        }

        // transform!
        var transform =
          'translate3d(0, 0, 0) ' +
          'scale3d(1, 1, 0) ';
        if (this.scale !== 1) {
          transform =
            'translate3d('+this.posX+'px,'+this.posY+'px, 0) ' +
            'scale3d('+this.scale+','+this.scale+', 0) ';
        }

        this.el.style.transform = transform;
        this.el.style.oTransform = transform;
        this.el.style.msTransform = transform;
        this.el.style.mozTransform = transform;
        this.el.style.webkitTransform = transform;
      });
    }
  });

  return MenuMenuView;
});
