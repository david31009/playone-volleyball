async function statusChangeCallback(response) {
  if (response.status === 'connected') {
    // Logged into your webpage and Facebook.
    // testAPI();

    const signinInfo = {
      provider: 'facebook',
      accessToken: response.authResponse.accessToken
    };

    try {
      const result = await axios.post('/api/1.0/user/signin', signinInfo);

      //   存 token 到 local storage
      const userProfile = result.data.result;
      const { userId } = userProfile;
      localStorage.setItem('jwtToken', userProfile.jwtToken);

      //   登入成功後，跳轉到 profile.html
      window.location.href = `/profile.html?id=${userId}`;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '無法使用 facebook 登入'
      });
    }
  }
}

function checkLoginState() {
  FB.getLoginStatus((response) => {
    // See the onlogin handler
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function () {
  FB.init({
    appId: '633489238189413',
    cookie: true, // Enable cookies to allow the server to access the session.
    xfbml: true, // Parse social plugins on this webpage.
    version: 'v15.0' // Use this Graph API version for this call.
  });

  // 頁面重載會自動登入，所以註解掉
  // FB.getLoginStatus(function (response) {
  //   // Called after the JS SDK has been initialized.
  //   statusChangeCallback(response); // Returns the login status.
  // });
};

function testAPI() {
  // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  console.log('Welcome!  Fetching your information.... ');

  // ?fields=name,email 可自行加入
  FB.api('/me?fields=name,email', (response) => {
    console.log(`Successful login for:  + ${response.name}`);
  });
}
