/*global define*/

define([
  'routes/about',
  'routes/menu',
  'routes/new-game'
], function (
  About,
  Menu,
  NewGame
  ) {

  'use strict';
  new About();
  new Menu();
  new NewGame();
});
