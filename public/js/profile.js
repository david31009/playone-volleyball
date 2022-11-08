// 確認 user 身分，從 res 拿 userId (自己)
const userId = 2;

// 抓網址 userId (?id=21)，可以連到別人頁面
const url = new URL(window.location.href);
const id = url.search;
const idSplit = parseInt(id.split('=')[1]);

// 渲染個人頁面
(async () => {
  const info = await axios.get(`/api/1.0/user${id}`);
  const [userInfo] = info.data.result;

  const position_1 =
    userInfo.position_1[1] === null ? '' : `#${userInfo.position_1[1]}`;
  const position_2 =
    userInfo.position_2[1] === null ? '' : `#${userInfo.position_2[1]}`;
  if (userInfo.fans === null) userInfo.fans = 0;
  if (userInfo.follow === null) userInfo.follow = 0;
  if (userInfo.gender[1] === null) userInfo.gender[1] = '';
  if (userInfo.county === null) userInfo.county = '';

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

  console.log(userId, id, idSplit);
  if (userId === idSplit) {
    $('#follow-btn').hide();
    $('#self-edit').show();
  } else {
    $('#follow-btn').show();
    $('#self-edit').hide();
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
