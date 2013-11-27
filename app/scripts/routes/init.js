/*global define*/

define([
  'backbone',
  'routes/about',
  'routes/menu',
  'routes/new-game'
], function (
  Backbone,
  About,
  Menu,
  NewGame
  ) {

  'use strict';
  new About();
  new Menu();
  var router = new NewGame();
  Backbone.on('navigate', function(route) {
    router.navigate(route, {
      trigger: true
    });
  });
});
