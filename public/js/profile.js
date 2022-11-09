// 確認 user 身分，從 res 拿 userId (自己)
const userId = 2;

// 抓網址 userId (?id=21)，可以連到別人頁面 (到誰的個人頁面)
const url = new URL(window.location.href);
const id = url.search;
const idSplit = parseInt(id.split('=')[1]);

// 渲染個人頁面
(async () => {
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
    followId: idSplit,
  });
  console.log(follow.data.result);

  $('#resume-top-username').html(`${userInfo.username}`);
  $('#resume-top-gender').html(`${userInfo.gender[1]}`);
  $('#resume-mid-county').html(`${userInfo.county}`);
  $('#resume-mid-position-1').html(position_1);
  $('#resume-mid-position-2').html(position_2);
  $('#resume-bottom-level').html(userInfo.myLevel[1]);
  $('#fans').html(userInfo.fans);
  $('#follow').html(userInfo.fans);
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
    `${userInfo.position_2[0]}`,
  ]);
  $('#my-level').val(`${userInfo.myLevel[0]}`);
  $('#my-level-des').val(`${userInfo.myLevelDes}`);
  $('#self-intro').val(`${userInfo.intro}`);

  console.log(userInfo);
  new TwCitySelector({
    el: '.tw-city-selector',
    elCounty: '.county', // 在 el 裡查找 element
    elDistrict: '.district', // 在 el 裡查找 element
    countyValue: `${userInfo.county}`,
  });
});

// 關閉彈窗按鈕
$('#close-button').click(() => {
  $('#background-pop').hide();
});

// 點畫面其他處關閉談窗
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
    selfIntro: $('#self-intro').val(),
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
          text: `請輸入 "${$(requiredField).attr('name')}" 欄位`,
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
      showConfirmButton: true,
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
      cancelButtonText: '再想想',
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.post('/api/1.0/unfollow', {
            userId: userId,
            followId: idSplit,
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
