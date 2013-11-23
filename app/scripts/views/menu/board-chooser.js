/*global define*/

define([
  'lodash',
  'backbone',
  'templates',
  'collections/boards'
], function (
  _,
  Backbone,
  JST,
  BoardsCollection
  ) {
  'use strict';

  var MenuBoardChooserView = Backbone.View.extend({
    className: 'board-chooser pure-u-1',
    template: JST['app/scripts/templates/menu/board-chooser.hbs'],
    slideNum: 0,
    events: {
      'click .next-slide': 'onNextSlide',
      'click .previous-slide': 'onPreviousSlide',
      'click .yes-btn': 'onChoose'
    },

    boards: null,

    render: function() {
      var me = this;
      this.boards = new BoardsCollection();
      this.boards.fetch({
        success: function() {
          me.$el.html(me.template());
          me.renderCurrentSlide();
        }
      });
      return this;
    },

    onNextSlide: function() {
      this.slideNum++;
      this.slideNum = this.slideNum >= this.boards.length ? 0: this.slideNum;
      this.renderCurrentSlide();
    },

    onPreviousSlide: function() {
      this.slideNum--;
      this.slideNum = this.slideNum < 0 ? this.boards.length-1: this.slideNum;
      this.renderCurrentSlide();
    },

    getSlideData: function() {
      var slideNum = this.slideNum || 0;
      var data = {};
      _.extend(data, this.boards.at(slideNum).toJSON());
      return data;
    },

    renderCurrentSlide: function() {
      var data = this.getSlideData();
      this.$('.board-photo').css({'background-image': 'url(' + data.img + ')'});
      this.$('.board-description').html(data.about);
    },
    onChoose: function() {
      var data = this.getSlideData();
      this.trigger('board:choosen', this.boards.get(data.id));
    }
  });

  return MenuBoardChooserView;
});
