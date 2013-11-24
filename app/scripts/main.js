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
    },
    hammer: {
      deps: ['jquery']
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
    gshake: 'vendor/gShake',
    hammer: 'vendor/hammer',
    fastclick: '../bower_components/fastclick/lib/fastclick'
  }
});

require([
  'backbone',
  'fastclick',
  'gshake',
  'routes/init',
  'utils/handlebars-helper',
  'hammer'
], function(
  Backbone,
  FastClick
) {

  FastClick.attach(document.body);
  // if (window.location.hash !== '') {
  //   window.location.hash = '';
  // }

  // if (window.location.hash !== '') {
  //   window.location.hash = '';
  // }
  $(document).gShake(function() {
    Backbone.trigger('shake');
  });
  $(window).on('resize', function() {
    Backbone.trigger('resize');
  });

  // $(window).on('beforeunload', function() {
  //   return 'You have attempted to leave this page.';
  // });
  Backbone.history.start();
});
