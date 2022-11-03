// 渲染某團詳細資料
(async () => {
  // 抓網址的 query string (?id=21)
  const url = new URL(window.location.href);
  const id = url.search;

  // 打 group details API
  let detail = await axios.get(`/api/1.0/group/details${id}`);
  [groupDetail] = detail.data.result;
  console.log(groupDetail);
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
        <button id="edit" class="edit">編輯表單</button>
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
