'use strict';

// *****************************************************
// Reference Factory
// *****************************************************

module.factory('Reference', ['$stateParams', function($stateParams) {

    return {

        get: function(sha, path, position) {
            return sha + '/' + path + '#L' + position;
        },

        anchor: function(sha, path, position) {
            return sha + ':' + path + ':' + position;
        }
    };
}]);

