/*global define*/

define([
  'jquery',
  'backbone'
], function ($, Backbone) {
  'use strict';

  var NewGameRouter = Backbone.Router.extend({
    routes: {
      'new-game': 'main'
    },

    main: function() {
      console.log('new game view');
    }
  });

  return NewGameRouter;
});
