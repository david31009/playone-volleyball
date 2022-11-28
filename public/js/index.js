// 渲染字卡
(async () => {
  const getCards = await axios.get('/api/1.0/group');
  const allPage = await axios.get('/api/1.0/group/allpage');
  const cardInfo = getCards.data.firstPage;
  const { totalPage } = allPage.data;

  $('.group-top').html('最新揪團');
  // 渲染總頁數
  for (let i = 0; i < totalPage; i++) {
    $('.page').append(
      `<div id="page=${i + 1}" class="per-page" onclick="nextPage(this)">${
        i + 1
      }
      </div>
      `
    );
  }

  // 渲染第一頁的團
  for (let i = 0; i < cardInfo.length; i++) {
    const newDom = $('.card').first().clone().removeAttr('hidden');

    // 按照日期，剩餘報名名額排列
    newDom.addClass('no-filter');
    newDom.attr('href', `/group.html?id=${cardInfo[i].groupId}`);
    newDom
      .children('.card-left')
      .children('.card-title')
      .html(`${cardInfo[i].title}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-date')
      .html(`📅 ${cardInfo[i].date}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-time')
      .html(`${cardInfo[i].time}`);
    newDom
      .children('.card-left')
      .children('.card-time-container')
      .children('.card-time-duration')
      .html(`${cardInfo[i].timeDuration} hr`);
    newDom
      .children('.card-left')
      .children('.card-place-container')
      .children('.card-place')
      .html(`📍 ${cardInfo[i].place}`);
    newDom
      .children('.card-left')
      .children('.card-place-container')
      .children('.card-place-des')
      .html(`${cardInfo[i].placeDescription}`);
    newDom
      .children('.card-left')
      .children('.card-creator')
      .html(`💁🏻‍♂️ ${cardInfo[i].username}`);
    newDom
      .children('.card-right')
      .children('.card-net')
      .html(`網高: ${cardInfo[i].net}`);
    newDom
      .children('.card-right')
      .children('.card-group-level')
      .html(`程度: ${cardInfo[i].groupLevel}`);
    newDom
      .children('.card-right')
      .children('.card-money')
      .html(`費用: ${cardInfo[i].money} 元`);
    newDom
      .children('.card-right')
      .children('.card-people-have')
      .html(`內建: ${cardInfo[i].peopleHave} 人`);

    $('#card-group').append(newDom);
  }
})();
