// 確認 user 身分，從 res 拿 userId
const userId = 2;

// 彈出編輯表單
$('#self-edit').click(() => {
  $('#background-pop').show();
  new TwCitySelector({
    el: '.tw-city-selector',
    elCounty: '.county', // 在 el 裡查找 element
    elDistrict: '.district', // 在 el 裡查找 element
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
