#!/usr/bin/env /Users/scdf/.nvm/versions/node/v5.4.0/bin/node
// TODO: ^^ change this to where node should be, and fix my local install

// <bitbar.title>Twitch Now Playing</bitbar.title>
// <bitbar.version>v0.5</bitbar.version>
// <bitbar.author>Stefan du Fresne</bitbar.author>
// <bitbar.author.github>SCdF</bitbar.author.github>
// <bitbar.desc>Shows which streamers you follow are live.</bitbar.desc>
// <bitbar.image>https://i.imgur.com/PznEQCt.png</bitbar.image>
// <bitbar.dependencies>node, livestreamer</bitbar.dependencies>

var LIVESTREAMER_PATH = '/usr/local/bin/livestreamer';
var LIVESTREAMER_CONFIG_PATH = process.env.HOME + '/.config/livestreamer/config';
var AUTH_PROP_KEY = 'twitch-oauth-token';
var ACCESS_TOKEN = readAccessToken();

function readAccessToken() {
    try {
        var data = require('fs').readFileSync(LIVESTREAMER_CONFIG_PATH, 'utf8');
        if (data) {
            var line = data.split('\n').find(function(line) {
                return line.indexOf(AUTH_PROP_KEY) >= 0;
            });

            return line.substring(line.indexOf('=') + 1);
        }
    } catch (e) {}
}

if (ACCESS_TOKEN) {
    var urlHost = 'api.twitch.tv'
    var urlPath = '/kraken/streams/followed?stream_type=live'
    var icon = '👾';
    var STATUS_LENGTH = 25;

    function handleResponse(body) {
        var streamByGame = {};
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

    require('https').get({
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
} else {
    console.log('💔');
    console.log('---');
    console.log('Click to authenticate livestreamer | terminal=false bash=' + LIVESTREAMER_PATH + ' param1=--twitch-oauth-authenticate');
}
