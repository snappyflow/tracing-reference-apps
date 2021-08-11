/**
 * ElasticController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
if (process.env.NODE_ENV == 'development') 
    require('dotenv').config();
const { Client } = require('@elastic/elasticsearch')

// console.log('env ', process.env);
const elasticHost = process.env.ELASTIC_HOST;
const elasticPort = process.env.ELASTIC_PORT;
// console.log(elasticHost, elasticPort);

const client = new Client({ node: `http://${elasticHost}:${elasticPort}` });

module.exports = {
  
    getElastic: function (req, res) {
        sails.config.globals.logger.info('Elastic api called');
        let result = client.cluster.health();
        res.send({msg: 'Success', result: result});
        // return res.send({'msg': 'Success elastic'});
    },
    getElasticError: function (req, res) {
        sails.config.globals.logger.info('Elastic error api called');
        client.search({
            index: 'my-index',
        }, (err, result) => {
            if (err) {
                sails.config.globals.logger.error(`Error elastic search ${err}`);
                sails.config.globals.apm.captureError(err);
                return res.status(500).send({'msg': 'Error search API'});
            }
            return res.send({msg: 'Success', result: result});
        });
        // return res.send({'msg': 'Success elastic'});
    }
};

