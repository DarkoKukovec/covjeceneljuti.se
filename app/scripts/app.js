/*global define */
define(function() {
    'use strict';

    var app = {
      version: '0.0.1',
      switchView: function(view) {
        var oldView = this.currentView;

        if (oldView && oldView.cleanup) {
          //view cleanup custom events
          oldView.cleanup();
        }
        var newView = view.render();
        if (newView) {
          $('#main').html(newView.el);
        }

        //scroll to top on every screen change
        setTimeout(function () {
          window.scrollTo(0,1);
        }, 0);

        this.currentView = view;
      }
    };

    return app;
  });
