/*global define*/

define([
  'lodash',
  'backbone',
  'templates'
], function (_, Backbone, JST) {
  'use strict';

  var slideData = [{
    id: 1,
    about: 'Standard board. 1-4 players',
    img: ''
  },
  {
    id: 2,
    about: 'Tesla board. 1-3 players.',
    img: ''
  }];

  var MenuBoardChooserView = Backbone.View.extend({
    className: 'board-chooser',
    template: JST['app/scripts/templates/menu/board-chooser.hbs'],
    slideNum: 0,
    events: {
      'click .next-slide': 'onNextSlide',
      'click .previous-slide': 'onPreviousSlide',
      'click .yes-btn': 'onChoose'
    },

    render: function() {
      this.$el.html(this.template());
      this.renderCurrentSlide();
      return this;
    },

    onNextSlide: function() {
      this.slideNum++;
      this.slideNum = this.slideNum >= slideData.length ? 0: this.slideNum;
      this.renderCurrentSlide();
    },

    onPreviousSlide: function() {
      this.slideNum--;
      this.slideNum = this.slideNum < 0 ? slideData.length-1: this.slideNum;
      this.renderCurrentSlide();
    },

    getSlideData: function() {
      var slideNum = this.slideNum || 0;
      var data = {};
      _.extend(data, slideData[slideNum]);
      return data;
    },

    renderCurrentSlide: function() {
      var data = this.getSlideData();
      this.$('.board-photo').css({'background-image': 'url(' + data.img + ')'});
      this.$('.board-description').html(data.about);
    },
    onChoose: function() {
      var data = this.getSlideData();
      this.trigger('board:choosen', data.id);
    }
  });

  return MenuBoardChooserView;
});
