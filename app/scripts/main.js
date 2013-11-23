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
    },
    gshake: {
      deps: [
        'jquery'
      ]
    }
  },
  paths: {
    jquery: '../bower_components/jquery/jquery',
    backbone: '../bower_components/backbone/backbone',
    lodash: '../bower_components/lodash/dist/lodash.compat',
    handlebars: '../bower_components/handlebars/handlebars',
    'requirejs-text': '../bower_components/requirejs-text/text',
    requirejs: '../bower_components/requirejs/require',
    'handlebars.runtime': '../bower_components/handlebars/handlebars.runtime',
    gshake: 'vendor/gShake'
  }
});

require([
  'backbone',
  'routes/menu',
  'gshake'
], function (
    Backbone,
    MainMenu
  ) {
  $(document).gShake(function() {
    Backbone.trigger('shake');
  });
  $(window).on('resize', function() {
    Backbone.trigger('resize');
  });
  new MainMenu();
  Backbone.history.start();
});
