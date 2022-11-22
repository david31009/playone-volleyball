// 主揪揪團彈窗
function show() {
  $('#background-pop').show();
  new TwCitySelector({
    // 選擇台灣、地區
    el: '.start-group',
    elCounty: '.county', // 在 el 裡查找 element
    elDistrict: '.district', // 在 el 裡查找 element
    countyFieldName: '縣市', // 該欄位的 name
    districtFieldName: '區域' // 該欄位的 name
  });
}

$('#close-button').click(() => {
  $('#background-pop').hide();
});

$(window).click((e) => {
  if (e.target.id === 'background-pop') {
    $('#background-pop').hide();
  }
});

// 篩選字卡 (選擇台灣、地區)
new TwCitySelector({
  el: '.tw-city-filter',
  elCounty: '.county', // 在 el 裡查找 element
  elDistrict: '.district', // 在 el 裡查找 element
  countyFieldName: '縣市', // 該欄位的 name
  districtFieldName: '區域' // 該欄位的 name
});

for (let i = 0.5; i < 6.5; i += 0.5) {
  $('#time-duration').append(
    $('<option>', {
      value: i,
      text: i
    })
  );
}

for (let i = 1; i < 19; i++) {
  $('#people-have').append(
    $('<option>', {
      value: i,
      text: i
    })
  );
  $('#people-need').append(
    $('<option>', {
      value: i,
      text: i
    })
  );
}

// 主揪建立揪團表單
$('#start-group').click(async (e) => {
  e.preventDefault();
  const groupInfo = {
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
    groupDescription: $('#group-description').val()
  };

  // 使用者未填欄位，發出 alert
  let OK = true;
  $('#background-pop')
    .find('input, textarea, select')
    .filter('[required]') // 找出有 required 的屬性
    .each((i, requiredField) => {
      if (!$(requiredField).val()) {
        OK = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `請輸入 "${$(requiredField).attr('name')}" 欄位`
        });
        return false; // break
      }
    });

  // 使用者填欄位填寫完畢，才打 API，(用 header 帶 jwt token)
  if (OK) {
    try {
      const result = await axios.post('/api/1.0/group', groupInfo, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      // 成功建立揪團，跳轉到揪團詳細頁面
      Swal.fire({
        icon: 'success',
        title: '成功建立揪團'
      }).then(() => {
        window.location.href = `/group.html?id=${result.data.groupId}`;
      });
    } catch (error) {
      // 後端傳回錯誤回應處理
      const Error = error.response.data.error;
      if (Error === 'No token' || Error === 'Wrong token') {
        Swal.fire({
          icon: 'error',
          title: '請先登入或註冊'
        }).then(() => {
          window.location.href = '/register.html';
        });
      }
    }
  }
});

// 篩選字卡
$('#filter').click(async (e) => {
  e.preventDefault();
  $('#card-group').show();
  $('.group-signup').hide();

  const filterInfo = {
    county: $('#filter-county').val(),
    district: $('#filter-district').val(),
    groupLevel: $('#filter-group-level').val(),
    net: $('#filter-net').val(),
    court: $('#filter-court').val(),
    isCharge: $('#filter-is-charge').val()
  };

  const filterCards = await axios.post('/api/1.0/filter', filterInfo);
  const filterCardsInfo = filterCards.data.result;

  $('.no-filter').remove();
  $('.filter').remove();
  $('.group-top').html('篩選結果');
  for (let i = 0; i < filterCardsInfo.length; i++) {
    const newDom = $('.card').first().clone().removeAttr('hidden');

    // 按照日期，剩餘報名名額排列
    newDom.addClass('filter');
    newDom.attr('href', `/group.html?id=${filterCardsInfo[i].groupId}`);
    newDom
      .children('.card-left')
      .children('.card-title')
      .html(`${filterCardsInfo[i].title}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-date')
      .html(`📅 ${filterCardsInfo[i].date}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-time')
      .html(`${filterCardsInfo[i].time}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-time-duration')
      .html(`${filterCardsInfo[i].timeDuration} hr`);
    newDom
      .children('.card-left')
      .children('.card-place-container')
      .children('.card-place')
      .html(`📍 ${filterCardsInfo[i].place}`);
    newDom
      .children('.card-left')
      .children('.card-place-container')
      .children('.card-place-des')
      .html(`${filterCardsInfo[i].placeDescription}`);
    newDom
      .children('.card-left')
      .children('.card-creator')
      .html(`💁🏻‍♂️ ${filterCardsInfo[i].username}`);
    newDom
      .children('.card-right')
      .children('.card-net')
      .html(`網高: ${filterCardsInfo[i].net}`);
    newDom
      .children('.card-right')
      .children('.card-group-level')
      .html(`程度: ${filterCardsInfo[i].groupLevel}`);
    newDom
      .children('.card-right')
      .children('.card-money')
      .html(`費用: ${filterCardsInfo[i].money} 元`);
    newDom
      .children('.card-right')
      .children('.card-people-have')
      .html(`內建: ${filterCardsInfo[i].peopleHave} 人`);

    $('#card-group').append(newDom);
  }
});

// 個人頁面連結，確認使用者身分，要有jwt token
$('#my-profile').click(async () => {
  // 無 jwt token，跳轉到註冊、登入頁面
  if (jwtToken === null) {
    Swal.fire({
      icon: 'error',
      title: '請先登入或註冊'
    }).then(() => {
      window.location.href = '/register.html';
    });
  } else {
    // 有 jwt token，確認 token 正確與否
    let userId;
    try {
      const getUserId = await axios.get('api/1.0/user/profile', {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      // 確認 user 身分，從 res 拿 userId (自己)
      userId = getUserId.data.userId;
      window.location.href = `/profile.html?id=${userId}`;
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
  }
});

// 點擊 logo，跳轉到首頁
$('.logo').click(() => {
  window.location.href = '/index.html';
});
