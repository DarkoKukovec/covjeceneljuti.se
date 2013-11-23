/*global define*/
//register handlebar helpers
define([
  'lodash',
  'handlebars'
], function (
  _,
  Handlebars
  ) {
  'use strict';

  Handlebars.registerHelper('option-list', function(length) {
    var out = '<select>';
    for(var i=0; i<length; i++) {
      if (i===0) {
        continue;
      }
      out = out + '<option value='+ (i+1) +'>' + (i+1) + '</option>';
    }

    return out + '</select>';
  });

});
