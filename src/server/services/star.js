var Star = require('mongoose').model('Star');

var url = require('./url');
var github = require('./github');
var status = require('../services/status');
var notification = require('../services/notification');

module.exports = {

    create: function(sha, user, repo, repo_uuid, number, sender, token, done) {
        console.log('bbbbb');
        Star.create({
            sha: sha,
            user: sender.id,
            repo: repo_uuid,
            name: sender.login,
            created_at: Date.now()
        }, function(err, star) {
            console.log('asdfasdfasdf', err);
            if(!err && star) {
                io.emit(user + ':' + repo + ':pull-request-' + number + ':starred', {});
                console.log('1');
                console.log('log', sha, repo_uuid, number);
                status.update({
                    user: user,
                    repo: repo,
                    sha: sha,
                    repo_uuid: repo_uuid,
                    number: number,
                    token: token
                });
                console.log('2');
                notification.sendmail('star', user, repo, repo_uuid, token, number, {
                    user: user,
                    repo: repo,
                    number: number,
                    sender: sender,
                    url: url.reviewPullRequest(user, repo, number)
                });
            }
            if(typeof done === 'function') {
                done(err, star);
            }
        });
    }
};
