const moment = require('moment');

moment.locale('zh-tw');

// 0-7 這周內挑一天 (日期)
function getRandomWithRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 06-21 挑幾點 (小時)
function getRandomHour(min, max) {
  let randomDate = Math.floor(Math.random() * (max - min + 1)) + min;
  randomDate = randomDate.toString();
  return randomDate.padStart(2, '0');
}

// 00-50 挑分鐘 (10的倍數)
function getRandomMinute(max) {
  let minute = Math.floor(Math.random() * (max + 1));
  minute = minute.toString();
  return minute.padEnd(2, '0');
}

// 揪團活動時間
function getGroupDate() {
  const getDate = moment()
    .add(getRandomWithRange(0, 7), 'days')
    .format('YYYY-MM-DD');
  const getHour = getRandomHour(6, 21);
  const getMinute = getRandomMinute(5);
  return `${getDate} ${getHour}:${getMinute}:00`;
}

// 留言或評價時間
function getPastDate() {
  const getDate = moment()
    .subtract(getRandomWithRange(0, 3), 'days')
    .format('YYYY-MM-DD');
  const getHour = getRandomHour(0, 23);
  const getMinute = getRandomHour(0, 59);
  const getSecond = getRandomHour(0, 59);
  return `${getDate} ${getHour}:${getMinute}:${getSecond}`;
}

// 6 個使用者
const users = [
  {
    id: '1',
    provider: 'native',
    username: 'Timmy',
    email: 'timmy@gmail.com',
    password: 'Timmy123!',
    gender: '1',
    intro: '大家好，我是 Timmy，歡迎加入 PLAYONE 排球團，一起快樂打排球',
    county: '台北市',
    my_level: '0',
    my_level_description:
      '- 練系隊2年\n- 接發程度普普，最近瘋狂接噴\n- 攻擊成功率 30% (好常掛網好煩)\n- 打大砲攻擊要加強',
    fans: '5',
    follow: '5',
    position_1: '1',
    position_2: '3'
  },
  {
    id: '2',
    provider: 'native',
    username: 'Jenny',
    email: 'jenny@gmail.com',
    password: 'Jenny123!',
    gender: '0',
    intro: '大家好，我是 Jenny，歡迎加入 PLAYONE 排球團，一起快樂打排球',
    county: '台北市',
    my_level: '1',
    my_level_description:
      '- 練系隊2年\n- 接發程度普普，最近瘋狂接噴\n- 攻擊成功率 30% (好常掛網好煩)\n- 打大砲攻擊要加強',
    fans: '5',
    follow: '5',
    position_1: '0',
    position_2: '3'
  },
  {
    id: '3',
    provider: 'native',
    username: 'Test',
    email: 'test@gmail.com',
    password: 'Test123!',
    gender: '1',
    intro: '大家好，我是 Test，歡迎加入 PLAYONE 排球團，一起快樂打排球',
    county: '台北市',
    my_level: '2',
    my_level_description:
      '- 練系隊四年\n- 接發程度中上，偶爾接噴\n- 攻擊成功率 70%\n- 打攔中攻擊普普',
    fans: '5',
    follow: '5',
    position_1: '2',
    position_2: '3'
  },
  {
    id: '4',
    provider: 'native',
    username: 'David',
    email: 'david31009@gmail.com',
    password: 'David123!',
    gender: '1',
    intro: '大家好，我是 David，歡迎加入 PLAYONE 排球團，一起快樂打排球',
    county: '台北市',
    my_level: '3',
    my_level_description:
      '- 練校隊 3 年\n- 接發程度中上，偶爾接噴\n- 從小打校隊出生\n- 攻擊成功率 80%\n- 積極練習舉球中',
    fans: '5',
    follow: '5',
    position_1: '2',
    position_2: '4'
  },
  {
    id: '5',
    provider: 'native',
    username: 'Lisa',
    email: 'nccusaact16th@gmail.com',
    password: 'Lisa123!',
    gender: '0',
    intro: '大家好，我是 Lisa，歡迎加入 PLAYONE 排球團，一起快樂打排球',
    county: '台北市',
    my_level: '4',
    my_level_description:
      '- 練校隊 3 年\n- 接發程度中上，偶爾接噴\n- 從小打校隊出生\n- 攻擊成功率 80%\n- 積極練習舉球中',
    fans: '5',
    follow: '5',
    position_1: '1',
    position_2: '4'
  },
  {
    id: '6',
    provider: 'native',
    username: 'Mark',
    email: 'p66084104@gs.ncku.edu.tw',
    password: 'Mark123!',
    gender: '1',
    intro: '大家好，我是 Mark，歡迎加入 PLAYONE 排球團，一起快樂打排球',
    county: '台北市',
    my_level: '0',
    my_level_description:
      '- 練校隊 3 年\n- 接發程度中上，偶爾接噴\n- 從小打校隊出生\n- 攻擊成功率 80%\n- 積極練習舉球中',
    fans: '5',
    follow: '5',
    position_1: '3',
    position_2: '4'
  }
];

// 36 團 (1, 8, 15, 22, 29, 36 關團 % 7)
const groups = [
  // 1-6
  {
    creator_id: '1',
    title: '連假早起頭前團（他團同步徵人）',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市新莊區',
    place_description: '頭前國中',
    court: '0',
    is_charge: '1',
    money: '250',
    level: getRandomWithRange(0, 4),
    level_description: '社團強度：不跑戰術居多，系隊以上',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: '可以早點到暖身唷！',
    is_build: '0'
  },
  {
    creator_id: '2',
    title: '[徵女性臨打]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市萬華區',
    place_description: '華江國小4F活動中心',
    court: '0',
    is_charge: '1',
    money: '230',
    level: getRandomWithRange(0, 4),
    level_description: `※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。\n※ 來回多，球友友善包容，非歡樂場！`,
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: `(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※同步徵人中。`,
    is_build: '1'
  },
  {
    creator_id: '3',
    title: '揪臨打12人 內建12人',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市松山區',
    place_description: '敦化國中室外排球場',
    court: '1',
    is_charge: '0',
    money: '0',
    level: getRandomWithRange(0, 4),
    level_description: '社團強度：不跑戰術居多，系隊以上',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '場地特色：全日自然空調、水泥地板、附飲水機、廁所，視野好場地佳。\n機車可免費停校門口人行道。\n男網混排，24-30人制，連2勝下play1，有基礎攻防概念佳，氣氛歡樂。\n下雨流團，會在此文同步。\n有興趣的球友可以私訊或底下留言報名喔~他團同步徵人中，先搶先贏，額滿為止。',
    is_build: '1'
  },
  {
    creator_id: '4',
    title: '～徵臨打 5人 男女不拘～',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市板橋區',
    place_description: '板橋國中室內體育館',
    court: '0',
    is_charge: '1',
    money: '160',
    level: getRandomWithRange(0, 4),
    level_description:
      '※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。\n※ 來回多，球友友善包容，非歡樂場！',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '※在需求人數公告額滿後如不排候補者，還請幫忙在原留言串下取消。\n※1930前禁止進入校園\n※如出席有異動請幫忙提早告知\n※請跟警衛打招呼，表明來意，本場負責人:張大哥\n※如有生病發燒請勿入校，進校門須量額溫。\n※校區全面禁止吸菸，垃圾帶走\n※場地提供汽機車停車場、飲水機\n=為配合校園安全管制措施以下幾點務必留意並遵守=\n※活動開始後30分鐘，校門隨即關閉，校園即不得再任意進出\n※結束前10分鐘方可開放離校\n※活動結束後請於10分鐘之內離開校園\n~感謝各位的配合~如果有興趣的朋友，請於底下留言~',
    is_build: '1'
  },
  {
    creator_id: '5',
    title: '🏐誠徵臨打🏐',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市汐止區',
    place_description: '球魔方排球館',
    court: '0',
    is_charge: '1',
    money: '230',
    level: getRandomWithRange(0, 4),
    level_description: '會基本接發',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: '⚠️多團徵人確定補上會留言通知臨打',
    is_build: '1'
  },
  {
    creator_id: '6',
    title: '[徵女性臨打]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市萬華區',
    place_description: '華江國小4F活動中心',
    court: '0',
    is_charge: '1',
    money: '190',
    level: getRandomWithRange(0, 4),
    level_description:
      '※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※ 同步徵人中。',
    is_build: '1'
  },
  // 7-12
  {
    creator_id: '1',
    title: '#誠徵臨打 #美女們快來😍',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '桃園市龜山區',
    place_description: '貓球俱樂部',
    court: '0',
    is_charge: '1',
    money: '320',
    level: getRandomWithRange(0, 4),
    level_description:
      '※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '*學生 醫療體系 林口龜山居民200元 \n*他團同步徵人\n*備有汽車停車位及機車停車棚\n(如果搭捷運公車來的館主可以去接唷 還有送搭車❤)\n(還有親人貓咪吸到飽❤️)\n(大家都有來有往很好玩🏐）',
    is_build: '1'
  },
  {
    creator_id: '2',
    title: '徵球友!!!',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市土城區',
    place_description: '612排球星球+',
    court: '0',
    is_charge: '1',
    money: '260',
    level: getRandomWithRange(0, 4),
    level_description: '需一定基礎，非新手場',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: '揪滿三隊就好，有要來碰碰球的，底下留言唷，感謝!',
    is_build: '0'
  },
  {
    creator_id: '3',
    title: '預報 好天氣 打球唷 ',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市中正區',
    place_description: '中正國中',
    court: '1',
    is_charge: '0',
    money: '0',
    level: getRandomWithRange(0, 4),
    level_description: '有基本接發、扣球，有來回',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '隊伍：18人制，打二休一\n意者請留言或私訊我喔🥳\n請救救我🧎‍♀️',
    is_build: '1'
  },
  {
    creator_id: '4',
    title: '徵 臨打6名，男女不拘',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市內湖區',
    place_description: '南湖運動中心',
    court: '0',
    is_charge: '1',
    money: '0',
    level: getRandomWithRange(0, 4),
    level_description: '需有穩定的基本動作與處理球的能力，友善但非歡樂場',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '本場為混排，需有穩定的基本動作與處理球的能力，友善但非歡樂場。\n若默契配合得宜，歡迎加入季打。\n他團同步徵人，意者請留言，歡迎來打球～',
    is_build: '1'
  },
  {
    creator_id: '5',
    title: '[🏐徵女網混排臨打🏐]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市萬華區',
    place_description: '華江高中體育館2樓',
    court: '0',
    is_charge: '1',
    money: '200',
    level: getRandomWithRange(0, 4),
    level_description: '社團強度：不跑戰術居多，系隊以上',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '賽制：女網混排打二休一、上限18人\n器材：MVA200或MVA300、記分板、飲水機\n註：此為混排，男性名額優先給同時報名女性者補滿女性，且由於在多版徵人，請以原po回覆為準，經回覆者亦請勿任意退出，還請協助配合，感恩感恩！🙏',
    is_build: '1'
  },
  {
    creator_id: '6',
    title: '[徵人]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市南港區',
    place_description: '南港中研院體育館三樓',
    court: '0',
    is_charge: '1',
    money: '200',
    level: getRandomWithRange(0, 4),
    level_description: '希望報名者有基本程度 懂攻防 會站位',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '賽制：打兩局，休一局\n環境：木質地板、飲水機、廁所、空調\n全木質地板，場地寬敞舒適\n 發球區超過6米+可以充分發揮你的發球技巧\n天花板高度也非常高👍\n球場旁邊也還有熱身的空間喔\n重點是…門口直接是捷運站🚈\n開車的朋友也很方便！交流道一下來就到啦\n運動中心也備有地下停車場\n交通、停車都非常方便喔\n強力推薦👍👍👍👍👍👍\n可以舒舒服服打球的好場地',
    is_build: '1'
  },
  // 13-18
  {
    creator_id: '1',
    title: '連假早起頭前團（他團同步徵人）',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市新莊區',
    place_description: '頭前國中',
    court: '0',
    is_charge: '1',
    money: '250',
    level: getRandomWithRange(0, 4),
    level_description: '社團強度：不跑戰術居多，系隊以上',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: '可以早點到暖身唷！',
    is_build: '1'
  },
  {
    creator_id: '2',
    title: '[徵女性臨打]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市萬華區',
    place_description: '華江國小4F活動中心',
    court: '0',
    is_charge: '1',
    money: '230',
    level: getRandomWithRange(0, 4),
    level_description: `※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。\n※ 來回多，球友友善包容，非歡樂場！`,
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: `(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※同步徵人中。`,
    is_build: '1'
  },
  {
    creator_id: '3',
    title: '揪臨打12人 內建12人',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市松山區',
    place_description: '敦化國中室外排球場',
    court: '1',
    is_charge: '0',
    money: '0',
    level: getRandomWithRange(0, 4),
    level_description: '社團強度：不跑戰術居多，系隊以上',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '場地特色：全日自然空調、水泥地板、附飲水機、廁所，視野好場地佳。\n機車可免費停校門口人行道。\n男網混排，24-30人制，連2勝下play1，有基礎攻防概念佳，氣氛歡樂。\n下雨流團，會在此文同步。\n有興趣的球友可以私訊或底下留言報名喔~他團同步徵人中，先搶先贏，額滿為止。',
    is_build: '0'
  },
  {
    creator_id: '4',
    title: '～徵臨打 5人 男女不拘～',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市板橋區',
    place_description: '板橋國中室內體育館',
    court: '0',
    is_charge: '1',
    money: '160',
    level: getRandomWithRange(0, 4),
    level_description:
      '※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。\n※ 來回多，球友友善包容，非歡樂場！',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '※在需求人數公告額滿後如不排候補者，還請幫忙在原留言串下取消。\n※1930前禁止進入校園\n※如出席有異動請幫忙提早告知\n※請跟警衛打招呼，表明來意，本場負責人:張大哥\n※如有生病發燒請勿入校，進校門須量額溫。\n※校區全面禁止吸菸，垃圾帶走\n※場地提供汽機車停車場、飲水機\n=為配合校園安全管制措施以下幾點務必留意並遵守=\n※活動開始後30分鐘，校門隨即關閉，校園即不得再任意進出\n※結束前10分鐘方可開放離校\n※活動結束後請於10分鐘之內離開校園\n~感謝各位的配合~如果有興趣的朋友，請於底下留言~',
    is_build: '1'
  },
  {
    creator_id: '5',
    title: '🏐誠徵臨打🏐',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市汐止區',
    place_description: '球魔方排球館',
    court: '0',
    is_charge: '1',
    money: '230',
    level: getRandomWithRange(0, 4),
    level_description: '會基本接發',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: '⚠️多團徵人確定補上會留言通知臨打',
    is_build: '1'
  },
  {
    creator_id: '6',
    title: '[徵女性臨打]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市萬華區',
    place_description: '華江國小4F活動中心',
    court: '0',
    is_charge: '1',
    money: '190',
    level: getRandomWithRange(0, 4),
    level_description:
      '※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※ 同步徵人中。',
    is_build: '1'
  },
  // 19-24
  {
    creator_id: '1',
    title: '#誠徵臨打 #美女們快來😍',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '桃園市龜山區',
    place_description: '貓球俱樂部',
    court: '0',
    is_charge: '1',
    money: '320',
    level: getRandomWithRange(0, 4),
    level_description:
      '※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '*學生 醫療體系 林口龜山居民200元 \n*他團同步徵人\n*備有汽車停車位及機車停車棚\n(如果搭捷運公車來的館主可以去接唷 還有送搭車❤)\n(還有親人貓咪吸到飽❤️)\n(大家都有來有往很好玩🏐）',
    is_build: '1'
  },
  {
    creator_id: '2',
    title: '徵球友!!!',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市土城區',
    place_description: '612排球星球+',
    court: '0',
    is_charge: '1',
    money: '260',
    level: getRandomWithRange(0, 4),
    level_description: '需一定基礎，非新手場',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: '揪滿三隊就好，有要來碰碰球的，底下留言唷，感謝!',
    is_build: '1'
  },
  {
    creator_id: '3',
    title: '預報 好天氣 打球唷 ',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市中正區',
    place_description: '中正國中',
    court: '1',
    is_charge: '0',
    money: '0',
    level: getRandomWithRange(0, 4),
    level_description: '有基本接發、扣球，有來回',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '隊伍：18人制，打二休一\n意者請留言或私訊我喔🥳\n請救救我🧎‍♀️',
    is_build: '1'
  },
  {
    creator_id: '4',
    title: '徵 臨打6名，男女不拘',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市內湖區',
    place_description: '南湖運動中心',
    court: '0',
    is_charge: '1',
    money: '0',
    level: getRandomWithRange(0, 4),
    level_description: '需有穩定的基本動作與處理球的能力，友善但非歡樂場',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '本場為混排，需有穩定的基本動作與處理球的能力，友善但非歡樂場。\n若默契配合得宜，歡迎加入季打。\n他團同步徵人，意者請留言，歡迎來打球～',
    is_build: '0'
  },
  {
    creator_id: '5',
    title: '[🏐徵女網混排臨打🏐]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市萬華區',
    place_description: '華江高中體育館2樓',
    court: '0',
    is_charge: '1',
    money: '200',
    level: getRandomWithRange(0, 4),
    level_description: '社團強度：不跑戰術居多，系隊以上',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '賽制：女網混排打二休一、上限18人\n器材：MVA200或MVA300、記分板、飲水機\n註：此為混排，男性名額優先給同時報名女性者補滿女性，且由於在多版徵人，請以原po回覆為準，經回覆者亦請勿任意退出，還請協助配合，感恩感恩！🙏',
    is_build: '1'
  },
  {
    creator_id: '6',
    title: '[徵人]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市南港區',
    place_description: '南港中研院體育館三樓',
    court: '0',
    is_charge: '1',
    money: '200',
    level: getRandomWithRange(0, 4),
    level_description: '希望報名者有基本程度 懂攻防 會站位',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '賽制：打兩局，休一局\n環境：木質地板、飲水機、廁所、空調\n全木質地板，場地寬敞舒適\n 發球區超過6米+可以充分發揮你的發球技巧\n天花板高度也非常高👍\n球場旁邊也還有熱身的空間喔\n重點是…門口直接是捷運站🚈\n開車的朋友也很方便！交流道一下來就到啦\n運動中心也備有地下停車場\n交通、停車都非常方便喔\n強力推薦👍👍👍👍👍👍\n可以舒舒服服打球的好場地',
    is_build: '1'
  },
  // 25-30
  {
    creator_id: '1',
    title: '連假早起頭前團（他團同步徵人）',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市新莊區',
    place_description: '頭前國中',
    court: '0',
    is_charge: '1',
    money: '250',
    level: getRandomWithRange(0, 4),
    level_description: '社團強度：不跑戰術居多，系隊以上',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: '可以早點到暖身唷！',
    is_build: '1'
  },
  {
    creator_id: '2',
    title: '[徵女性臨打]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市萬華區',
    place_description: '華江國小4F活動中心',
    court: '0',
    is_charge: '1',
    money: '230',
    level: getRandomWithRange(0, 4),
    level_description: `※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。\n※ 來回多，球友友善包容，非歡樂場！`,
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: `(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※同步徵人中。`,
    is_build: '1'
  },
  {
    creator_id: '3',
    title: '揪臨打12人 內建12人',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市松山區',
    place_description: '敦化國中室外排球場',
    court: '1',
    is_charge: '0',
    money: '0',
    level: getRandomWithRange(0, 4),
    level_description: '社團強度：不跑戰術居多，系隊以上',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '場地特色：全日自然空調、水泥地板、附飲水機、廁所，視野好場地佳。\n機車可免費停校門口人行道。\n男網混排，24-30人制，連2勝下play1，有基礎攻防概念佳，氣氛歡樂。\n下雨流團，會在此文同步。\n有興趣的球友可以私訊或底下留言報名喔~他團同步徵人中，先搶先贏，額滿為止。',
    is_build: '1'
  },
  {
    creator_id: '4',
    title: '～徵臨打 5人 男女不拘～',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市板橋區',
    place_description: '板橋國中室內體育館',
    court: '0',
    is_charge: '1',
    money: '160',
    level: getRandomWithRange(0, 4),
    level_description:
      '※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。\n※ 來回多，球友友善包容，非歡樂場！',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '※在需求人數公告額滿後如不排候補者，還請幫忙在原留言串下取消。\n※1930前禁止進入校園\n※如出席有異動請幫忙提早告知\n※請跟警衛打招呼，表明來意，本場負責人:張大哥\n※如有生病發燒請勿入校，進校門須量額溫。\n※校區全面禁止吸菸，垃圾帶走\n※場地提供汽機車停車場、飲水機\n=為配合校園安全管制措施以下幾點務必留意並遵守=\n※活動開始後30分鐘，校門隨即關閉，校園即不得再任意進出\n※結束前10分鐘方可開放離校\n※活動結束後請於10分鐘之內離開校園\n~感謝各位的配合~如果有興趣的朋友，請於底下留言~',
    is_build: '1'
  },
  {
    creator_id: '5',
    title: '🏐誠徵臨打🏐',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市汐止區',
    place_description: '球魔方排球館',
    court: '0',
    is_charge: '1',
    money: '230',
    level: getRandomWithRange(0, 4),
    level_description: '會基本接發',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: '⚠️多團徵人確定補上會留言通知臨打',
    is_build: '0'
  },
  {
    creator_id: '6',
    title: '[徵女性臨打]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市萬華區',
    place_description: '華江國小4F活動中心',
    court: '0',
    is_charge: '1',
    money: '190',
    level: getRandomWithRange(0, 4),
    level_description:
      '※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '(如果臨打程度及球風可適應，歡迎加入固定臨打人員或之後季打甚至是主揪其他場地。)\n※ 同步徵人中。',
    is_build: '1'
  },
  // 31-36
  {
    creator_id: '1',
    title: '#誠徵臨打 #美女們快來😍',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '桃園市龜山區',
    place_description: '貓球俱樂部',
    court: '0',
    is_charge: '1',
    money: '320',
    level: getRandomWithRange(0, 4),
    level_description:
      '※ 程度中上者佳，須有穩定接發接扣防守站位觀念及攻擊能力。來回多，球友友善包容，非歡樂場！',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '*學生 醫療體系 林口龜山居民200元 \n*他團同步徵人\n*備有汽車停車位及機車停車棚\n(如果搭捷運公車來的館主可以去接唷 還有送搭車❤)\n(還有親人貓咪吸到飽❤️)\n(大家都有來有往很好玩🏐）',
    is_build: '1'
  },
  {
    creator_id: '2',
    title: '徵球友!!!',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '新北市土城區',
    place_description: '612排球星球+',
    court: '0',
    is_charge: '1',
    money: '260',
    level: getRandomWithRange(0, 4),
    level_description: '需一定基礎，非新手場',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description: '揪滿三隊就好，有要來碰碰球的，底下留言唷，感謝!',
    is_build: '1'
  },
  {
    creator_id: '3',
    title: '預報 好天氣 打球唷 ',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市中正區',
    place_description: '中正國中',
    court: '1',
    is_charge: '0',
    money: '0',
    level: getRandomWithRange(0, 4),
    level_description: '有基本接發、扣球，有來回',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '隊伍：18人制，打二休一\n意者請留言或私訊我喔🥳\n請救救我🧎‍♀️',
    is_build: '1'
  },
  {
    creator_id: '4',
    title: '徵 臨打6名，男女不拘',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市內湖區',
    place_description: '南湖運動中心',
    court: '0',
    is_charge: '1',
    money: '0',
    level: getRandomWithRange(0, 4),
    level_description: '需有穩定的基本動作與處理球的能力，友善但非歡樂場',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '本場為混排，需有穩定的基本動作與處理球的能力，友善但非歡樂場。\n若默契配合得宜，歡迎加入季打。\n他團同步徵人，意者請留言，歡迎來打球～',
    is_build: '1'
  },
  {
    creator_id: '5',
    title: '[🏐徵女網混排臨打🏐]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市萬華區',
    place_description: '華江高中體育館2樓',
    court: '0',
    is_charge: '1',
    money: '200',
    level: getRandomWithRange(0, 4),
    level_description: '社團強度：不跑戰術居多，系隊以上',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '賽制：女網混排打二休一、上限18人\n器材：MVA200或MVA300、記分板、飲水機\n註：此為混排，男性名額優先給同時報名女性者補滿女性，且由於在多版徵人，請以原po回覆為準，經回覆者亦請勿任意退出，還請協助配合，感恩感恩！🙏',
    is_build: '1'
  },
  {
    creator_id: '6',
    title: '[徵人]',
    date: getGroupDate(),
    time_duration: 30 * getRandomWithRange(2, 12),
    net: getRandomWithRange(0, 1),
    place: '台北市南港區',
    place_description: '南港中研院體育館三樓',
    court: '0',
    is_charge: '1',
    money: '200',
    level: getRandomWithRange(0, 4),
    level_description: '希望報名者有基本程度 懂攻防 會站位',
    people_have: getRandomWithRange(1, 18),
    people_need: '7',
    people_left: getRandomWithRange(1, 18),
    group_description:
      '賽制：打兩局，休一局\n環境：木質地板、飲水機、廁所、空調\n全木質地板，場地寬敞舒適\n 發球區超過6米+可以充分發揮你的發球技巧\n天花板高度也非常高👍\n球場旁邊也還有熱身的空間喔\n重點是…門口直接是捷運站🚈\n開車的朋友也很方便！交流道一下來就到啦\n運動中心也備有地下停車場\n交通、停車都非常方便喔\n強力推薦👍👍👍👍👍👍\n可以舒舒服服打球的好場地',
    is_build: '0'
  }
];

// 每團 5 人報名 (主揪不能報名自己的團)
const members = [];
for (let i = 1; i < 7; i++) {
  for (let j = 1; j < 37; j++) {
    // 主揪不能報名自己的團
    if (j % 6 !== i % 6) {
      let member = {};
      if (j % 7 === 1) {
        // 關團的，其他人一定要報名成功 (除了主揪)
        member = {
          user_id: i,
          group_id: j,
          signup_status: 1
        };
      } else {
        member = {
          user_id: i,
          group_id: j,
          signup_status: getRandomWithRange(0, 2)
        };
      }

      members.push(member);
    }
  }
}

// 報名成功且關團者 (主揪不能評價自己的團)
const commentTemplate = [
  '主揪人超讚的，希望下次還可以再參加',
  '第二次參加團了，真的好讚~~新人友善喔',
  '人 nice 又會打球!!',
  '大腿啊 !! 有一球差點被打到臉，還好他幫我擋掉了',
  '太謙虛啦，明明很猛~~',
  '在場上有點嚴肅，但私底下人還是蠻好的',
  '打球氣氛很好'
];
const comments = [];
for (let i = 1; i < 37; i++) {
  for (let j = 1; j < 7; j++) {
    let comment = {};
    if (i % 7 === 1) {
      if (j % 6 !== i % 6) {
        let userId = i % 6;
        if (i % 6 === 0) userId = 6;
        comment = {
          user_id: userId,
          commenter_id: j,
          group_id: i,
          score: getRandomWithRange(1, 5),
          content: commentTemplate[getRandomWithRange(0, 6)],
          date: getPastDate()
        };
        comments.push(comment);
      }
    }
  }
}

// 留言板
const messages = [];
const messageTemplate = [
  '請問還有名額嗎?',
  '今天天氣真好!!',
  '<3',
  '好期待喔',
  '下雨有備案嗎',
  '還有缺喔',
  '+1'
];
for (let i = 0; i < 300; i++) {
  const message = {
    user_id: getRandomWithRange(1, 6),
    group_id: getRandomWithRange(1, 36),
    content: messageTemplate[getRandomWithRange(0, 6)],
    time: getPastDate()
  };
  messages.push(message);
}

// 追蹤
const fans = [];
for (let i = 1; i < 7; i++) {
  for (let j = 1; j < 7; j++) {
    if (i !== j) {
      const fan = {
        user_id: i,
        follow_id: j
      };
      fans.push(fan);
    }
  }
}

module.exports = {
  users,
  groups,
  members,
  comments,
  messages,
  fans
};
