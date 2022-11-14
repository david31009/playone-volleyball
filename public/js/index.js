// 從 local storage 拿 jwt token
const { localStorage } = window;
const jwtToken = localStorage.getItem('jwtToken');

// ----------------------主揪揪團彈窗----------------------
function show() {
  $('#background-pop').show();
}

$('#close-button').click(() => {
  $('#background-pop').hide();
});

$(window).click((e) => {
  if (e.target.id === 'background-pop') {
    $('#background-pop').hide();
  }
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

// 選擇台灣、地區
new TwCitySelector({
  el: '.tw-city-selector',
  elCounty: '.county', // 在 el 裡查找 element
  elDistrict: '.district', // 在 el 裡查找 element
  countyFieldName: '縣市', // 該欄位的 name
  districtFieldName: '區域' // 該欄位的 name
});

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
  $('input, textarea, select')
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

// ----------------------首頁渲染、篩選字卡----------------------
// 選擇台灣、地區
new TwCitySelector({
  el: '.tw-city-filter',
  elCounty: '.county', // 在 el 裡查找 element
  elDistrict: '.district', // 在 el 裡查找 element
  countyFieldName: '縣市', // 該欄位的 name
  districtFieldName: '區域' // 該欄位的 name
});

// 渲染字卡
(async () => {
  const getCards = await axios.get('/api/1.0/group');
  const cardInfo = getCards.data.result;

  for (let i = 0; i < cardInfo.length; i++) {
    // 按照日期，剩餘報名名額排列
    $('#card-group').append(
      `<a href="/group.html?id=${cardInfo[i].groupId}">
        <div class="card">
            <div class="card-title">${cardInfo[i].title}</div>
            <div class="card-net">網高: ${cardInfo[i].net}</div>
            <div class="card-group-level">程度: ${cardInfo[i].groupLevel}</div>
            <div class="card-date">日期: ${cardInfo[i].date}</div>
            <div class="card-time">時間: ${cardInfo[i].time}</div>
            <div class="card-time-duration">可以打: ${cardInfo[i].timeDuration} 小時</div>
            <div class="card-place">地點: ${cardInfo[i].place}</div>
            <div class="card-place-des">詳細地點: ${cardInfo[i].placeDescription}</div>
            <div class="card-people-have">內建: ${cardInfo[i].peopleHave} 人</div>
            <div class="card-people-need">預計揪: ${cardInfo[i].peopleNeed} 人</div>
            <div class="card-money">費用: ${cardInfo[i].money} 元</div>
            <div class="card-creator">主揪: ${cardInfo[i].username}</div>
        </div>
       </a>`
    );
  }
})();

// 篩選字卡
$('#filter').click(async (e) => {
  e.preventDefault();

  let filterInfo = {
    county: $('#filter-county').val(),
    district: $('#filter-district').val(),
    groupLevel: $('#filter-group-level').val(),
    net: $('#filter-net').val(),
    court: $('#filter-court').val(),
    isCharge: $('#filter-is-charge').val()
  };

  let filterCards = await axios.post('/api/1.0/filter', filterInfo);
  const filterCardsInfo = filterCards.data.result;

  $('#card-group a').remove();
  for (let i = 0; i < filterCardsInfo.length; i++) {
    // 按照日期，剩餘報名名額排列
    $('#card-group').append(
      `<a href="/group.html?id=${filterCardsInfo[i].groupId}">
        <div class="card">
            <div class="card-title">${filterCardsInfo[i].title}</div>
            <div class="card-net">網高: ${filterCardsInfo[i].net}</div>
            <div class="card-group-level">程度: ${filterCardsInfo[i].groupLevel}</div>
            <div class="card-date">日期: ${filterCardsInfo[i].date}</div>
            <div class="card-time">時間: ${filterCardsInfo[i].time}</div>
            <div class="card-time-duration">可以打: ${filterCardsInfo[i].timeDuration} 小時</div>
            <div class="card-place">地點: ${filterCardsInfo[i].place}</div>
            <div class="card-place-des">詳細地點: ${filterCardsInfo[i].placeDescription}</div>
            <div class="card-people-have">內建: ${filterCardsInfo[i].peopleHave} 人</div>
            <div class="card-people-need">預計揪: ${filterCardsInfo[i].peopleNeed} 人</div>
            <div class="card-money">費用: ${filterCardsInfo[i].money} 元</div>
            <div class="card-creator">主揪: ${filterCardsInfo[i].username}</div>
        </div>
       </a>`
    );
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
