const clickbutton = document.getElementById('logoutUser');

clickbutton.addEventListener('click', async () => {

 
    try {
      const setheaders = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch('/logoutApiendpoint', setheaders);
      const data = await response.json();

      if(data.redirect){
        window.location.href = data.redirect;
      }

    } catch(e) {
      console.log(e);
    }
  
});

//all devices



const logoutAll = document.getElementById('logoutalldevices');

logoutAll.addEventListener('click', async () => {

 
    try {
      const setheaders = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch('/logoutAllApiendpoint', setheaders);
      const data = await response.json();

      if(data.redirect){
        window.location.href = data.redirect;
      }

    } catch(e) {
      console.log(e);
    }
  
});


//edir pro

const edit = document.getElementById('editPro');

edit.addEventListener('click', async () => {

 
    try {
      const setheaders = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch('/editProApi', setheaders);
      const data = await response.json();
      if(data.redirect){
        window.location.href = data.redirect;
      }
     

    } catch(e) {
      console.log(e);
    }
  
});

