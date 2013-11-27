/*global define*/

define([
  'lodash',
  'backbone',
  'templates',
  'views/menu/list'
], function (
  _,
  Backbone,
  JST,
  MenuView
  ) {
  'use strict';

  var menuItemsArray = [{
    type: 'new-game',
    title: 'New game'
  }, {
  //   type: 'sraz-game',
  //   title: 'Sraz game'
  // }, {
    type: 'the-story',
    title: 'The Story'
  }, {
    type: 'help',
    title: 'Help'
  }];

  var MenuMenuView = Backbone.View.extend({
    template: JST['app/scripts/templates/menu/main.hbs'],

    render: function() {
      this.$el.html(this.template());

      var menuItems = new Backbone.Collection(menuItemsArray);
      var menuView = new MenuView({
        collection: menuItems
      });

      menuView.render();
      menuItems.trigger('reset');

      this.listenTo(menuView, 'click:item', function(model) {
        Backbone.trigger('navigate', model.get('type'));
      });

      this.$el.append(menuView.el);
      return this;
    }
  });

  return MenuMenuView;
});
