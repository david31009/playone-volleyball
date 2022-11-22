const { localStorage } = window;
const jwtToken = localStorage.getItem('jwtToken');

async function loginCheck() {
  // 從 local storage 拿 jwt token
  try {
    await axios.get('/api/1.0/user/auth', {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    });
    $('.log-out').html('登出');
    // console.log(result);
  } catch (error) {
    $('.log-out').html('登入');
  }
}

loginCheck();

$('.log-out').click(() => {
  localStorage.clear();
  window.location.href = '/register.html';
});
