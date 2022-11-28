// 抓網址 groupId (?id=21)
const url = new URL(window.location.href);
const id = url.search;
const idSplit = id.split('=')[1];

// 隱藏篩選區塊
$('#card-group').hide();

// 訪客
let userId;

// 渲染某團詳細資料
(async () => {
  // 打 group details API
  let detail;
  try {
    detail = await axios.get(`/api/1.0/group/details${id}`);
  } catch {
    window.location.href = '/index.html';
  }

  const [groupDetail] = detail.data.result;

  // 確認使用者是誰，顯示不同按鈕 (主揪 => edit，使用者、訪客 => view)
  let user;
  try {
    user = await axios.get('/api/1.0/user/profile', {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    });
    userId = user.data.userId;
  } catch {
    userId = -1; // 訪客
  }

  // 打報名狀態 API
  const signupStatus = await axios.post('/api/1.0/signup/status', {
    userId,
    groupId: idSplit
  });
  const [status] = signupStatus.data.result;

  // 打顯示留言 API
  const msg = await axios.get(`/api/1.0/msg${id}`);
  const allMsg = msg.data.result;

  // 打報名者的 APT 給主揪確認
  const members = await axios.get(`/api/1.0/member${id}`);
  const signupMembers = members.data.result;

  // 渲染揪團細節
  $('.group-detail-card-title').html(`${groupDetail.title}`);
  $('.group-detail-net').html(`#${groupDetail.net[1]}`);
  $('.group-detail-date').html(`📅 ${groupDetail.date}`);
  $('.group-detail-time').html(`${groupDetail.time}`);
  $('.group-detail-place').html(`📍 ${groupDetail.place}`);
  $('.group-detail-place-des').html(`${groupDetail.placeDescription}`);
  $('.group-detail-place-des').attr(
    'href',
    `https://www.google.com.tw/maps/search/${groupDetail.placeDescription}`
  );

  $('.group-detail-group-level').html(`#${groupDetail.groupLevel[1]}程度`);
  $('.group-detail-group-level-description').html(
    `${groupDetail.groupLevelDescription}`
  );
  $('.group-detail-group-description').html(`${groupDetail.groupDescription}`);
  $('.group-detail-time-duration').html(`${groupDetail.timeDuration}hr`);
  $('.group-detail-money').html(`💲 ${groupDetail.money} 元`);
  $('.group-detail-people-left').html(
    `(剩餘名額 ${groupDetail.peopleLeft} 人)`
  );
  $('#edit').html('編輯表單');
  $('.group-detail-creator').html(`#主揪 ${groupDetail.username}`);
  $('.group-detail-creator').attr(
    'href',
    `/profile.html?id=${groupDetail.creatorId}`
  );

  if (groupDetail.creatorId === userId) {
    $('#edit').show();
    $('#close-group').show();
    $('.signup-margin').hide();
    $('#signup-members').show();
  } else {
    $('#edit').hide();
    $('#close-group').hide();
    $('.signup-margin').show();
    $('#signup-members').hide();
  }

  // 渲染報名者名單 (只有主揪才能看到)
  for (let i = 0; i < signupMembers.length; i++) {
    if (signupMembers[i].signupStatus === '1') {
      $('#member-list').append(
        `<div class="member">
           <a href="/profile.html?id=${signupMembers[i].userId}" class="member-name">${signupMembers[i].username}</a>
           <div class="accept-deny-btn">
             <button id="${signupMembers[i].username}-${signupMembers[i].userId}-accept" class="accept" onclick="decide(this)" style="background-color: rgba(211, 228, 205, 0.5); cursor:not-allowed; color: grey" disabled>已接受報名</button>
           </div>
          </div>`
      );
    } else if (signupMembers[i].signupStatus === '2') {
      $('#member-list').append(
        `<div class="member">
           <a href="/profile.html?id=${signupMembers[i].userId}" class="member-name">${signupMembers[i].username}</a>
           <div class="accept-deny-btn">
             <button id="${signupMembers[i].username}-${signupMembers[i].userId}-deny" class="deny" onclick="decide(this)" style="background-color: rgba(255, 209, 209, 0.5); cursor:not-allowed; color: grey" disabled>已拒絕報名</button>
           </div>
          </div>`
      );
    } else {
      $('#member-list').append(
        `<div class="member">
          <a href="/profile.html?id=${signupMembers[i].userId}" class="member-name">${signupMembers[i].username}</a>
          <div class="accept-deny-btn">
            <button id="${signupMembers[i].username}-${signupMembers[i].userId}-accept" class="accept" onclick="decide(this)">接受</button>
            <button id="${signupMembers[i].username}-${signupMembers[i].userId}-deny" class="deny" onclick="decide(this)">拒絕</button>
          </div>
          </div>`
      );
    }
  }

  // 確認使用者報名狀態
  const datenow = new Date(+new Date() + 8 * 3600 * 1000).toISOString(); // 取得當下時間
  if (groupDetail.isBuild[0] === 0) {
    // 主揪自行關團
    $('#leave-msg, #edit, #close-group, #signup').css({
      'background-color': 'rgba(249, 213, 167, 0.5)',
      cursor: 'not-allowed',
      color: 'grey'
    });
    $('#signup').html('主揪已關閉揪團');
    $('#signup').prop('disabled', true);
    $('#edit').html('您已關閉揪團');
    $('#edit').prop('disabled', true);
    $('#close-group').prop('disabled', true);
    $('#leave-msg').prop('disabled', true);
    $('.accept').css({
      'background-color': 'rgba(211, 228, 205, 0.5)',
      cursor: 'not-allowed',
      color: 'grey'
    });
    $('.accept').prop('disabled', true);
    $('.deny').css({
      'background-color': 'rgba(255, 209, 209, 0.5)',
      cursor: 'not-allowed',
      color: 'grey'
    });
    $('.deny').prop('disabled', true);
  } else if (datenow > groupDetail.datetime) {
    // 時間過期
    $('#leave-msg, #edit, #close-group, #signup').css({
      'background-color': 'rgba(249, 213, 167, 0.5)',
      cursor: 'not-allowed',
      color: 'grey'
    });
    $('#signup').html('揪團已結束');
    $('#signup').prop('disabled', true);
    $('#edit').html('揪團已結束');
    $('#edit').prop('disabled', true);
    $('#close-group').prop('disabled', true);
    $('#leave-msg').prop('disabled', true);
    $('.accept').css({
      'background-color': 'rgba(211, 228, 205, 0.5)',
      cursor: 'not-allowed',
      color: 'grey'
    });
    $('.accept').prop('disabled', true);
    $('.deny').css({
      'background-color': 'rgba(255, 209, 209, 0.5)',
      cursor: 'not-allowed',
      color: 'grey'
    });
    $('.deny').prop('disabled', true);
  } else if (status === undefined && groupDetail.peopleLeft === 0) {
    $('#signup').html('已額滿');
    $('#signup').css({
      'background-color': 'rgba(249, 213, 167, 0.7)',
      cursor: 'not-allowed',
      color: 'grey'
    });
    $('#signup').prop('disabled', true);
  } else if (status === undefined) {
    // 還沒報名過
    $('#signup').html('報名');
  } else {
    $('#signup').html(`${status.signupStatus[1]}`);
    $('#signup').css({
      'background-color': 'rgba(249, 213, 167, 0.7)',
      cursor: 'not-allowed',
      color: 'grey'
    });
    $('#signup').prop('disabled', true);
  }

  // 渲染留言資料
  for (let i = 0; i < allMsg.length; i++) {
    $('#messages').append(
      `<div class="user-messages">
          <a href="/profile.html?id=${allMsg[i].userId}" class="username">${allMsg[i].username}</a>
          <div class="content">${allMsg[i].content}</div>
          <div class="time">${allMsg[i].time}</div>
       </div>
      `
    );
  }
})();

// 決定報名者是否報名成功
async function decide(e) {
  const buttonId = $(e).attr('id').split('-');
  const username = buttonId[0];
  const userId = buttonId[1];
  const decision = buttonId[2];
  const decisionChi = decision === 'accept' ? '接受' : '拒絕';

  // sweet alert 確定接受 / 拒絕?
  Swal.fire({
    title: `確定${decisionChi} ${username} 的報名?`,
    text: '這個動作無法再做更改',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '再想想'
  }).then(async (result) => {
    if (result.isConfirmed) {
      if (decision === 'accept') {
        // 改報名狀態 = 1;報名剩餘人數 + 0
        await axios.post('/api/1.0/update/signup/status', {
          userId,
          groupId: idSplit,
          statusCode: 1,
          peopleLeft: 0
        });
      } else {
        // 改報名狀態 = 2; // 報名剩餘人數 + 1
        await axios.post('/api/1.0/update/signup/status', {
          userId: userId,
          groupId: idSplit,
          statusCode: 2,
          peopleLeft: 1
        });
      }
      Swal.fire(
        `${decisionChi}`,
        `已${decisionChi} ${username} 的報名`,
        'success'
      ).then(() => {
        // 刷新頁面，接受 => 報名剩餘人數不變；拒絕 => 報名剩餘人數-1
        location.reload();
      });
    }
  });
}

// 彈出編輯表單
async function edit() {
  $('#edit-pop').show();

  // 先渲染下拉式選單選項
  for (let i = 0.5; i < 6.5; i += 0.5) {
    $('#edit-time-duration').append(
      $('<option>', {
        value: i,
        text: i
      })
    );
  }
  for (let i = 1; i < 19; i++) {
    $('#edit-people-have').append(
      $('<option>', {
        value: i,
        text: i
      })
    );
    $('#edit-people-need').append(
      $('<option>', {
        value: i,
        text: i
      })
    );
  }

  // 抓之前主揪填寫的資料，填入 value 值
  const detail = await axios.get(`/api/1.0/group/details${id}`);
  const [groupDetail] = detail.data.result;

  $('#edit-title').val(`${groupDetail.title}`);
  $('#edit-date').val(`${groupDetail.date.split(' ')[0]}`);
  $('#edit-time').val(`${groupDetail.time}`);
  $('#edit-time-duration').val(`${groupDetail.timeDuration}`);
  $('#edit-net').val(`${groupDetail.net[0]}`);
  $('#edit-place-description').val(`${groupDetail.placeDescription}`);
  $('#edit-court').val(`${groupDetail.court[0]}`);
  $('#edit-money').val(`${groupDetail.money}`);
  $('#edit-level').val(`${groupDetail.groupLevel[0]}`);
  $('textarea#edit-level-description').val(
    `${groupDetail.groupLevelDescription}`
  );
  $('#edit-people-have').val(`${groupDetail.peopleHave}`);
  $('#edit-people-need').val(`${groupDetail.peopleNeed}`);
  $('textarea#edit-group-description').val(`${groupDetail.groupDescription}`);

  // 選擇台灣、地區
  new TwCitySelector({
    el: '.edit-tw-city-selector',
    elCounty: '.county', // 在 el 裡查找 element
    elDistrict: '.district', // 在 el 裡查找 element
    countyFieldName: '縣市', // 該欄位的 name
    districtFieldName: '區域', // 該欄位的 name
    countyValue: `${groupDetail.place.slice(0, 3)}`, // 預設 value
    districtValue: `${groupDetail.place.slice(3, 10)}` // 預設 value
  });
}

// 儲存編輯表單
$('#save').click(async (e) => {
  e.preventDefault();
  const updateInfo = {
    groupId: idSplit,
    title: $('#edit-title').val(),
    date: $('#edit-date').val(),
    time: $('#edit-time').val(),
    timeDuration: $('#edit-time-duration').val(),
    net: $('#edit-net').val(),
    county: $('#edit-county').val(),
    district: $('#edit-district').val(),
    placeDescription: $('#edit-place-description').val(),
    court: $('#edit-court').val(),
    money: $('#edit-money').val(),
    level: $('#edit-level').val(),
    levelDescription: $('#edit-level-description').val(),
    peopleHave: $('#edit-people-have').val(),
    peopleNeed: $('#edit-people-need').val(),
    groupDescription: $('#edit-group-description').val()
  };

  // 使用者未填欄位，發出 alert
  let OK = true;
  $('#edit-start-group-form')
    .find('select, textarea, input')
    .filter('[required]') // 找出有 required 的屬性
    .each((i, requiredField) => {
      if (!$(requiredField).val()) {
        OK = false;
        Swal.fire({
          icon: 'error',
          title: '錯誤',
          text: `請輸入 "${$(requiredField).attr('name')}" 欄位`
        });
        return false; // break
      }
    });

  // 更新資料庫表單
  if (OK) {
    await axios.post('/api/1.0/update/group', updateInfo);
    Swal.fire({
      icon: 'success',
      title: '已儲存揪團資訊'
    }).then(() => {
      location.reload();
    });
  }
});

// 編輯彈窗按鈕
$('#edit-close-button').click(() => {
  $('#edit-pop').hide();
});

$(window).click((e) => {
  if (e.target.id === 'edit-pop') {
    $('#edit-pop').hide();
  }
});

// 報名揪團
$('#signup').click(async () => {
  const signupInfo = {
    groupId: idSplit,
    userId,
    signupStatus: 0
  };

  // 會員才能報名
  try {
    await axios.post('/api/1.0/signup/group', signupInfo, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    });

    // 報名成功按鈕顯示
    Swal.fire({
      icon: 'success',
      title: '已送出報名，請耐心等候主揪確認'
    }).then(() => {
      // 刷新頁面，報名剩餘人數-1
      location.reload();
    });
  } catch (error) {
    const Error = error.response.data.error;
    if (Error === 'Wrong token' || Error === 'No token') {
      Swal.fire({
        icon: 'error',
        title: '請先登入或註冊'
      }).then(() => {
        window.location.href = '/register.html';
      });
    }
  }
});

// 留言
$('#leave-msg').click(async () => {
  // 阻擋留言為空的狀況
  if ($('#msg-board').val() === '') {
    Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '你還沒留言唷~'
    });
    return;
  }

  // 打 API，儲存留言
  const msgInfo = {
    userId,
    groupId: idSplit,
    content: $('#msg-board').val()
  };

  // 會員才能留言
  try {
    await axios.post('/api/1.0/msg', msgInfo, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    });

    // 刷新頁面
    location.reload();
  } catch (error) {
    const Error = error.response.data.error;
    if (Error === 'Wrong token' || Error === 'No token') {
      Swal.fire({
        icon: 'error',
        title: '請先登入或註冊'
      }).then(() => {
        window.location.href = '/register.html';
      });
    }
  }
});

// 主揪自行關團
$('#close-group').click(async () => {
  Swal.fire({
    title: '確定關閉這個揪團?',
    text: '這個動作無法再做更改',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '再想想'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await axios.post('/api/1.0/close/group', { groupId: idSplit });
      Swal.fire('關團成功', '已關閉揪團', 'success').then(() => {
        // 刷新頁面
        location.reload();
      });
    }
  });
});
