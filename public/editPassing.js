//save name or address



const saveit = document.getElementById('saveit');

saveit.addEventListener('click', async () => {

  const pName = document.getElementById('pName').value;
const pEmail = document.getElementById('pEmail').value;
const pAddress = document.getElementById('pAddress').value;

  const sendsaveddata = {pName,pEmail,pAddress};
console.log(sendsaveddata);
 
    try {
      const setheaders = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(sendsaveddata)
      };

      const response = await fetch('/savedataApi', setheaders);
      const data = await response.json();
      
     

    } catch(e) {
      console.log(e);
    }
  
});

//add skill



const addSkill = document.getElementById('addSkill');

addSkill.addEventListener('click', async () => {

  const pgetSkill = document.getElementById('getSkill').value;
  if(pgetSkill === '')
  {
    console.log("field emptly");
  }
  else{
    const setskill = {pgetSkill};
    console.log(setskill);
      try {
        const setheaders = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(setskill)
        };
  
        const response = await fetch('/addSkillApi', setheaders);
        const data = await response.json();
        
       
  
      } catch(e) {
        console.log(e);
      }
  }

 
  
});

//delete skill

async function deleteItem(id) {
  try {
      const setheaders = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
      };

      const response = await fetch(`/delprofileSkills/${id}`, setheaders);
      const data = await response.json();
      console.log(data);

  } catch(e) {
      console.log(e);
  }
}


// add qaulifications


const addQualification = document.getElementById('addQualification');

addQualification.addEventListener('click', async () => {

  const quali = document.getElementById('quali').value;
  const school = document.getElementById('school').value;
  const board = document.getElementById('board').value;
  const cgpa = document.getElementById('cgpa').value;
  const year = document.getElementById('year').value;

  

  if(quali === '' || school === '' || board === '' || cgpa === '' || year === '')
  {
    console.log("field empty");
  }
  else{
      try {
        const passQualification = {quali,school,board,cgpa,year};
        const setheaders = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(passQualification)
        };
  
        const response = await fetch('/QualificationApi', setheaders);
        const data = await response.json();
        
       
  
      } catch(e) {
        console.log(e);
      }
  }

 
  
});

//delete Qualification

async function deleteQualificationItem(id) {
  try {
      const setheaders = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
      };

      const response = await fetch(`/QualificationApi/${id}`, setheaders);
      const data = await response.json();
      console.log(data);

  } catch(e) {
      console.log(e);
  }
}


// add achievement


const addAchievement = document.getElementById('addAchievement');

addAchievement.addEventListener('click', async () => {

  const inputAchievement = document.getElementById('inputAchievement').value;

  

  if(inputAchievement === '' )
  {
    console.log("field empty");
  }
  else{
      try {
        const passAchievement = { inputAchievement };
        const setheaders = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(passAchievement)
        };
  
        const response = await fetch('/AchievementApi', setheaders);
        const data = await response.json();
  
      } catch(e) {
        console.log(e);
      }
  }

 
  
});


//delete Achievement

async function deleteAchievementItem(id) {
  try {
      const setheaders = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
      };

      const response = await fetch(`/AchievementApi/${id}`, setheaders);
      const data = await response.json();
      console.log(data);

  } catch(e) {
      console.log(e);
  }
}


// add Projects


const addProjects = document.getElementById('addProjects');

addProjects.addEventListener('click', async () => {

  const inputProjects = document.getElementById('inputProjects').value;

  

  if(inputProjects === '' )
  {
    console.log("field empty");
  }
  else{
      try {
        const passProjects = { inputProjects };
        const setheaders = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(passProjects)
        };
  
        const response = await fetch('/ProjectsApi', setheaders);
        const data = await response.json();
  
      } catch(e) {
        console.log(e);
      }
  }

 
  
});



//delete projects

async function deleteProjectsItem(id) {
  try {
      const setheaders = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
      };

      const response = await fetch(`/ProjectsApi/${id}`, setheaders);
      const data = await response.json();
      console.log(data);

  } catch(e) {
      console.log(e);
  }
}


// add Activities


const addActivities = document.getElementById('addActivities');

addActivities.addEventListener('click', async () => {

  const inputActivities = document.getElementById('inputActivities').value;

  

  if(inputActivities === '' )
  {
    console.log("field empty");
  }
  else{
      try {
        const passActivities = { inputActivities };
        const setheaders = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(passActivities)
        };
  
        const response = await fetch('/ActivitiesApi', setheaders);
        const data = await response.json();
  
      } catch(e) {
        console.log(e);
      }
  }

 
  
});



//delete activities

async function deleteActivityItem(id) {
  try {
      const setheaders = {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
      };

      const response = await fetch(`/ActivitiesApi/${id}`, setheaders);
      const data = await response.json();
      console.log(data);

  } catch(e) {
      console.log(e);
  }
}
