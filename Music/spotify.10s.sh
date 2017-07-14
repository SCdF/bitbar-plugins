#!/bin/bash

# Get current Spotify status with play/pause button
#
# by Jason Tokoph (jason@tokoph.net)
#
# Shows current track information from spotify
# 10 second refresh might be a little too quick. Tweak to your liking.

# metadata
# <bitbar.title>Spotify Now Playing</bitbar.title>
# <bitbar.version>v1.2</bitbar.version>
# <bitbar.author>Jason Tokoph</bitbar.author>
# <bitbar.author.github>jtokoph</bitbar.author.github>
# <bitbar.desc>Display currently playing Spotify song. Play/pause, skip forward, skip backward.</bitbar.desc>
# <bitbar.image>http://i.imgur.com/y1SZwfq.png</bitbar.image>

state_playing="▶"
state_paused="❚❚"

function tellspotify() {
  osascript -e "tell application \"Spotify\" to $1"
}

function urlSafe() {
  echo "$1" | sed "s/ /%20/g"
}

if [ "$1" = 'launch' ]; then
  tellspotify 'activate'
  exit
fi

if [ "$(osascript -e 'application "Spotify" is running')" = "false" ]; then
  # echo "♫"
  # echo "---"
  # echo "Spotify is not running"
  # echo "Launch Spotify | bash='$0' param1=launch terminal=false"
  exit
fi

case "$1" in
  'playpause' | 'previous track' | 'next track')
    tellspotify "$1"
    exit
    ;;
  'shuffling' | 'repeating')
    tellspotify "if $1 then set $1 to false else set $1 to true"
    exit
esac

state=$(tellspotify 'player state as string');
track=$(tellspotify 'name of current track as string');
artist=$(tellspotify 'artist of current track as string');
if [ "$1" = 'lyrics' ]; then
  osascript -e "do shell script \"open 'https://www.musixmatch.com/search/$track $artist'\""
  exit
fi

if [ "$state" = "playing" ]; then
  state_icon=$state_playing
else
  state_icon=$state_paused
fi

suffix="..."
trunc_length=20
truncated_track=$track
if [ ${#track} -gt $trunc_length ];then
  truncated_track=${track:0:$trunc_length-${#suffic}}$suffix
fi
truncated_artist=$artist
if [ ${#artist} -gt $trunc_length ];then
  truncated_artist=${artist:0:$trunc_length-${#suffic}}$suffix
fi
album=$(tellspotify 'album of current track as string');

if [ $state_icon == $state_playing ]; then
  echo "$state_icon $truncated_track - $truncated_artist"
else
  echo "$state_icon"
fi
echo "---"

echo "Track:| size=9"
echo "$track | color=#333333"
echo "Artist:| size=9"
echo "$artist | color=#333333"
echo "Album:| size=9"
echo "$album | color=#333333"

echo '---'
echo "🎵 Lyrics | bash='$0' param1='lyrics' terminal=false"
echo '---'

if [ "$state" = "playing" ]; then
  echo "⏸ Pause | bash='$0' param1=playpause terminal=false refresh=true"
  echo "⏮ Previous | bash='$0' param1='previous track' terminal=false refresh=true"
  echo "⏭ Next | bash='$0' param1='next track' terminal=false refresh=true"
  echo "---"
  shuffling=$(tellspotify 'shuffling');
  repeating=$(tellspotify 'repeating');
  echo "🔀 Shuffle: $shuffling | bash='$0' param1='shuffle' terminal=false refresh=true"
  echo "🔁 Repeat: $repeating | bash='$0' param1='repeat' terminal=false refresh=true"
  echo "---"
else
  echo "▶️ Play | bash='$0' param1=playpause terminal=false refresh=true"
fi

echo '---'
echo "Open Spotify | bash='$0' param1=launch terminal=false"
