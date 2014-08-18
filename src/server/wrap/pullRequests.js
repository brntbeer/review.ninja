// modules
var parse = require('parse-diff');

// models
var Star = require('mongoose').model('Star');
var Conf = require('mongoose').model('Conf');
var github = require('../api/github');

module.exports = {

    get: function(req, pull, done) {

        Star.find({repo: pull.base.repo.id, comm: pull.head.sha}, function(err, stars) {

            pull.stars = [];

            if(!err) {
                pull.stars = stars;
            }

            done(err, pull);

        });
    },
    
    getFiles: function(req, files, done) {
        files.forEach(function(file) {
            file.patch = parse(file.patch);
        });

        done(null, files);
    },

    getAll: function(req, pulls, done) {

            var repo;

            try {
                repo = pulls[0].base.repo.id;
            }
            catch(ex) {
                repo = null;
            }

            Conf.findOne({
                user: req.user.id,
                repo: repo
            }, function(err,conf){

                if(!err && conf) {

                    pulls.forEach(function(pull){

                        pull.watched = false;

                        for(var key=0; key<conf.watch.length; key++){

                            var r = req.args.arg.user + ':' + conf.watch[key];
                            var re = new RegExp(r, 'g');

                            if(re.exec(pull.base.label) || re.exec(pull.head.label)){
                                console.log('WATCHED');
                                pull.watched = true;
                                break;
                            }
                        }

                    });
                    
                }

                done(err, pulls);

            });

    }
};