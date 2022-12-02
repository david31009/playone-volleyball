const eventSource = new EventSource('/api/1.0/sse');

// add a new style 'notify'
$.notify.addStyle('notify', {
  html: `<div>
            <img class="bell" src="./images/notification.gif" height="30">
            <div class='title' data-notify-html='title'></div>
            <button class='yes' data-notify-text='button'>去看看</button>
         </div>
         `
});

eventSource.onmessage = (event) => {
  // listen for click events from this style
  $(document).on('click', '.notifyjs-notify-base .yes', () => {
    window.location.href = `/group.html?id=${event.data}`;
  });

  $.notify(
    {
      title: '有人建立新的揪團 !'
    },
    {
      style: 'notify',
      autoHide: true,
      autoHideDelay: 10000,
      clickToHide: false
    }
  );
};

eventSource.onerror = function () {
  eventSource.close();
};
