/*global define*/

define([
  'lodash',
  'templates',
  'views/abstract/list',
  'views/menu/item'
], function (
  _,
  JST,
  List,
  MenuItem
  ) {
  'use strict';

  var MenuListView = List.extend({
    className: 'group-list',
    singleItem: MenuItem
  });

  return MenuListView;
});
