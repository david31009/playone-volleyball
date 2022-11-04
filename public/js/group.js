// 確認 user 身分，從 local storage 拿
const userId = 2;

// 渲染某團詳細資料
(async () => {
  // 抓網址的 query string (?id=21)
  const url = new URL(window.location.href);
  const id = url.search;

  // 打 group details API
  const detail = await axios.get(`/api/1.0/group/details${id}`);
  [groupDetail] = detail.data.result;

  // 打報名狀態 API
  const signupStatus = await axios.post(`/api/1.0/signup/status`, {
    userId: userId,
    groupId: id.split('=')[1],
  });
  const [status] = signupStatus.data.result;

  $('.card-title').html(`${groupDetail.title}`);
  $('.group-detail-net').html(`網高: ${groupDetail.net[1]}`);
  $('.group-detail-date').html(`日期: ${groupDetail.date}`);
  $('.group-detail-time').html(`網高: ${groupDetail.net[1]}`);
  $('.group-detail-place').html(`地點: ${groupDetail.place}`);
  $('.group-detail-place-des').html(
    `詳細地點: ${groupDetail.placeDescription}`
  );
  $('.group-detail-group-level').html(`程度: ${groupDetail.groupLevel[1]}`);
  $('.group-detail-time-duration').html(
    `可以打: ${groupDetail.timeDuration} 小時`
  );
  $('.group-detail-money').html(`費用: ${groupDetail.money} 元`);
  $('.group-detail-people-left').html(
    `報名剩餘名額: ${groupDetail.peopleLeft} 人`
  );

  // 確認使用者報名狀態
  if (status == undefined) {
    // 還沒報名過
    $('#signup').html(`報名`);
  } else {
    $('#signup').html(`${status.signupStatus[1]}`);
    $('#signup').prop('disabled', true);
  }
  $('#edit').html(`編輯表單`);
  $('.group-detail-creator').html(`主揪: ${groupDetail.username}`);

  // if user = 主揪 => edit
  //else => view
  if (groupDetail.creatorId === userId) {
    $('#edit').show();
    $('#signup').hide();
  } else {
    $('#edit').hide();
    $('#signup').show();
  }
})();

// 彈出編輯表單
async function edit() {
  $('#background-pop').show();

  // 先渲染下拉式選單選項
  for (let i = 0.5; i < 6.5; i += 0.5) {
    $('#time-duration').append(
      $('<option>', {
        value: i,
        text: i,
      })
    );
  }
  for (let i = 1; i < 19; i++) {
    $('#people-have').append(
      $('<option>', {
        value: i,
        text: i,
      })
    );
    $('#people-need').append(
      $('<option>', {
        value: i,
        text: i,
      })
    );
  }

  // 抓之前主揪填寫的資料，填入 value 值
  const url = new URL(window.location.href);
  const id = url.search;
  const detail = await axios.get(`/api/1.0/group/details${id}`);
  [groupDetail] = detail.data.result;

  $('#title').val(`${groupDetail.title}`);
  $('#date').val(`${groupDetail.date}`);
  $('#time').val(`${groupDetail.time}`);
  $('#time-duration').val(`${groupDetail.timeDuration}`);
  $('#net').val(`${groupDetail.net[0]}`);
  $('#place-description').val(`${groupDetail.placeDescription}`);
  $('#court').val(`${groupDetail.court[0]}`);
  $('#money').val(`${groupDetail.money}`);
  $('#level').val(`${groupDetail.groupLevel[0]}`);
  $('textarea#level-description').val(`${groupDetail.groupLevelDescription}`);
  $('#people-have').val(`${groupDetail.peopleHave}`);
  $('#people-need').val(`${groupDetail.peopleNeed}`);
  $('textarea#group-description').val(`${groupDetail.groupDescription}`);

  // 選擇台灣、地區
  new TwCitySelector({
    el: '.tw-city-selector',
    elCounty: '.county', // 在 el 裡查找 element
    elDistrict: '.district', // 在 el 裡查找 element
    countyFieldName: '縣市', // 該欄位的 name
    districtFieldName: '區域', // 該欄位的 name
    countyValue: `${groupDetail.place.slice(0, 3)}`, // 預設 value
    districtValue: `${groupDetail.place.slice(3, 10)}`, // 預設 value
  });
}

// 儲存編輯表單
$('#save').click(async (e) => {
  e.preventDefault();
  const url = new URL(window.location.href);
  const id = url.search;

  let updateInfo = {
    groupId: id.split('=')[1],
    title: $('#title').val(),
    date: $('#date').val(),
    time: $('#time').val(),
    timeDuration: $('#time-duration').val(),
    net: $('#net').val(),
    county: $('#county').val(),
    district: $('#district').val(),
    placeDescription: $('#place-description').val(),
    court: $('#court').val(),
    money: $('#money').val(),
    level: $('#level').val(),
    levelDescription: $('#level-description').val(),
    peopleHave: $('#people-have').val(),
    peopleNeed: $('#people-need').val(),
    groupDescription: $('#group-description').val(),
  };

  // 使用者未填欄位，發出 alert
  let OK = true;
  $('input, textarea, select')
    .filter('[required]') // 找出有 required 的屬性
    .each((i, requiredField) => {
      if (!$(requiredField).val()) {
        OK = false;
        alert(`請輸入 "${$(requiredField).attr('name')}" 欄位`);
        return false; // break
      }
    });

  // 更新資料庫表單
  if (OK) {
    await axios.post('/api/1.0/update/group', updateInfo);
  }
});

// 編輯彈窗按鈕
$('#close-button').click(() => {
  $('#background-pop').hide();
});

$(window).click((e) => {
  if (e.target.id === 'background-pop') {
    $('#background-pop').hide();
  }
});

// 報名揪團
$('#signup').click(async () => {
  // 抓網址的 query string (?id=21)
  const url = new URL(window.location.href);
  const id = url.search;

  signupInfo = {
    groupId: id.split('=')[1],
    userId: userId,
    signupStatus: 0,
  };

  await axios.post('/api/1.0/signup/group', signupInfo);

  // 報名成功按鈕顯示
  $('button[id*=signup]').html('報名待確認');
  // 按鈕不能再點擊
  $('#signup').prop('disabled', true);
});
