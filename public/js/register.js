$('#signup-btn').click(async (e) => {
  e.preventDefault();

  // 使用者未填欄位，發出 alert
  let OK = true;
  $('.signup-container input')
    .filter('[required]') // 找出有 required 的屬性
    .each((i, requiredField) => {
      if (!$(requiredField).val()) {
        OK = false;
        Swal.fire({
          icon: 'error',
          title: `請輸入${$(requiredField).attr('name')}欄位`
        });
        return false; // break
      }
    });

  const signupInfo = {
    username: $('#signup-username').val(),
    email: $('#signup-email').val(),
    password: $('#signup-password').val()
  };

  // 使用者填欄位填寫完畢，才打 API
  if (OK) {
    try {
      const result = await axios.post('/api/1.0/user/signup', signupInfo);
      console.log(result.data.result);

      //   存 token 到 local storage
      const userProfile = result.data.result;
      const { userId } = userProfile;
      localStorage.setItem('jwtToken', userProfile.jwtToken);

      //   跳轉到 profile.html
      window.location.href = `/profile.html?id=${userId}`;
    } catch (error) {
      console.log(error);
      // 後端再次檢查
      const Error = error.response.data.error;
      if (Error === 'Invalid email format') {
        Swal.fire({
          icon: 'error',
          title: '請填寫正確的 email 格式'
        });
      } else if (Error === 'Email Already Exists') {
        Swal.fire({
          icon: 'error',
          title: 'email 已經註冊過'
        });
      } else if (Error === 'Weak Password') {
        Swal.fire({
          icon: 'error',
          title: 'password 強度不足',
          text: '密碼長度至少 8 碼，且需包含要 1 個大寫，1 個小寫及 1 個特殊符號'
        });
      }
    }
  }
});

$('#signin-btn').click(async (e) => {
  e.preventDefault();
  // 使用者未填欄位，發出 alert
  let OK = true;
  $('.signin-container input')
    .filter('[required]') // 找出有 required 的屬性
    .each((i, requiredField) => {
      if (!$(requiredField).val()) {
        OK = false;
        Swal.fire({
          icon: 'error',
          title: `請輸入${$(requiredField).attr('name')}欄位`
        });
        return false; // break
      }
    });

  const signinInfo = {
    email: $('#signin-email').val(),
    password: $('#signin-password').val()
  };

  // 使用者填欄位填寫完畢，才打 API
  if (OK) {
    try {
      const result = await axios.post('/api/1.0/user/signin', signinInfo);
      //   存 token 到 local storage
      const userProfile = result.data.result;
      const { userId } = userProfile;
      localStorage.setItem('jwtToken', userProfile.jwtToken);

      //   跳轉到 profile.html
      window.location.href = `/profile.html?id=${userId}`;
    } catch (error) {
      // 後端檢查密碼
      const Error = error.response.data.error;
      if (Error === 'Signin failed') {
        Swal.fire({
          icon: 'error',
          title: '信箱或密碼錯誤'
        });
      }
    }
  }
});

$('#to-signup').click(async (e) => {
  e.preventDefault();
  $('#signin-form').hide();
  $('#signup-form').show();
});

$('#to-signin').click(async (e) => {
  e.preventDefault();
  $('#signup-form').hide();
  $('#signin-form').show();
});

$('.logo').click(async () => {
  window.location.href = '/index.html';
});
