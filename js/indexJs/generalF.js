

function filterByAgent(e){
    const agentName = e.target.value.toLowerCase();
    if(agentName == "all"){
       loadTasks();
       return;
    }
    let counter = 0;
     document.querySelectorAll("#filterAgentId").forEach((task) =>{
       const item = task.textContent;
    if (item.toLowerCase().indexOf(agentName) != -1){
                 $(task.parentElement.parentElement.parentElement.parentElement).fadeIn();
                 counter++;
    }
    else 
             $(task.parentElement.parentElement.parentElement.parentElement).fadeOut();
    });
        counterCheck(counter);
 }
 
 function counterCheck(counter){
    if(counter == 0){
        document.querySelector("#taskTitle").innerHTML="No results"
        $(document.querySelector("#taskCount")).fadeOut();
    }else{
        document.querySelector("#taskTitle").innerHTML="Current tasks";
        $(document.querySelector("#taskCount")).fadeIn();
        document.querySelector("#taskCount").innerHTML="Task count: "+counter;
    }
 }
 
 
 function removePointer(add){
 
    if(add){
        $("#agentFilter").addClass("pointerEvents");
        $("#agentFilter").parent().addClass("noCursor");
    }else{
         $("#agentFilter").removeClass("pointerEvents");
         $("#agentFilter").parent().removeClass("noCursor");
        }
 }

 
async function fetcher(fetchQuery, options){
    try {
     fetch(fetchQuery, options);
    } catch {
       return;
    }
    return true;
 }
 
function setAgent(system, errorTitle, taskId){

    const agentPopup =` <div id="agentEditor">
                         <span class = "hide">${taskId}</span>
                         <h3>${system} error - ${errorTitle}</h3>
                         <div class="form-group">
                            <select id="agent" class="form-control">
                               <option disabled selected>Agent</option>
                               <option>Luis Rosales</option>
                               <option>Mery Deilaire</option>
                               <option>Adwil Castillo</option>
                            </select>
                          </div>
                <button id="setAgent" class=" btn btn-outline-secondary ">Assign task</button>
                      </div>
                      `;
                      
      modalAddon(agentPopup, true, false, false);
 
 }
 
//PENDING TASKS: SET FILTERS BY FIXER, ETC...
$(document).keyup(function(e) {
    if (e.keyCode === 27) removeOutsideModal();   // esc
  });
 
 
  
 function taskValidation(field, message, comparator, id){
    if(field == null || field == comparator){
       modalAddon(message, true, false);
       document.querySelector("#"+id).focus();
       return false;
    }
    return true;
 }  

//POP OVER TASK STATUS
$('body').popover({
    html: true,
    content: function() {
       return $('#popover-content').html();
    },
    trigger: "hover",
    selector: ".popup"
 });
 

function editDelTasks(e) {
    if(e.target.classList.contains("fa-cog")){
          //Remove opened divs 
          const divs = document.body.querySelectorAll(".edit-deleteReview");
          //Remove opened divs 
          const editDelReview = e.target.parentElement.querySelector(".edit-deleteReview");
       if(editDelReview.style.display == "block"){
          e.target.className += " fa-spin-reverse";
           editDelReview.style.display = "none"
       }
       else{
          //Remove opened divs 
          for (i = 0; i<divs.length; i++)
                   divs[i].style.display = "none";
          //Remove opened divs 
          e.target.className += " fa-spin";
          editDelReview.style.display = "block"
       }
       setTimeout(() =>{
             e.target.classList.remove("fa-spin");
             e.target.classList.remove("fa-spin-reverse");
       }, 500);
    }
 }



 
async function loadTasks(){

   const task = document.querySelector("#comment").value = "Agent name:\nPatient name:\nDOB:\n\nIssue:\n\nResolution:";

   const taskContainer = document.querySelector("#task");
   $(taskContainer).fadeOut(200);
   setTimeout(()=>{
   taskContainer.innerHTML="";
   },300);
   
   const taskTitle = document.querySelector("#taskTitle");
  //FETCH TEACHER tasks FROM DB
   let response;
     try {
      response = await fetch(`https://ca-42yan.ondigitalocean.app/api/v1/tasks`);
      } catch (e) {
        taskTitle.classList += " red halfOpacity";
        taskTitle.innerHTML = "Error logger couldn't connect to the server";
         $(taskTitle).fadeIn(200);
         //document.querySelector("head").innerHTML += '<meta https-equiv="refresh" content="120"/>';
         setTimeout(() => {
            loadTasks();
            console.clear();
         },10000);
      return;
     }
     
        taskTitle.classList.remove("red");
        taskTitle.classList.remove("halfOpacity");

   let tasks = await response.json();
       tasks = tasks.data;
       if(!tasks){
        taskTitle.classList += " red halfOpacity";
        taskTitle.innerHTML = "Error logger couldn't connect to database";
        removePointer(true);
        $(taskTitle).fadeIn(200);
         
         setTimeout(() => {
            loadTasks();
            console.clear();
         },10000);
         return;
       }
       //console.log(tasks)
   //FETCH tasks FROM DB
     if(tasks.length == 0){
      taskTitle.innerHTML = 'No pending tasks';
        removePointer(true);
        $(taskTitle).fadeIn(200);
      return;
     }
        removePointer(false);
        //Load tasks into html
      taskTitle.innerHTML = 'Current tasks';
      
      $(taskTitle).fadeIn(200);

         show = false;
        tasks.forEach((task) => {

         let editDeleteDiv = `
         <i class="fa">
            <div class="col-sm-4">
            <div class="constant-width btn edit-deleteReview slideTop">
               <button id="edit" class="btn btn-block btn-outline-secondary constant-width">Edit</button>
               <button id="delete" class="btn btn-block btn-outline-danger constant-width">Delete</button>
               <button id="complete" class="btn btn-block btn-outline-success constant-width">Complete</button>
            </div>
            </div>
         </i>`; 

         let facog = '<i class="fa fa-cog black"></i>';

               let  color; //for task status
               //Get agent assigment bar on or editdelreview on place 
            if(task.agent == "Not set"){
               //Remove facog and options
               facog = "";
               editDeleteDiv="";
               //Add agent assignment link
               task.agent = `<a id="assignAgent" href="">${task.agent}</a>`
               //set new task status
               color = "yellow";
            }else{

               //get edited status
                  if(task.edited)
                     color = "red";// edited
                  else
                     color = "green";// unedited
               //get edited status
            }

            //Filtering what I want to show
           if(task.deleted == true)
               return;
           else if(task.completed == true)
               return;
           else
               show = true;
            //Filtering what I want to show

           const colContainer = document.createElement("div");
           colContainer.className = "col-sm-12";
           let taskDiv = document.createElement("div");
           taskDiv.className = "alterConstant-width btn alterReview cleaner col-sm-10 offset-sm-1";

            
            //Just for the fun of it
            let agentColor = "", systemColor = "";
            if(task.agent == "Luis Rosales")
               agentColor = "red";
            else if(task.agent == "Mery Deilaire")
               agentColor = "blue";
            else
               agentColor = "darkgray";

            if(task.issuedTo == "Intergy")
               systemColor = "green"               
            //Just for the fun of it

            
            taskDiv.innerHTML +=  `
                  <span id="revId" >${task._id}</span> 
                  
                  
                  
                  <h3 class="errorSys ${systemColor}">
                  <strong>${task.issuedTo} - ${task.title} - </strong>
                     
                     <span><strong id="filterAgentId" class="${agentColor}">${task.agent} </strong></span> 

                     <i class="fas fa-circle popup ${color}" data-toggle="popover" data-original-title="Task status"></i>

                     <span>${facog} ${editDeleteDiv} </span>
                  </h3>
                  <br>
                     <pre class=""><p>${task.task}</p></pre>
                  
                     <span class="bold">Created at: ${task.date}</span> 
                     `;
           //Getting replies on the right tasks
           //Getting replies on the right tasks
           
              colContainer.appendChild(taskDiv);
              colContainer.innerHTML+="<br><br>";
              setTimeout(()=>{
               taskContainer.appendChild(colContainer);
               },500);
        });

         if(!show){
            
            taskTitle.innerHTML = "No pending tasks";
            removePointer(true);
         
         }else{

            setTimeout(()=>{
               $(taskContainer).fadeIn(); 
               },700);

               setTimeout(()=>{
   
                  const taskCount = document.querySelector("#taskCount");
                  taskCount.innerHTML = "Task count: "+calcCount(taskContainer);
                  $(taskCount).fadeIn(100);
                  
                  if(calcCount(taskContainer) == 0){
                     removePointer(false);
                  }
                  },550);
            }
           
                //Load tasks into html
         
            }
    
function calcCount(element){
   return element.childElementCount;
   }

   
function postTasks(e){
   e.preventDefault(); 
      //const agent = document.querySelector("#agent").value;
      //!taskValidation(agent, "Please select the agent", "Agent", "agent") ||
            
      const issuedTo = document.querySelector("#issuedTo").value;
      const title = document.querySelector("#title").value;
      const task = document.querySelector("#comment").value;
      const newDate = new Date().toLocaleString("en-US", {timeZone: "America/Dominica"});
      
      const temp = newDate.split("/");
      const date = temp[1]+"/"+temp[0]+"/"+temp[2];

     //VALIDATIONS      VALIDATE POSTING NOTHINGNESS
         if(!taskValidation(issuedTo, "Please select the error type", "Error type", "issuedTo") ||
            !taskValidation(title, "Please add a title", "", "title"))
               return; 

            if(task.trim().length == 0){
            //get modal
               modalAddon("Please add a task", true);
               task.focus();
               return;
           }
     //VALIDATIONS      VALIDATE POSTING NOTHINGNESS

      const data = {title, issuedTo, task, date};
      const options = {
         method: 'POST',
         headers:{
            'Content-Type': 'application/json'
         },
         body:JSON.stringify(data)
      }
      if(fetcher("https://ca-42yan.ondigitalocean.app/api/v1/tasks", options)){
         document.querySelector("#comment").style.height = "180px";
         document.querySelector("#comment").value = '';//clear field
         document.querySelector("#issuedTo").value = 'Error type';//clear field
         document.querySelector("#title").value = '';//clear field
            //get modal
               modalAddon("Task added!", true);
      }
}


function updateTasks(e){

   const issuedTo = document.querySelector("#issuedToup").value;
   const title = document.querySelector("#titleup").value;
   const task = document.querySelector("#editor").value;

  //VALIDATIONS      VALIDATE POSTING NOTHINGNESS
      if(!taskValidation(issuedTo, "Please select the error type", "Error type", "issuedTo") ||
         !taskValidation(title, "Please add a title", "", "title"))
            return; 

         if(task.trim().length == 0){
         //get modal
            modalAddon("Please add a task", false, false);
         document.querySelector("#comment").focus();
         return;
        }
  //VALIDATIONS      VALIDATE POSTING NOTHINGNESS

  const data = {title, issuedTo, task, edited: true};

      const options = {
         method: 'PUT',
         headers:{
            'Content-Type': 'application/json'
         },
         body:JSON.stringify(data)
      } 

         if(fetcher(`https://ca-42yan.ondigitalocean.app/api/v1/tasks/${activeR.value}`, options))
               modalUserExp("Task updated!");
}
