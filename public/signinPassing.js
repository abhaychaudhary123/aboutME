const clickbutton = document.getElementById('Submitclick');
const displayMessage = document.getElementById('displayMessage2');
const showSpiner = document.getElementById('showSpin');
const redirect = document.getElementById('redirect');

clickbutton.addEventListener('click', async () => {

  const UserName = document.getElementById('name').value;
  const Email = document.getElementById('email').value;
  const PhoneNumber = document.getElementById('phone').value;
  const Password = document.getElementById('password').value;
  const ConfirmPassword = document.getElementById('cpassword').value;

 
    // document.getElementById('name').value = '';
    // document.getElementById('email').value = '';
    // document.getElementById('phone').value = '';
    // document.getElementById('password').value = '';
    // document.getElementById('cpassword').value = '';

    const passData = {
      u: UserName,
      e: Email,
      p: PhoneNumber,
      pa: Password,
      cpa: ConfirmPassword
    };

    try {
      const headers = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passData)
      };
      
      const res = await fetch('/signinApiendpoint', headers);
      const data = await res.json();

      if (!data.un || !data.e || !data.p || !data.pa || !data.cpa) {
        displayMessage.innerHTML = data.allfieldsrequired;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
      }
      //  else {
      //   displayMessage.innerHTML = 'Data added successfully';
      //   displayMessage.style.display = "block";
      //   displayMessage.style.color = "green";
      // }


      if (data.emailMsg) {
        displayMessage.innerHTML = data.emailMsg;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
      }

      if (data.passwordNotMatch) {
        displayMessage.innerHTML = data.passwordNotMatch;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
      }

      if (data.phoneMsg) {
        displayMessage.innerHTML = data.phoneMsg;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
      }


      if (data.passwordLength) {
        displayMessage.innerHTML = data.passwordLength;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
      }

      if (data.exists) {
        displayMessage.innerHTML = data.exists;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
      }

      if (data.phoneexists) {
        displayMessage.innerHTML = data.phoneexists;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
      }

      if (data.message) {
        displayMessage.innerHTML = data.message;
        displayMessage.style.display = "block";
        showSpiner.style.display = "block";
        clickbutton.style.display = "none";
        redirect.style.display = "none";
        showSpiner.style.color = "green";
        displayMessage.style.color = "green";
        window.setTimeout(function(){
          window.location.href = "/login";
      }, 3000);
      }

      
      
    } catch (e) {
      console.log(e);
    }
  
});
