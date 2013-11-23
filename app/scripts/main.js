/*global require*/
'use strict';

require.config({
  shim: {
    lodash: {
      exports: '_'
    },
    backbone: {
      deps: [
        'lodash',
        'jquery'
      ],
      exports: 'Backbone'
    },
    handlebars: {
      exports: 'Handlebars'
    }
  },
  paths: {
    jquery: '../bower_components/jquery/jquery',
    backbone: '../bower_components/backbone/backbone',
    lodash: '../bower_components/lodash/dist/lodash.compat',
    handlebars: '../bower_components/handlebars/handlebars',
    'requirejs-text': '../bower_components/requirejs-text/text',
    requirejs: '../bower_components/requirejs/require',
    'handlebars.runtime': '../bower_components/handlebars/handlebars.runtime'
  }
});

require([
  'backbone',
  'routes/init'
], function (
    Backbone
  ) {
  Backbone.history.start();
});
