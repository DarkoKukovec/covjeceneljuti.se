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
    type: 'about',
    title: 'About'
  }];

  var MenuMenuView = Backbone.View.extend({
    template: JST['app/scripts/templates/menu/main.hbs'],

    render: function() {
      var me = this;
      this.$el.html(this.template());

      var menuItems = new Backbone.Collection(menuItemsArray);
      var menuView = new MenuView({
        collection: menuItems
      });

      menuView.render();
      menuItems.trigger('reset');

      this.listenTo(menuView, 'click:item', function(model) {
        me.trigger('navigate', model.get('type'));
      });

      this.$el.append(menuView.el);
    }
  });

  return MenuMenuView;
});
