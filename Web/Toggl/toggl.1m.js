#!/usr/bin/env /usr/local/bin/node

// <bitbar.title>Toggl status</bitbar.title>
// <bitbar.version>v1.1</bitbar.version>
// <bitbar.author>Stefan du Fresne</bitbar.author>
// <bitbar.author.github>SCdF</bitbar.author.github>
// <bitbar.desc>Shows hours completed today, hours completed this week.</bitbar.desc>
// <bitbar.image></bitbar.image>
// <bitbar.dependencies>node</bitbar.dependencies>
const fs = require('fs');

const AVATARS = {
  '👶': ['👶', '👶🏻', '👶🏼', '👶🏽', '👶🏾', '👶🏿'],
  '👦': ['👦', '👦🏻', '👦🏼', '👦🏽', '👦🏾', '👦🏿'],
  '👧': ['👧', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '👧🏿'],
  '👨': ['👨', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿'],
  '👩': ['👩', '👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿'],
  '👱‍♀️': ['👱‍♀️', '👱🏻‍♀️', '👱🏼‍♀️', '👱🏽‍♀️', '👱🏾‍♀️', '👱🏿‍♀️'],
  '👱': ['👱', '👱🏻', '👱🏼', '👱🏽', '👱🏾', '👱🏿'],
  '👴': ['👴', '👴🏻', '👴🏼', '👴🏽', '👴🏾', '👴🏿'],
  '👵': ['👵', '👵🏻', '👵🏼', '👵🏽', '👵🏾', '👵🏿'],
  '👲': ['👲', '👲🏻', '👲🏼', '👲🏽', '👲🏾', '👲🏿'],
  '👳‍♀️': ['👳‍♀️', '👳🏻‍♀️', '👳🏼‍♀️', '👳🏽‍♀️', '👳🏾‍♀️', '👳🏿‍♀️'],
  '👳': ['👳', '👳🏻', '👳🏼', '👳🏽', '👳🏾', '👳🏿'],
  '👮‍♀️': ['👮‍♀️', '👮🏻‍♀️', '👮🏼‍♀️', '👮🏽‍♀️', '👮🏾‍♀️', '👮🏿‍♀️'],
  '👮': ['👮', '👮🏻', '👮🏼', '👮🏽', '👮🏾', '👮🏿'],
  '👷‍♀️': ['👷‍♀️', '👷🏻‍♀️', '👷🏼‍♀️', '👷🏽‍♀️', '👷🏾‍♀️', '👷🏿‍♀️'],
  '👷': ['👷', '👷🏻', '👷🏼', '👷🏽', '👷🏾', '👷🏿'],
  '💂‍♀️': ['💂‍♀️', '💂🏻‍♀️', '💂🏼‍♀️', '💂🏽‍♀️', '💂🏾‍♀️', '💂🏿‍♀️'],
  '💂': ['💂', '💂🏻', '💂🏼', '💂🏽', '💂🏾', '💂🏿'],
  '🕵️‍♀️': ['🕵️‍♀️', '🕵🏻‍♀️', '🕵🏼‍♀️', '🕵🏽‍♀️', '🕵🏾‍♀️', '🕵🏿‍♀️'],
  '🕵️': ['🕵️', '🕵🏻', '🕵🏼', '🕵🏽', '🕵🏾', '🕵🏿'],
  '👩‍⚕️': ['👩‍⚕️', '👩🏻‍⚕️', '👩🏼‍⚕️', '👩🏽‍⚕️', '👩🏾‍⚕️', '👩🏿‍⚕️'],
  '👨‍⚕️': ['👨‍⚕️', '👨🏻‍⚕️', '👨🏼‍⚕️', '👨🏽‍⚕️', '👨🏾‍⚕️', '👨🏿‍⚕️'],
  '👩‍🌾': ['👩‍🌾', '👩🏻‍🌾', '👩🏼‍🌾', '👩🏽‍🌾', '👩🏾‍🌾', '👩🏿‍🌾'],
  '👨‍🌾': ['👨‍🌾', '👨🏻‍🌾', '👨🏼‍🌾', '👨🏽‍🌾', '👨🏾‍🌾', '👨🏿‍🌾'],
  '👩‍🍳': ['👩‍🍳', '👩🏻‍🍳', '👩🏼‍🍳', '👩🏽‍🍳', '👩🏾‍🍳', '👩🏿‍🍳'],
  '👨‍🍳': ['👨‍🍳', '👨🏻‍🍳', '👨🏼‍🍳', '👨🏽‍🍳', '👨🏾‍🍳', '👨🏿‍🍳'],
  '👩‍🎓': ['👩‍🎓', '👩🏻‍🎓', '👩🏼‍🎓', '👩🏽‍🎓', '👩🏾‍🎓', '👩🏿‍🎓'],
  '👨‍🎓': ['👨‍🎓', '👨🏻‍🎓', '👨🏼‍🎓', '👨🏽‍🎓', '👨🏾‍🎓', '👨🏿‍🎓'],
  '👩‍🎤': ['👩‍🎤', '👩🏻‍🎤', '👩🏼‍🎤', '👩🏽‍🎤', '👩🏾‍🎤', '👩🏿‍🎤'],
  '👨‍🎤': ['👨‍🎤', '👨🏻‍🎤', '👨🏼‍🎤', '👨🏽‍🎤', '👨🏾‍🎤', '👨🏿‍🎤'],
  '👩‍🏫': ['👩‍🏫', '👩🏻‍🏫', '👩🏼‍🏫', '👩🏽‍🏫', '👩🏾‍🏫', '👩🏿‍🏫'],
  '👨‍🏫': ['👨‍🏫', '👨🏻‍🏫', '👨🏼‍🏫', '👨🏽‍🏫', '👨🏾‍🏫', '👨🏿‍🏫'],
  '👩‍🏭': ['👩‍🏭', '👩🏻‍🏭', '👩🏼‍🏭', '👩🏽‍🏭', '👩🏾‍🏭', '👩🏿‍🏭'],
  '👨‍🏭': ['👨‍🏭', '👨🏻‍🏭', '👨🏼‍🏭', '👨🏽‍🏭', '👨🏾‍🏭', '👨🏿‍🏭'],
  '👩‍💻': ['👩‍💻', '👩🏻‍💻', '👩🏼‍💻', '👩🏽‍💻', '👩🏾‍💻', '👩🏿‍💻'],
  '👨‍💻': ['👨‍💻', '👨🏻‍💻', '👨🏼‍💻', '👨🏽‍💻', '👨🏾‍💻', '👨🏿‍💻'],
  '👩‍💼': ['👩‍💼', '👩🏻‍💼', '👩🏼‍💼', '👩🏽‍💼', '👩🏾‍💼', '👩🏿‍💼'],
  '👨‍💼': ['👨‍💼', '👨🏻‍💼', '👨🏼‍💼', '👨🏽‍💼', '👨🏾‍💼', '👨🏿‍💼'],
  '👩‍🔧': ['👩‍🔧', '👩🏻‍🔧', '👩🏼‍🔧', '👩🏽‍🔧', '👩🏾‍🔧', '👩🏿‍🔧'],
  '👨‍🔧': ['👨‍🔧', '👨🏻‍🔧', '👨🏼‍🔧', '👨🏽‍🔧', '👨🏾‍🔧', '👨🏿‍🔧'],
  '👩‍🔬': ['👩‍🔬', '👩🏻‍🔬', '👩🏼‍🔬', '👩🏽‍🔬', '👩🏾‍🔬', '👩🏿‍🔬'],
  '👨‍🔬': ['👨‍🔬', '👨🏻‍🔬', '👨🏼‍🔬', '👨🏽‍🔬', '👨🏾‍🔬', '👨🏿‍🔬'],
  '👩‍🎨': ['👩‍🎨', '👩🏻‍🎨', '👩🏼‍🎨', '👩🏽‍🎨', '👩🏾‍🎨', '👩🏿‍🎨'],
  '👨‍🎨': ['👨‍🎨', '👨🏻‍🎨', '👨🏼‍🎨', '👨🏽‍🎨', '👨🏾‍🎨', '👨🏿‍🎨'],
  '👩‍🚒': ['👩‍🚒', '👩🏻‍🚒', '👩🏼‍🚒', '👩🏽‍🚒', '👩🏾‍🚒', '👩🏿‍🚒'],
  '👨‍🚒': ['👨‍🚒', '👨🏻‍🚒', '👨🏼‍🚒', '👨🏽‍🚒', '👨🏾‍🚒', '👨🏿‍🚒'],
  '👩‍✈️': ['👩‍✈️', '👩🏻‍✈️', '👩🏼‍✈️', '👩🏽‍✈️', '👩🏾‍✈️', '👩🏿‍✈️'],
  '👨‍✈️': ['👨‍✈️', '👨🏻‍✈️', '👨🏼‍✈️', '👨🏽‍✈️', '👨🏾‍✈️', '👨🏿‍✈️'],
  '👩‍🚀': ['👩‍🚀', '👩🏻‍🚀', '👩🏼‍🚀', '👩🏽‍🚀', '👩🏾‍🚀', '👩🏿‍🚀'],
  '👨‍🚀': ['👨‍🚀', '👨🏻‍🚀', '👨🏼‍🚀', '👨🏽‍🚀', '👨🏾‍🚀', '👨🏿‍🚀'],
  '👩‍⚖️': ['👩‍⚖️', '👩🏻‍⚖️', '👩🏼‍⚖️', '👩🏽‍⚖️', '👩🏾‍⚖️', '👩🏿‍⚖️'],
  '👨‍⚖️': ['👨‍⚖️', '👨🏻‍⚖️', '👨🏼‍⚖️', '👨🏽‍⚖️', '👨🏾‍⚖️', '👨🏿‍⚖️'],
  '🤶': ['🤶', '🤶🏻', '🤶🏼', '🤶🏽', '🤶🏾', '🤶🏿'],
  '🎅': ['🎅', '🎅🏻', '🎅🏼', '🎅🏽', '🎅🏾', '🎅🏿'],
  '👸': ['👸', '👸🏻', '👸🏼', '👸🏽', '👸🏾', '👸🏿'],
  '🤴': ['🤴', '🤴🏻', '🤴🏼', '🤴🏽', '🤴🏾', '🤴🏿'],
  '👰': ['👰', '👰🏻', '👰🏼', '👰🏽', '👰🏾', '👰🏿'],
  '🤵 ': ['🤵', '🤵🏻', '🤵🏼', '🤵🏽', '🤵🏾', '🤵🏿']
};
const randomItem = array => array[Math.floor(Math.random() * array.length)];
const randomAvatar = () => randomItem([].concat(...Object.values(AVATARS)));

// TODO: work out where this should go
const CONFIG_FILE = '/tmp/toggl.json';
const config = (() => {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (_) {}
  }

  // Defaults
  return {
    avatar: randomAvatar()
  };
})();

// api token is that the bottom of the page
//          ->https://toggl.com/app/profile
// TODO: provide a UI to getting this and adding it if it's not setup
// TODO: store this in the correct config location so this file doesn't have to be edited
const API_TOKEN='';

const endOutput = () => {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));
  console.log('---');
  console.log('Refresh | refresh=true');
  process.exit();
};

if (!API_TOKEN) {
  console.log('🚨 token needed 🚨');
  console.log('---');
  console.log('Edit this file and fill in the API_TOKEN variable');
  console.log('Get your token from: https://toggl.com/app/profile');
  endOutput();
}

const NOW = new Date();

const unix = date => Math.round(date.getTime() / 1000);
const outputUnix = unixTime => {
  const fmt = x => x.toLocaleString(undefined, {minimumIntegerDigits: 2});
  const hours = Math.floor(unixTime / 60 / 60);
  const minutes = Math.floor(unixTime / 60) - (hours * 60);

  return `${hours}:${fmt(minutes)}`;
};

// TODO: alter this so you can pass the considered start day (ie Sunday or Monday)
//       Might as well be the offset integer, 0 or 1, but in theory could be 0-6
const startOfWeek = () => {
  const thisWeek = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - NOW.getDay());
  return unix(thisWeek);
};

const handleResponse = me => {
  // Calculate times
  const unixToday = unix(new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()));
  let full = 0,
      today = 0;
  let working = false;
  me.data.time_entries.forEach(entry => {
    // TODO: deal with partial entries that cross over midnight
    //       (both daily and weekly)
    // TODO: respect configured start of week in me.beginning_of_week
    // TODO: also calculate by project and display under jump
    // TODO: allow specific projects to be muted via the menu
    //       Muting them means they don't contribute to the day / week count
    //       They should still appear under the jump, but greyed out, with an option to enable them again

    let duration;
    if (entry.duration > 0) {
      duration = entry.duration;
    } else {
      duration = unix(NOW) - unix(new Date(entry.start));
      working = true;
    }

    full += duration;
    if (unix(new Date(entry.start)) > unixToday) {
      today += duration;
    }
  });

  // Output times
  if (!working) {
    process.exit(0);
  }

  console.log(`${config.avatar === 'avatar' ?  randomAvatar() : config.avatar} ${outputUnix(today)} (${outputUnix(full)})`);
};

const avatarChoice = () => {
  console.log('---');
  console.log(`Change ${config.avatar}`);
  console.log(`--((surprise me))|bash=${process.argv[1]} param1=avatar param2=avatar refresh=true terminal=false size=10`);
  Object.keys(AVATARS).forEach(k => {
    console.log(`--${k}|size=32`);
    AVATARS[k].forEach(v => {
      console.log(`----${v}|bash=${process.argv[1]} param1=avatar param2=${v} refresh=true terminal=false size=32`);
    });
  });
};

const input = () => {
  switch (process.argv[2]) {
    case 'avatar': {
      config.avatar = process.argv[3];
    }
  }
};

const output = () => {
  require('https').get({
    hostname: 'www.toggl.com',
    path: `/api/v8/me?with_related_data=true&since=${startOfWeek()}`,
    auth: `${API_TOKEN}:api_token`
  }, res => {
    let body = '';
    res.on('data', data => body += data);
    res.on('end', () => {
      try {
        handleResponse(JSON.parse(body));
        console.log('---');
        avatarChoice();
        endOutput();
      } catch (error) {
        console.log(':-(');
        console.log('---');
        console.log(error);
        endOutput();
      }
    });
    res.on('error', err => {
      console.log(':-(');
      console.log('---');
      console.log(err);
      endOutput();
    });
  });
};

input();
output();
