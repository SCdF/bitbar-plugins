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

const CONFIG_FILE = `${process.env.HOME}/.toggl.json`;

let configDirty = false;
const config = (() => {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (_) {}
  }

  // Defaults
  configDirty = true;
  return {
    avatar: randomAvatar(),
    hoursInDay: 8,
    daysInWeek: 5,
    style: 'hours'
  };
})();

const endOutput = () => {
  if (configDirty) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  }

  console.log('---');
  console.log('Refresh | refresh=true');
  process.exit();
};

const badApiToken = wrong => {
  console.log(`🚨 ${wrong ? 'provided api token is wrong' : 'token needed'} 🚨`);
  console.log('---');
  console.log('🖱 Click here to find your token| href=https://toggl.com/app/profile');
  console.log('It will be at the bottom of the page|size=12');
  console.log(`Once you've found your token, copy it (CMD+C)|size=12`);
  console.log(`🤞 I've copied it 🤞|bash=${process.argv[1]} param1=api_token refresh=true terminal=false `);
  endOutput();
};

const NOW = new Date();

const unix = date => Math.round(date.getTime() / 1000);
const outputUnix = unixTime => {
  const negative = (() => {if (unixTime < 0) {
    unixTime *= -1;
    return true;
  }})();

  const fmt = x => x.toLocaleString(undefined, {minimumIntegerDigits: 2});
  const hours = Math.floor(unixTime / 60 / 60);
  const minutes = Math.floor(unixTime / 60) - (hours * 60);

  return `${negative ? '-' : ''}${hours}:${fmt(minutes)}`;
};

// TODO: alter this so you can pass the considered start day (ie Sunday or Monday)
//       Might as well be the offset integer, 0 or 1, but in theory could be 0-6
const startOfWeek = () => {
  const thisWeek = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - NOW.getDay());
  return unix(thisWeek);
};

const avatar = () => config.avatar === 'avatar' ?  randomAvatar() : config.avatar;

const outputHeader = (timeDay, timeWeek) => {
  const relativeThreshold = 60 * 60; // TODO: configurable?

  let daySection; // Output string
  let dayAmount; // single amount, if possible
  if (typeof timeDay === 'object') {
    const max = Math.max(...timeDay);
    const min = Math.min(...timeDay);
    if ((max - min) > relativeThreshold) {
      daySection = `${outputUnix(max)}->${outputUnix(min)}`;
    } else {
      dayAmount = min + Math.round((max - min) / 2);
      daySection = `${outputUnix(dayAmount)}`;
    }
  } else {
    dayAmount = timeDay;
    daySection = `${outputUnix(dayAmount)}`;
  }

  if (dayAmount && Math.abs(timeWeek - dayAmount) > relativeThreshold) {
    console.log(`${avatar()} ${daySection} (${outputUnix(timeWeek)})`);
  } else {
    console.log(`${avatar()} ${daySection}`);
  }
};

const handleResponse = me => {
  // Calculate times
  const unixToday = unix(new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate()));
  let full = 0,
      today = 0;
  let currentlyWorking = false;
  (me.data.time_entries || []).forEach(entry => {
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
      currentlyWorking = true;
    }

    if (unix(new Date(entry.start)) > startOfWeek()) {
      full += duration;
    }

    if (unix(new Date(entry.start)) > unixToday) {
      today += duration;
    }
  });

  // Output times
  if (!currentlyWorking) {
    process.exit(0);
  }

  switch(config.style) {
    case 'hours': {
      outputHeader(today, full);
      break;
    }
    case 'left': {
      const completeDay = config.hoursInDay * 60 * 60;
      const completeWeek = completeDay * config.daysInWeek;

      outputHeader(completeDay - today, completeWeek - full);
      break;
    }
    case 'percentage': {
      const completeDay = config.hoursInDay * 60 * 60;
      const completeWeek = completeDay * config.daysInWeek;
      const dayPercent = Math.round((today / completeDay) * 100);
      const weekPercent = Math.round((full / completeWeek) * 100);
      console.log(`${avatar()} ${dayPercent}% (${weekPercent}%)`);
      break;
    }
    case 'relative': {
      const startOfWeekday = 1; // TODO: support using configured day from /me
      const todayWeekday = NOW.getDay();
      const daysLeft = config.daysInWeek - (todayWeekday - startOfWeekday);

      const timeInWeek = config.daysInWeek * config.hoursInDay * 60 * 60;

      const allButTodaysTime = full - today;
      const allButTodaysTimeLeft = timeInWeek - allButTodaysTime;
      const timePerDayLeft = Math.round(allButTodaysTimeLeft / daysLeft);
      const amortisedTimeLeft = timePerDayLeft - today;

      const onTrackTime = (daysLeft - 1) * config.hoursInDay * 60 * 60;
      const timeOffTrack = allButTodaysTimeLeft - onTrackTime - today;

      outputHeader([amortisedTimeLeft, timeOffTrack], timeInWeek - full);
      break;
    }
  }
};

const avatarChoice = () => {
  console.log(`Change ${config.avatar}`);
  console.log(`--((surprise me))|bash=${process.argv[1]} param1=avatar param2=avatar refresh=true terminal=false size=10`);
  Object.keys(AVATARS).forEach(k => {
    console.log(`--${k}|size=32`);
    AVATARS[k].forEach(v => {
      console.log(`----${v}|bash=${process.argv[1]} param1=avatar param2=${v} refresh=true terminal=false size=32`);
    });
  });
};

const styleChoice = () => {
  const current = style => style === config.style ? '✓ ' : '';
  const link = style => `|bash=${process.argv[1]} param1=style param2=${style} refresh=true terminal=false`;
  console.log('Change reporting style');
  console.log(`--${current('hours')}Hours complete${link('hours')}`);
  console.log(`--${current('left')}Hours left${link('left')}`);
  console.log(`--${current('percentage')}Percentage complete${link('percentage')}`);
  console.log(`--${current('relative')}Relative weekly goals${link('relative')}`);
};

const input = () => {
  switch (process.argv[2]) {
    case 'avatar': {
      config.avatar = process.argv[3];
      configDirty = true;
      break;
    }
    case 'api_token': {
      config.apiToken = require('child_process').execSync('pbpaste').toString();
      configDirty = true;
      break;
    }
    case 'style': {
      config.style = process.argv[3];
      configDirty = true;
      break;
    }
  }
};

const output = () => {
  require('https').get({
    hostname: 'www.toggl.com',
    // NB: since is "edited since", and so isn't really reliable
    path: `/api/v8/me?with_related_data=true&since=${startOfWeek()}`,
    auth: `${config.apiToken}:api_token`
  }, res => {
    if (res.statusCode === 403) {
      badApiToken(true);
      endOutput();
    }

    let body = '';
    res.on('data', data => body += data);
    res.on('end', () => {
      try {
        handleResponse(JSON.parse(body));
        console.log('---');
        avatarChoice();
        styleChoice();
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
if (!config.apiToken) {
  badApiToken();
}
output();
