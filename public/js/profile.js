// 從 local storage 拿 jwt token
const { localStorage } = window;
const token = localStorage.getItem('jwtToken');

// 無 jwt token，跳轉到註冊、登入頁面
if (token === null) {
  Swal.fire({
    icon: 'error',
    title: '請先登入或註冊'
  }).then(() => {
    window.location.href = '/register.html';
  });
}

// 有 jwt token，確認 token 正確與否
let userId;
(async () => {
  try {
    const getUserId = await axios.get('api/1.0/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // 確認 user 身分，從 res 拿 userId (自己)
    userId = getUserId.data.userId;
  } catch (error) {
    const Error = error.response.data.error;
    if (Error === 'Wrong token') {
      Swal.fire({
        icon: 'error',
        title: '請先登入或註冊'
      }).then(() => {
        window.location.href = '/register.html';
      });
    }
  }
})();

// 抓網址 userId (?id=21)，可以連到別人頁面 (到誰的個人頁面)
const url = new URL(window.location.href);
const id = url.search;
const idSplit = parseInt(id.split('=')[1]);

// 渲染個人頁面
(async () => {
  // 顯示個人資料
  $('#intro-part').show();
  $('#i-create').hide();
  $('#i-signup').hide();
  $('#past-create').hide();
  $('#past-signup').hide();

  // 打 user api 獲取 user 資料
  const info = await axios.get(`/api/1.0/user${id}`);
  const [userInfo] = info.data.result;
  const position_1 =
    userInfo.position_1[1] === null ? '' : `#${userInfo.position_1[1]}`;
  const position_2 =
    userInfo.position_2[1] === null ? '' : `#${userInfo.position_2[1]}`;
  if (userInfo.gender[1] === null) userInfo.gender[1] = '';
  if (userInfo.county === null) userInfo.county = '';

  // 取得追蹤狀態 API
  const follow = await axios.post('/api/1.0/follow/status', {
    userId: userId,
    followId: idSplit
  });

  // 打 nowCreate api
  const iCreateResult = await axios(`/api/1.0/now/create${id}`);
  const iCreate = iCreateResult.data.result;

  // 打 pastCreate api
  const pastCreateResult = await axios(`/api/1.0/past/create${id}`);
  const pastCreate = pastCreateResult.data.result;

  // 打 nowSignup api
  const nowSignupResult = await axios(`/api/1.0/now/signup${id}`);
  const nowSignup = nowSignupResult.data.result;

  // 打 pastSignup api
  const pastSignupResult = await axios(`/api/1.0/past/signup${id}`);
  const pastSignup = pastSignupResult.data.result;

  $('#resume-top-username').html(`${userInfo.username}`);
  $('#resume-top-gender').html(`${userInfo.gender[1]}`);
  $('#resume-mid-county').html(`${userInfo.county}`);
  $('#resume-mid-position-1').html(position_1);
  $('#resume-mid-position-2').html(position_2);
  $('#resume-bottom-level').html(userInfo.myLevel[1]);
  $('#fans').html(userInfo.fans);
  $('#follow').html(userInfo.follow);
  $('#intro').html(userInfo.intro);
  $('#level-des').html(userInfo.myLevelDes);

  // 確認是不是本人的個人頁面， (是 => 可編輯；否 => 可追蹤)
  if (userId === idSplit) {
    $('#follow-btn').hide();
    $('#self-edit').show();
  } else {
    $('#follow-btn').show();
    $('#self-edit').hide();
  }

  // 確認追蹤按鈕是否追蹤
  const followStatus = follow.data.result;
  if (followStatus !== undefined) {
    $('#follow-btn').html('已追蹤');
  } else {
    $('#follow-btn').html('追蹤');
    $('#follow-btn').addClass('able-follow');
  }

  // 渲染我主揪的團數量
  $('#i-create-num').html(`${iCreate.length}`);

  // 渲染過去主揪的團數量
  $('#past-create-num').html(`${pastCreate.length}`);

  // 渲染我報名的團數量
  $('#i-signup-num').html(`${nowSignup.length}`);

  // 渲染過去報名的團數量
  $('#past-signup-num').html(`${pastSignup.length}`);
})();

// 彈出編輯表單
$('#self-edit').click(async () => {
  $('#background-pop').show();

  const info = await axios.get(`/api/1.0/user?id=${userId}`);
  const [userInfo] = info.data.result;
  if (userInfo.position_1[0] === null) userInfo.position_1[0] = '';
  if (userInfo.position_2[0] === null) userInfo.position_2[0] = '';
  if (userInfo.county === null) userInfo.county = '';
  if (userInfo.myLevelDes === null) userInfo.myLevelDes = '';
  if (userInfo.intro === null) userInfo.intro = '';

  $('#name').val(`${userInfo.username}`);
  $('input:radio[name=gender]').val([`${userInfo.gender[0]}`]);
  $('input:checkbox[name=position]').val([
    `${userInfo.position_1[0]}`,
    `${userInfo.position_2[0]}`
  ]);
  $('#my-level').val(`${userInfo.myLevel[0]}`);
  $('#my-level-des').val(`${userInfo.myLevelDes}`);
  $('#self-intro').val(`${userInfo.intro}`);

  new TwCitySelector({
    el: '.tw-city-selector',
    elCounty: '.county', // 在 el 裡查找 element
    elDistrict: '.district', // 在 el 裡查找 element
    countyValue: `${userInfo.county}`
  });
});

// 關閉編輯表單彈窗按鈕
$('#close-button').click(() => {
  $('#background-pop').hide();
});

// 點畫面其他處關閉編輯表單彈窗
$(window).click((e) => {
  if (e.target.id === 'background-pop') {
    $('#background-pop').hide();
  }
});

// 限制 checkbox 選取數量
$('input:checkbox').click(() => {
  if ($('input:checkbox:checked').length > 2) {
    return false;
  }
});

// 儲存個人檔案
$('#save').click(async (e) => {
  e.preventDefault();
  let position = [];
  $.each($("input[name='position']:checked"), function () {
    position.push($(this).val());
  });

  let myInfo = {
    userId: userId,
    username: $('#name').val(),
    gender: $('input[name="gender"]:checked').val(),
    county: $('#county').val(),
    district: $('#district').val(),
    position: position,
    myLevel: $('#my-level').val(),
    myLevelDes: $('#my-level-des').val(),
    selfIntro: $('#self-intro').val()
  };

  // 使用者未填欄位，發出 alert
  let OK = true;
  $('input')
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

  // 使用者填欄位填寫完畢，才打 API
  if (OK) {
    await axios.put('/api/1.0/user', myInfo);
    Swal.fire({
      icon: 'success',
      title: '已儲存您的資料',
      showConfirmButton: true
    }).then(() => {
      location.reload();
    });
  }
});

// 個人頁面連結
$('#my-profile').attr('href', `/profile.html?id=${userId}`);

// 追蹤與退追
$('#follow-btn').click(async (e) => {
  // class = able-follow => 可追蹤
  if (e.target.className === 'able-follow') {
    await axios.post('/api/1.0/follow', { userId: userId, followId: idSplit });
    location.reload();
  } else {
    // 無class => 可取消追蹤
    Swal.fire({
      title: '確定要取消追蹤?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確定',
      cancelButtonText: '再想想'
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.post('/api/1.0/unfollow', {
            userId: userId,
            followId: idSplit
          });
          Swal.fire('成功', '已取消追蹤', 'success');
        }
      })
      .then(() => {
        location.reload();
      });
  }

  // 有 class => 可退追
});

// 渲染我主揪的團
$('#i-create-link').click(async (e) => {
  e.preventDefault(); // 預設會刷新頁面
  $('#intro-part').hide();
  $('#i-create').show();
  $('#i-signup').hide();
  $('#past-create').hide();
  $('#past-signup').hide();

  // 打 nowCreate api
  const result = await axios(`/api/1.0/now/create${id}`);
  const iCreate = result.data.result;

  $('#i-create-groups-details').empty();
  for (let i = 0; i < iCreate.length; i++) {
    $('#i-create-groups-details').append(
      `<a class="group-details-link" href="/group.html?id=${iCreate[i].groupId}"><div class="group-details">
        <div>${iCreate[i].title}</div>
        <div>${iCreate[i].date} ${iCreate[i].time}</div>
      </div></a>
      `
    );
  }
});

// 渲染我報名的團
$('#i-signup-link').click(async (e) => {
  e.preventDefault();
  $('#intro-part').hide();
  $('#i-create').hide();
  $('#i-signup').show();
  $('#past-create').hide();
  $('#past-signup').hide();
  // 打 nowSignup api
  const nowSignupResult = await axios(`/api/1.0/now/signup${id}`);
  const nowSignup = nowSignupResult.data.result;
  $('#i-signup-groups-details').empty();
  for (let i = 0; i < nowSignup.length; i++) {
    $('#i-signup-groups-details').append(
      `<a class="group-details-link" href="/group.html?id=${nowSignup[i].groupId}"><div class="group-details">
          <div>${nowSignup[i].title}</div>
          <div>${nowSignup[i].date} ${nowSignup[i].time}</div>
        </div></a>
        `
    );
  }
});

// 渲染過去主揪的團
$('#past-create-link').click(async (e) => {
  e.preventDefault();
  $('#intro-part').hide();
  $('#i-create').hide();
  $('#i-signup').hide();
  $('#past-create').show();
  $('#past-signup').hide();

  // 打 pastCreate api
  const result = await axios(`/api/1.0/past/create${id}`);
  const pastCreate = result.data.result;

  $('#past-create-groups-details').empty();
  for (let i = 0; i < pastCreate.length; i++) {
    $('#past-create-groups-details').append(
      `<a class="group-details-link" href="/group.html?id=${pastCreate[i].groupId}"><div class="group-details">
          <div>${pastCreate[i].title}</div>
          <div>${pastCreate[i].date} ${pastCreate[i].time}</div>
        </div></a>
        `
    );
  }
});

// 渲染過去報名的團
$('#past-signup-link').click(async (e) => {
  e.preventDefault();
  $('#intro-part').hide();
  $('#i-create').hide();
  $('#i-signup').hide();
  $('#past-create').hide();
  $('#past-signup').show();

  // 打 pastSignup api
  const result = await axios.get(`/api/1.0/past/signup${id}`);
  const pastSignup = result.data.result;

  $('#past-signup-groups-details').empty();
  for (let i = 0; i < pastSignup.length; i++) {
    $('#past-signup-groups-details').append(
      `<a class="group-details-link" href="/group.html?id=${pastSignup[i].groupId}"><div class="group-details">
          <div>${pastSignup[i].title}</div>
          <div>${pastSignup[i].date} ${pastSignup[i].time}</div>
        </div></a>
        `
    );
    // 打 getComment api
    const comment = await axios.post(`/api/1.0/comment/status`, {
      commenterId: userId,
      groupId: `${pastSignup[i].groupId}`
    });
    const [commentStatus] = comment.data.result;

    if (userId === idSplit) {
      if (commentStatus) {
        $('#past-signup-groups-details').append(
          `<button id="group-${pastSignup[i].groupId}-creator-${pastSignup[i].creatorId}" class="comment-btn" onclick="comment(this)" disabled>已評價</button>`
        );
      } else {
        $('#past-signup-groups-details').append(
          `<button id="group-${pastSignup[i].groupId}-creator-${pastSignup[i].creatorId}" class="comment-btn" onclick="comment(this)">待評價</button>`
        );
      }
    }
  }
});

// 待評價彈窗
async function comment(e) {
  $('#comment-pop').show();
  const id = $(e).attr('id').split('-');
  const groupId = id[1];

  const result = await axios.post('/api/1.0/group/info', { groupId });
  const [groupInfo] = result.data.result;
  $('#comment-title').html(`${groupInfo.title}`);
  $('#comment-time').html(`活動時間: ${groupInfo.date} ${groupInfo.time}`);

  // 新增 class 給 send comment button
  $('#send-comment').addClass(`${$(e).attr('id')}`);
}

// 關閉評價彈窗按鈕
$('#comment-close-button').click(() => {
  $('#comment-pop').hide();
});

// 點畫面其他處關閉評價彈窗
$(window).click((e) => {
  if (e.target.id === 'comment-pop') {
    $('#comment-pop').hide();
  }
});

// 送出評價
$('#send-comment').click(async (e) => {
  e.preventDefault();
  // 用 class 去抓 creator_id, group_id
  const className = e.target.className.split('-');
  const commentInfo = {
    creatorId: className[3],
    commentorId: userId,
    groupId: className[1],
    score: $('#score').val(),
    content: $('#content').val()
  };

  // 使用者未填評價，發出 alert
  let OK = true;
  $('textarea')
    .filter('[required]') // 找出有 required 的屬性
    .each((i, requiredField) => {
      if (!$(requiredField).val()) {
        OK = false;
        Swal.fire({
          icon: 'error',
          title: `請輸入 ${$(requiredField).attr('name')} 欄位`
        });
        return false; // break
      }
    });

  // 使用者填欄位填寫完畢，才打 API
  if (OK) {
    Swal.fire({
      title: `確定送出評價?`,
      text: '這個動作無法再做更改',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確定',
      cancelButtonText: '再想想'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // 打 comment api
        await axios.post('/api/1.0/comment', commentInfo);
        Swal.fire('成功', '已送出評價', 'success').then(() => {
          // 送出評價後，關閉評價彈窗，再次點擊過去報名的團
          $('#comment-pop').hide();
          $('#past-signup-link').trigger('click');
        });
      }
    });
  }
});

// 星星 icon
$('#star').click(async () => {
  $('#self-details').hide();
  $('#comment').show();

  const result = await axios.get(`/api/1.0/comment${id}`);
  const comment = result.data.result;

  // 渲染評價
  let score = 0;
  for (let i = 0; i < comment.length; i++) {
    score += comment[i].score;
    $('#comment-block-container').append(
      `<a href="/group.html?id=${comment[i].groupId}"><div class="comment-block">
         <div class="commenter">
           <div>${comment[i].commenterName}</div>
           <div>${comment[i].date}</div>
           <div>${comment[i].title}</div>
         </div>
         <div>${comment[i].content}</div>
       </div></a>
    `
    );
  }

  // 評價分數
  if (comment.length === 0) {
    $('#avg-score').html('0');
    $('#rateYo').rateYo({
      rating: 0,
      readOnly: true
    });
  } else {
    $('#avg-score').html(`${score / comment.length}`);
    $('#rateYo').rateYo({
      rating: score / comment.length,
      readOnly: true
    });
  }
  $('#comment-num').html(`(${comment.length})`);
});
