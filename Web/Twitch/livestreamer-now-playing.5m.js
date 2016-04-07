#!/usr/bin/env /Users/scdf/.nvm/versions/node/v5.4.0/bin/node
// TODO: ^^ change this to where node should be, and fix my local install
// TODO: consider re-writing in something more accessible such as python

// <bitbar.title>Twitch Now Playing</bitbar.title>
// <bitbar.version>v0.5</bitbar.version>
// <bitbar.author>Stefan du Fresne</bitbar.author>
// <bitbar.author.github>SCdF</bitbar.author.github>
// <bitbar.desc>Shows which streamers you follow are live.</bitbar.desc>
// <bitbar.image>https://i.imgur.com/PznEQCt.png</bitbar.image>
// <bitbar.dependencies>node, livestreamer</bitbar.dependencies>

// TODO: load this from a generic storage location
// TODO: detect when we don't have this and provide a link to get it
var ACCESS_TOKEN = "PUT YOUR TOKEN HERE";
var urlHost = 'api.twitch.tv'
var urlPath = '/kraken/streams/followed?stream_type=live'
var icon = '👾';
var bleedPurple = '💜';
var LIVESTREAMER_PATH = '/usr/local/bin/livestreamer';
var STATUS_LENGTH = 25;

function handleResponse(body) {
    var streamByGame = {}
    for(stream of body.streams) {
        if (!streamByGame[stream.channel.game]) {
            streamByGame[stream.channel.game] = [];
        }

        streamByGame[stream.channel.game].push(stream);
    }

    var outputs = [];

    for (game in streamByGame) {
        outputs.push(['', game, '| size=10 \n', streamByGame[game].map(function(stream) {
            var channel = stream.channel;
            var url = channel.url.replace('http://',    '');
            return  [channel.display_name, ' | size=12 terminal=false bash=' + LIVESTREAMER_PATH + ' param1=', url, '\n'].join('') +
                    ['[', stream.viewers, '] ', channel.status, '| size=12 alternate=true length=30 bash=' + LIVESTREAMER_PATH + ' param1=', url, '\n'].join('');
        }).join('')].join(''));
    }

    console.log(
        icon + ' ' +
        (body.streams.length > 0 ? body.streams.length : '') +
        '\n---\n' +
        outputs.join('\n---\n'));
}

var https = require('https');
https.get({
    hostname: urlHost,
    path: urlPath,
    headers: {
        'Authorization': 'OAuth ' + ACCESS_TOKEN
    }
}, function(res) {
    var body = '';
    res.on('data', function(data) {
        body += data;
    });
    res.on('end', function() {
        handleResponse(JSON.parse(body));
    });
});
