/*global define*/

define([
  'jquery',
  'backbone'
], function ($, Backbone) {
  'use strict';

  var AboutRouter = Backbone.Router.extend({
    routes: {
      'about': 'main'
    },

    main: function() {
      console.log('about game view');
    }

  });

  return AboutRouter;
});
