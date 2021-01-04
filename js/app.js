

document.addEventListener("DOMContentLoaded", loadTasks())
document.querySelector("#agentFilter").addEventListener("change", filterByAgent);
 
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

async function loadTasks(){

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
         show = false;
        for (t in tasks){
               let  color; //for task status
               //Get agent assigment bar on or editdelreview on place 
            if(tasks[t].agent == "Not set"){
               //Remove facog and options
               facog = "";
               editDeleteDiv="";
               //Add agent assignment link
               tasks[t].agent = `<a id="assignAgent" href="">${tasks[t].agent}</a>`
               //set new task status
               color = "yellow";
            }else{
               //get edited status
                  if(tasks[t].edited)
                     color = "red";// edited
                  else
                     color = "green";// unedited
               //get edited status
            }

            //Filtering what I want to show
           if(tasks[t].deleted == true)
               continue;
           else if(tasks[t].completed == true)
               continue;
           else
               show = true;
            //Filtering what I want to show

           const colContainer = document.createElement("div");
           colContainer.className = "col-sm-12";
           let taskDiv = document.createElement("div");
           taskDiv.className = "alterConstant-width btn alterReview cleaner col-sm-10 offset-sm-1";

            
            const fulldate = tasks[t].date.split(" ");
            const newDate = fulldate[0]+", "+fulldate[1]+" "+fulldate[2]+" "+fulldate[3]+", "+fulldate[4];
            //Just for the fun of it
            let agentColor = "", systemColor = "";
            if(tasks[t].agent == "Luis Rosales")
               agentColor = "red";
            else if(tasks[t].agent == "Francisco Gerónimo")
               agentColor = "blue";
            else
               agentColor = "darkgray";

            if(tasks[t].issuedTo == "Intergy")
               systemColor = "green"               
            //Just for the fun of it

            
            taskDiv.innerHTML +=  `
                  <span id="revId" >${tasks[t]._id}</span> 
                  
                  
                  
                  <h3 class="errorSys ${systemColor}">
                  <strong>${tasks[t].issuedTo} - ${tasks[t].title} - </strong>
                     
                     <span><strong id="filterAgentId" class="${agentColor}">${tasks[t].agent} </strong></span> 

                     <i class="fas fa-circle popup ${color}" data-toggle="popover" data-original-title="Task status"></i>

                     <span>${facog} ${editDeleteDiv} </span>
                  </h3>


                  

                  <br>

                     <pre class=""><p>${tasks[t].task}</p></pre>
                  
                     <span>${newDate}</span> 
                     `;
           //Getting replies on the right tasks
           //Getting replies on the right tasks
           
              colContainer.appendChild(taskDiv);
              colContainer.innerHTML+="<br><br>";
              setTimeout(()=>{
               taskContainer.appendChild(colContainer);
               },500);
        }
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

//ADD REVIEW 
const taskPost = document.querySelector("#postTask");
  
taskPost.addEventListener('submit', (e) => {
   e.preventDefault(); 
      //const agent = document.querySelector("#agent").value;
      //!taskValidation(agent, "Please select the agent", "Agent", "agent") ||
            
      const issuedTo = document.querySelector("#issuedTo").value;
      const title = document.querySelector("#title").value;
      const task = document.querySelector("#comment").value;

     //VALIDATIONS      VALIDATE POSTING NOTHINGNESS
         if(!taskValidation(issuedTo, "Please select the error type", "Error type", "issuedTo") ||
            !taskValidation(title, "Please add a title", "", "title"))
               return; 

            if(task.trim().length == 0){
            //get modal
               modalAddon("Please add a task", true);
               document.querySelector("#comment").focus();
               return;
           }
     //VALIDATIONS      VALIDATE POSTING NOTHINGNESS

      const data = {title, issuedTo, task};
      const options = {
         method: 'POST',
         headers:{
            'Content-Type': 'application/json'
         },
         body:JSON.stringify(data)
      }
      if(fetcher("https://ca-42yan.ondigitalocean.app/api/v1/tasks", options)){
         document.querySelector("#comment").style.height = "37px";
         document.querySelector("#comment").value = '';//clear field
         document.querySelector("#issuedTo").value = 'Error type';//clear field
         document.querySelector("#title").value = '';//clear field
            //get modal
               modalAddon("Task added!", true);
      }
});
//ADD REVIEW   

//UPDATE REVIEW WITH NEW EDIT 
document.querySelector("#updateReview").addEventListener("click", (e) =>{

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
});
//UPDATE REVIEW WITH NEW EDIT

async function fetcher(fetchQuery, options){
   try {
    fetch(fetchQuery, options);
   } catch {
      return;
   }
   return true;
}


//EDIT OR DELETE REVIEW 
document.body.addEventListener("click", (e) =>{

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
});
//EDIT OR DELETE REVIEW


const closee = document.querySelector("#closeModal");
const modal_container = document.querySelector(".modal-container");
const modal = document.querySelector(".modal");
const body = document.querySelector("body");
const html = document.querySelector("html");
const activeR = document.querySelector("#activeRevId");
const h = document.querySelector(".editorTitle");
//modal fields
const responseEdit = document.querySelector("#editor");
const issueTitle = document.querySelector("#titleup");
const ErrorType = document.querySelector("#issuedToup");
//modal fields


//EVENT DELEGATION
document.body.addEventListener("click", (e)=>{

   const taskContainer = document.querySelector("#task");
   const taskCount = document.querySelector("#taskCount");
   const taskTitle = document.querySelector("#taskTitle");

   if(e.target.id === "edit"){
       //EDIT TASK
            h.innerHTML = "Task editor";
            //Get current task ID
       activeR.value =  e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".alterReview>span#revId").innerHTML;
      //get current value from task
      const p = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".alterReview>pre>p");
      
      //VALUES ASSIGMENT
      const Fields = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".alterReview>h3").innerText.split("-");

      //set error type
      document.querySelector("#issuedToup").value=Fields[0].trim();
      //set issue title
      document.querySelector("#titleup").value=Fields[1].trim();
      responseEdit.value = p.innerHTML;

      //VALUES ASSIGMENT



      //Set new height based on amount of lines
      let lines = responseEdit.value.split(/\r|\r\n|\n/);
      responseEdit.style.height = parseInt((lines.length)  * 37)+"px";
      responseEdit.focus();

         body.classList.add("body")
         html.classList.add("body")
         modal_container.classList.add("popmodal");
        //remove options menu
        $(e.target.parentElement).fadeOut(300);
      }else if(e.target.id == "delete") {
         //DELETE TASK
         //Get review ID = activeR
         //console.log(e.target.parentElement.parentElement.parentElement.querySelector("#revId"));
         activeR.value =  e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".alterReview>span#revId").innerHTML;
         //div parent to remove 
         const issueDiv = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
         //DELETE request to api
         const data = {deleted:true};
         const options = {
            method: 'PUT',
            headers:{
               'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
         }
         if(fetcher(`https://ca-42yan.ondigitalocean.app/api/v1/tasks/${activeR.value}`, options)){
            //remove options menu
               $(e.target.parentElement).fadeOut(200);
               //remove div container

               $(issueDiv).fadeOut(2000);
               modalAddon("Task deleted!", true, false);

               setTimeout(()=>{

                  issueDiv.parentNode.removeChild(issueDiv);
                  if(document.querySelectorAll("#revId").length == 0){
                        taskTitle.innerHTML="No pending tasks";
                        $(taskCount).fadeOut();
                  }

                     taskCount.innerHTML = "Task count: "+calcCount(taskContainer);

               },2100);
              
               //get modal
         }
         //DELETE TASK
      }else if(e.target.id == "complete") {
         //COMPLETE TASK
         //Get review ID = activeR
         //console.log(e.target.parentElement.parentElement.parentElement.querySelector("#revId"));
         activeR.value =  e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".alterReview>span#revId").innerHTML;
         //div parent to remove 
         const issueDiv = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
         //DELETE request to api
         const data = {completed:true};
         const options = {
            method: 'PUT',
            headers:{
               'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
         }

         if(fetcher(`https://ca-42yan.ondigitalocean.app/api/v1/tasks/${activeR.value}`, options)){
            //remove options menu
               $(e.target.parentElement).fadeOut(200);
               //get modal
               //remove registry
               $(issueDiv).fadeOut(2000);
               modalAddon("Task completed!", true, false);
               
               setTimeout(()=>{
                  issueDiv.parentNode.removeChild(issueDiv);
                  if(document.querySelectorAll("#revId").length == 0){

                     taskTitle.innerHTML="No pending tasks";
                        $(taskCount).fadeOut();
                  }

                     taskCount.innerHTML = "Task count: "+calcCount(taskContainer);

               },2100);



         }
         //COMPLETE TASK
      }

         //AGENT TASK ASSIGNMENT
         if(e.target.id == "assignAgent"){
               e.preventDefault();
            const fields = e.target.parentElement.parentElement.parentElement.innerText.split("-");
            //set error type = fields[0].trim();
            //set issue title = fields[1].trim();
            const taskId = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML;

            body.classList.add("body");
            html.classList.add("body");
            setAgent(fields[0].trim(), fields[1].trim(), taskId)
         }
   
         if(e.target.id == "setAgent"){
            $("#agentFilter").val("All");
            const taskId = document.querySelector("#setAgent").parentElement.firstElementChild.innerHTML;
            const agentName = document.querySelector("#setAgent").parentElement.querySelector("#agent").value; 
            if(agentName == "Agent"){
               //Get agent editor and hide it
               const agentEditor = document.querySelector("#setAgent").parentElement;
               const title = document.querySelector(".editorTitle");
               const modalParent = title.parentElement;

                  $(modalParent).fadeOut();
                  setTimeout(() => {
                     agentEditor.classList = "hide"; 
                     title.innerHTML += "<h3>Please select an agent</h3>";
                     $(modalParent).fadeIn();
                     
                     setTimeout(() => {
                       $(modalParent).fadeOut();
                        
                        setTimeout(() => {
                        document.querySelector(".editorTitle>h3").remove();
                        document.querySelector("#setAgent").parentElement.removeAttribute("class");
                        }, 500);

                        $(modalParent).fadeIn();
                     }, 1200);

                  }, 800);

               return;
            }
   
            const data = {agent:agentName};
            const options = {
               method: 'PUT',
               headers:{
                  'Content-Type': 'application/json'
               },
               body:JSON.stringify(data)
            };
   
            if(fetcher(`https://ca-42yan.ondigitalocean.app/api/v1/tasks/${taskId}`, options)){
               modalAddon("Task assigned!", true, true);
               setTimeout(()=>{
                  loadTasks();
               }, 1000);
               }
   
         }
         //AGENT TASK ASSIGNMENT



   });
   

function setAgent(system, errorTitle, taskId){

   const agentPopup =` <div id="agentEditor">
                        <span class = "hide">${taskId}</span>
                        <h3>${system} error - ${errorTitle}</h3>
                        <div class="form-group">
                           <select id="agent" class="form-control">
                              <option disabled selected>Agent</option>
                              <option>Luis Rosales</option>
                              <option>Francisco Gerónimo</option>
                              <option>Adwil Castillo</option>
                           </select>
                         </div>
               <button id="setAgent" class=" btn btn-outline-secondary ">Assign task</button>
                     </div>
                     `;
                     
     modalAddon(agentPopup, true, false, false);

}


function modalRemoval(){
      modal_container.classList.remove("popmodal");
      body.classList.remove("body");
      html.classList.remove("body");
      responseEdit.value = "";
}

function modalAddon(message, choice = false, reload = true, dispose = true){
      modal_container.classList.add("popmodal");
      modalUserExp(message, choice, reload, dispose);
}



modal_container.addEventListener("click", (e) => {
            if(e.target.classList == "modal-container popmodal"){
               removeOutsideModal();
            }
});

closee.addEventListener("click", modalRemoval);
//PENDING TASKS: SET FILTERS BY FIXER, ETC...
$(document).keyup(function(e) {
   if (e.keyCode === 27) removeOutsideModal();   // esc
 });

 function removeOutsideModal(){
    //Remove modal when clicking outside
    const edC= document.querySelector(".editorContainer");
               const h = document.querySelector(".editorTitle"); 
               modalRemoval();

               setTimeout(() => {
                  $(edC).fadeIn();
                  h.innerHTML = "Task Editor";
               }, 300);
 }
function modalUserExp(message, choice = false, reload = true, dispose = true){
   //get editor to improve user experience  
   const edC= document.querySelector(".editorContainer");
   if(choice)
      edC.style.display="none";
   else
      $(edC).fadeOut(200);
     //display h with message
     const h = document.querySelector(".editorTitle");
     h.innerHTML = message;
     //remove Modal
   setTimeout(() => {
      
      if(dispose){
          modalRemoval();
          setTimeout(() => {
            $(edC).fadeIn();
            h.innerHTML = "Task Editor";
         }, 300);
      }   
      if(reload == true)
         loadTasks();

     

   }, 1500);

}

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

//AUTO HEIGHT TEXTAREA
//EVENT DELEGATION FOR RESPONSE TEXTAREA
const tx = document.getElementsByTagName('textarea');
for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
      tx[i].addEventListener("input", OnInput, false);
} 

function OnInput() {
this.style.height = 'auto';
if(this.scrollHeight > 108)
   this.style.overflowY="auto";
else
   this.style.overflowY="hidden";

this.style.height = (this.scrollHeight) + 'px';
}
//AUTO HEIGHT TEXTAREA

 //Activating popover 


