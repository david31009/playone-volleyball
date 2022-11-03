// 渲染某團詳細資料
(async () => {
  // 抓網址的 query string (?id=21)
  const url = new URL(window.location.href);
  const id = url.search;

  // 打 group details API
  let detail = await axios.get(`/api/1.0/group/details${id}`);
  [groupDetail] = detail.data.result;
  $('#group').append(
    `<div class="card-title">${groupDetail.title}</div>
        <div class="group-detail-net">網高: ${groupDetail.net}</div>
        <div class="group-detail-date">日期: ${groupDetail.date}</div>
        <div class="group-detail-time">時間: ${groupDetail.time}</div>
        <div class="group-detail-place">地點: ${groupDetail.place}</div>
        <div class="group-detail-place-des">詳細地點: ${groupDetail.placeDescription}</div>
        <div class="group-detail-group-level">程度: ${groupDetail.groupLevel}</div>
        <div class="group-detail-time-duration">可以打: ${groupDetail.timeDuration} 小時</div>
        <div class="group-detail-money">費用: ${groupDetail.money} 元</div>
        <div class="group-detail-people-left">報名剩餘名額: ${groupDetail.peopleLeft} 人</div>
        <button id="attend" class="attend">報名</button>
        <button id="edit" class="edit" onclick="show()">編輯表單</button>
        <div class="group-detail-creator">主揪: ${groupDetail.username}</div>
        <div>
          <textarea id="msg-board" name="程度描述" rows="4" cols="30" placeholder="留言板"></textarea>
        </div>
        <button>留言</button>
      </div>`
  );

  // 確認 user 身分，從 local storage 拿
  const user = 4;
  // if user = 主揪 // edit
  //else // view
  if (groupDetail.userId === user) {
    $('#edit').show();
    $('#attend').hide();
  } else {
    $('#edit').hide();
    $('#attend').show();
  }
})();

// 編輯表單
function show() {
  $('#background-pop').show();

  $('#edit-form').prepend(
    `<div>揪團標題 
      <input id="title" name="揪團標題" required />
    </div>
    <div>揪團日期 <input id="date" type="date" name="揪團日期" required /></div>
    <div>揪團時間 <input id="time" type="time" name="揪團時間" required /></div>
    <div>打多久 <select id="time-duration" name="打多久" required></select>小時</div>
    <div>網高 <select id="net" name="網高" required><option value="1">男網</option><option value="0">女網</option></select></div>
    <div>揪團地點 
      <div class="tw-city-selector">
        <select id="county" class="county" required></select>
        <select id="district" class="district" required></select>
      </div>
      <input id="place-description" name="詳細地點" placeholder="詳細地點" required />
    </div>
    <div>場地
      <select id="court" name="場地" required><option value="0">室內</option><option value="1">室外</option></select>
    </div>
    <div>費用
      <input id="money" name="費用" placeholder="請輸入數字，免費請輸入 0" required />
    </div>
    <div>程度
        <select id="level" name="程度" required>
            <option value="4">職業</option>
            <option value="3" >校隊</option>
            <option value="2">系隊</option>
            <option value="1">新手</option>
            <option value="0">快樂排球</option>
        </select>
    </div>
    <div>程度描述
      <br />
      <textarea id="level-description" name="程度描述" rows="4" cols="30" required></textarea>
    </div>
    <div>人數
     <span>內建 </span><select id="people-have" name="內建人數" required></select><span>人</span>
     <span>預計揪 </span><select id="people-need" name="預計揪人數" required></select><span>人</span>
    </div>
    <div>揪團描述
     <br />
     <textarea id="group-description" name="揪團描述" rows="4" cols="30" required></textarea>
    </div>
    `
  );

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
  $('#title').val('我想打球');
  $('#date').val('2022-11-04');
  $('#time').val('13:35');
  $('#time-duration').val('1.5');
  $('#net').val('0');
  $('#place-description').val('大安森林公園');
  $('#court').val('1');
  $('#money').val('600');
  $('#level').val('2');
  $('textarea#level-description').val('拜託');
  $('#people-have').val('6');
  $('#people-need').val('8');
  $('textarea#group-description').val('拜託');

  // 選擇台灣、地區
  new TwCitySelector({
    el: '.tw-city-selector',
    elCounty: '.county', // 在 el 裡查找 element
    elDistrict: '.district', // 在 el 裡查找 element
    countyFieldName: '縣市', // 該欄位的 name
    districtFieldName: '區域', // 該欄位的 name
    countyValue: '台北市', // 預設 value
    districtValue: '大安區', // 預設 value
  });
}

$('#save').click((e) => {
  e.preventDefault();
  const newTitle = $('#title').val();
  const newDate = $('#date').val();
  const newTime = $('#time').val();
  const newTimeduration = $('#time-duration').val();
  const newNet = $('#net').val();
  const newCounty = $('#county').val();
  const newdistrict = $('#district').val();
  const newPlaceDescription = $('#place-description').val();
  const newCourt = $('#court').val();
  const newMoney = $('#money').val();
  const newLevel = $('#level').val();
  const newLevelDescription = $('#level-description').val();
  const newPeopleHave = $('#people-have').val();
  const newPeopleNeed = $('#people-need').val();
  const newGroupDescription = $('#group-description').val();

  console.log(
    newTitle,
    newDate,
    newTime,
    newTimeduration,
    newNet,
    newCounty,
    newdistrict,
    newPlaceDescription,
    newCourt,
    newMoney,
    newLevel,
    newLevelDescription,
    newPeopleHave,
    newPeopleNeed,
    newGroupDescription
  );
  // 更新資料庫表單
  console.log('hi');
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
