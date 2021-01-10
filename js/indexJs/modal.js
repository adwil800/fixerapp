const activeR = document.querySelector("#activeRevId");
const closee = document.querySelector("#closeModal");
const modal_container = document.querySelector(".modal-container");
const modal = document.querySelector(".modal");
const body = document.querySelector("body");
const html = document.querySelector("html");
const h = document.querySelector(".editorTitle");

//modal fields
const responseEdit = document.querySelector("#editor");
const issueTitle = document.querySelector("#titleup");
const ErrorType = document.querySelector("#issuedToup");
//modal fields


function superModal(e){
    
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
     ErrorType.value=Fields[0].trim();
      //set issue title
      issueTitle.value=Fields[1].trim();
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
         const newDate = new Date().toLocaleString("en-US", {timeZone: "America/Dominica"});
         const temp = newDate.split("/");
         const date = temp[1]+"/"+temp[0]+"/"+temp[2];

         const data = {deleted: true, completionDate: date};
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
         const newDate = new Date().toLocaleString("en-US", {timeZone: "America/Dominica"});
            const temp = newDate.split("/");
            const date = temp[1]+"/"+temp[0]+"/"+temp[2];

         const data = {completed: true, completionDate: date};
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

            //Fetching to see if not set task is already taken
            async function agentF(){
            let agentFinder;
            try {
               agentFinder = await fetch(`https://ca-42yan.ondigitalocean.app/api/v1/tasks/${taskId}`);
               } catch {
                  return;
               }
            let agentAssigned = await agentFinder.json();
                agentAssigned = agentAssigned.data;
            if(agentAssigned.agent != "Not set"){
               modalAddon(`Task already taken by ${agentAssigned.agent}`, true, true )
            }

         }
            agentF();

            //Fetching to see if not set task is already taken

            body.classList.add("body");
            html.classList.add("body");
            setAgent(fields[0].trim(), fields[1].trim(), taskId); 
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















