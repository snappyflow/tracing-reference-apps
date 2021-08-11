/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
    'GET /database': {'controller': 'DatabaseController', 'action': 'getDatabase'},
    'GET /database/error': {'controller': 'DatabaseController', 'action': 'getDatabaseWithError'},
    'GET /elastic': {'controller': 'ElasticController', 'action': 'getElastic'},
    'GET /elastic/error': {'controller': 'ElasticController', 'action': 'getElasticError'},
};
