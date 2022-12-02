// 主揪揪團彈窗
function show() {
  axios
    .get('/api/1.0/user/auth', {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    })
    .catch(() => {
      Swal.fire({
        icon: 'error',
        title: '請先登入或註冊'
      }).then(() => {
        window.location.href = '/register.html';
      });
    });

  $('#background-pop').show();
  $('#date').attr('min', moment().format('YYYY-MM-DD'));
  $('#date').attr('value', moment().format('YYYY-MM-DD'));
  $('#time').attr('value', moment().format('HH:mm'));

  new TwCitySelector({
    // 選擇台灣、地區
    el: '.start-group',
    elCounty: '.county', // 在 el 裡查找 element
    elDistrict: '.district', // 在 el 裡查找 element
    countyFieldName: '縣市', // 該欄位的 name
    districtFieldName: '區域' // 該欄位的 name
  });
}

// 點擊下一頁，變換下一頁資料
async function nextPage(e) {
  const page = $(e).attr('id').split('=')[1];
  const result = await axios.post('/api/1.0/group/nextpage', { page });
  const { nextPageGroup } = result.data;

  $('.no-filter').remove();
  // 渲染下一頁的團
  for (let i = 0; i < nextPageGroup.length; i++) {
    const newDom = $('.card').first().clone().removeAttr('hidden');

    // 按照日期，剩餘報名名額排列
    newDom.addClass('no-filter');
    newDom.attr('href', `/group.html?id=${nextPageGroup[i].groupId}`);
    newDom
      .children('.card-left')
      .children('.card-title')
      .html(`${nextPageGroup[i].title}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-date')
      .html(`📅 ${nextPageGroup[i].date}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-time')
      .html(`${nextPageGroup[i].time}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-time-duration')
      .html(`${nextPageGroup[i].timeDuration} hr`);
    newDom
      .children('.card-left')
      .children('.card-place-container')
      .children('.card-place')
      .html(`📍 ${nextPageGroup[i].place}`);
    newDom
      .children('.card-left')
      .children('.card-place-container')
      .children('.card-place-des')
      .html(`${nextPageGroup[i].placeDescription}`);
    newDom
      .children('.card-left')
      .children('.card-creator')
      .html(`💁🏻‍♂️ ${nextPageGroup[i].username}`);
    newDom
      .children('.card-right')
      .children('.card-net')
      .html(`網高: ${nextPageGroup[i].net}`);
    newDom
      .children('.card-right')
      .children('.card-group-level')
      .html(`程度: ${nextPageGroup[i].groupLevel}`);
    newDom
      .children('.card-right')
      .children('.card-money')
      .html(`費用: ${nextPageGroup[i].money} 元`);
    newDom
      .children('.card-right')
      .children('.card-people-have')
      .html(`內建: ${nextPageGroup[i].peopleHave} 人`);

    $('#card-group').append(newDom);
  }
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
          title: `請輸入${$(requiredField).attr('name')}`
        });
        return false; // break
      }
    });

  // 數字填超過 65535，或非正整數，發出 alert
  const money = Number($('#money').val());
  if (money > 65535 || !Number.isInteger(money)) {
    Swal.fire({
      icon: 'error',
      title: '費用需為正整數且 < 65535'
    });
    return false; // break
  }

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
      } else if (Error === 'Exceed word limit') {
        Swal.fire({
          icon: 'error',
          title: '標題、程度、揪團描述超過字數限制'
        });
      }
    }
  }
});

// 篩選字卡
$('#filter').click(async (e) => {
  e.preventDefault();
  $('#card-group').show();
  $('.group-signup').hide(); // 揪團詳細頁面

  const filterInfo = {
    county: $('#filter-county').val(),
    district: $('#filter-district').val(),
    groupLevel: $('#filter-group-level').val(),
    net: $('#filter-net').val(),
    court: $('#filter-court').val(),
    isCharge: $('#filter-is-charge').val(),
    page: 1 // 按下瞬間，顯示第一頁結果
  };

  const filterCards = await axios.post('/api/1.0/filter', filterInfo);
  const filterCardsInfo = filterCards.data.perPage;
  const { totalPage } = filterCards.data;

  $('.no-filter').remove();
  $('.filter').remove();
  $('.group-top').html('篩選結果');

  // 渲染總頁數
  $('.page').empty();
  for (let i = 0; i < totalPage; i++) {
    $('.page').append(
      `<div id="page=${
        i + 1
      }" class="per-page" onclick="nextPageFilter(this)">${i + 1}</div>`
    );
  }

  if (filterCardsInfo.length === 0) {
    $('.filter-result').show();
    $('.filter-result').html('目前沒有相關的揪團喔...');
    $('.card-group').css('padding-bottom', '40%');
  } else {
    $('.filter-result').hide();
  }

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

// 篩選後，點擊下一頁，變換下一頁資料
async function nextPageFilter(e) {
  const page = $(e).attr('id').split('=')[1];
  const filterInfo = {
    county: $('#filter-county').val(),
    district: $('#filter-district').val(),
    groupLevel: $('#filter-group-level').val(),
    net: $('#filter-net').val(),
    court: $('#filter-court').val(),
    isCharge: $('#filter-is-charge').val(),
    page
  };

  const result = await axios.post('/api/1.0/filter', filterInfo);
  const { perPage } = result.data;

  $('.filter').remove();
  // 渲染下一頁的團
  for (let i = 0; i < perPage.length; i++) {
    const newDom = $('.card').first().clone().removeAttr('hidden');

    // 按照日期，剩餘報名名額排列
    newDom.addClass('filter');
    newDom.attr('href', `/group.html?id=${perPage[i].groupId}`);
    newDom
      .children('.card-left')
      .children('.card-title')
      .html(`${perPage[i].title}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-date')
      .html(`📅 ${perPage[i].date}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-time')
      .html(`${perPage[i].time}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-time-duration')
      .html(`${perPage[i].timeDuration} hr`);
    newDom
      .children('.card-left')
      .children('.card-place-container')
      .children('.card-place')
      .html(`📍 ${perPage[i].place}`);
    newDom
      .children('.card-left')
      .children('.card-place-container')
      .children('.card-place-des')
      .html(`${perPage[i].placeDescription}`);
    newDom
      .children('.card-left')
      .children('.card-creator')
      .html(`💁🏻‍♂️ ${perPage[i].username}`);
    newDom
      .children('.card-right')
      .children('.card-net')
      .html(`網高: ${perPage[i].net}`);
    newDom
      .children('.card-right')
      .children('.card-group-level')
      .html(`程度: ${perPage[i].groupLevel}`);
    newDom
      .children('.card-right')
      .children('.card-money')
      .html(`費用: ${perPage[i].money} 元`);
    newDom
      .children('.card-right')
      .children('.card-people-have')
      .html(`內建: ${perPage[i].peopleHave} 人`);

    $('#card-group').append(newDom);
  }
}

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
