define(['lodash', 'backbone'], function (_, Backbone) {
    var self = function Game() {
        this.initialize.apply(this, arguments);
    };

    _.extend(Game.prototype, Backbone.Events, {
        initialize: function (options) {

        }
    });

    return self;
});