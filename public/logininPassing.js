const clickbutton = document.getElementById('Submitclick');
const displayMessage = document.getElementById('displayMessage');

clickbutton.addEventListener('click', async () => {
  const Email = document.getElementById('email').value;
  const Password = document.getElementById('pass').value;

  const loginpassData = {
    e: Email,
    pa: Password
  }

  try {
    const setheaders = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginpassData)
    };

    const response = await fetch('/loginApiendpoint', setheaders);
    const data = await response.json();
    console.log(data);

    if (data.success) {
      displayMessage.style.display = "none";
      window.location.href = data.redirect;
    } else if (data.allfieldsrequired) {
      displayMessage.innerHTML = data.allfieldsrequired;
      displayMessage.style.display = "block";
      displayMessage.style.color = "red";
    } else if (data.emailMsg) {
      displayMessage.innerHTML = data.emailMsg;
      displayMessage.style.display = "block";
      displayMessage.style.color = "red";
    } else if (data.passwordMsg) {
      displayMessage.innerHTML = data.passwordMsg;
      displayMessage.style.display = "block";
      displayMessage.style.color = "red";
    } else if (data.message) {
      displayMessage.innerHTML = data.message;
      displayMessage.style.display = "block";
      displayMessage.style.color = "red";
    } else {
      if (data.redirect && !data.allfieldsrequired && !data.emailMsg && !data.passwordMsg && !data.message && !data.findCredentials) {
        displayMessage.style.display = "none";
        window.location.href = data.redirect;
      }

      if (data.allfieldsrequired) {
        displayMessage.innerHTML = data.allfieldsrequired;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
      }

      if (!data.emailMsg) {
        displayMessage.innerHTML = data.emailMsg;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
        console.log("Email error message displayed: " + data.emailMsg);
      }

      if (!data.passwordMsg) {
        displayMessage.innerHTML = data.passwordMsg;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
        console.log("Password error message displayed: " + data.passwordMsg);
      }

      if (data.message) {
        displayMessage.innerHTML = data.message;
        displayMessage.style.display = "block";
        displayMessage.style.color = "red";
        console.log("No user message displayed: " + data.message);
      }
    }
  } catch (e) {
    console.log(e);
  }
});
