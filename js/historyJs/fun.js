//Load tasks function
//Receiving parameters
let noContentTaskTitle = "",
taskTitleMessage = "",
showDeleted = false,
showCompleted = false,
showHistory = false,
comdel = "",
comdelClass = "";

let area = window.location.href.split("?")[1];
if(area == "deleted"){
    noContentTaskTitle = "No deleted tasks";
    taskTitleMessage = "Deleted tasks";
    showDeleted = true;
    comdel = "Deleted at: ";
    comdelClass = "red";
$("#deleted").addClass("disabled");
}
else if(area == "completed"){
    noContentTaskTitle = "No completed tasks";
    taskTitleMessage = "Completed tasks";
    showCompleted = true;
    $("#completed").addClass("disabled");
    comdel = "Completed at: ";
    comdelClass = "green";
}
else if(area == "history"){
    noContentTaskTitle = "No past tasks";
    taskTitleMessage = "All past tasks";
    showHistory = true;
    $("#history").addClass("disabled");
}
//Receiving parameters



async function loadFulfilledTasks(){
    
const taskContainer = document.querySelector("#task");
const taskTitle = document.querySelector("#taskTitle");

            taskContainer.innerHTML="";
    
      //FETCH TEACHER tasks FROM DB
       let response;
         try {
          response = await fetch(`https://ca-42yan.ondigitalocean.app/api/v1/tasks`);
         } catch {
            taskTitle.classList += " red halfOpacity";
            taskTitle.innerHTML = "Error logger couldn't connect to the server";
            removePointer(true);
            $(taskTitle).fadeIn(200);
            return;
         }
    
    
       let tasks = await response.json();
           tasks = tasks.data;
           //console.log(tasks)
       //FETCH tasks FROM DB
         if(tasks.length == 0){
          taskTitle.innerHTML = noContentTaskTitle;
           
            removePointer(true);
            $(taskTitle).fadeIn(200);
            return;
         } 
         
            removePointer(false);
         
    
         //Load tasks into html
         taskTitle.innerHTML = taskTitleMessage;
         $(taskTitle).fadeIn(200);
    
            for (t in tasks){
    
            if(showDeleted)
                if(tasks[t].deleted == false)
                    continue;
            if(showCompleted)
                if(tasks[t].completed == false)
                    continue;
            if(showHistory)
                if(tasks[t].deleted == false && tasks[t].completed == false)
                    
                    continue;
                else{
                    if(tasks[t].deleted == true){
                        comdel = "Deleted at: ";
                        comdelClass = "red";
                    }else{
                        comdel = "Completed at: ";
                        comdelClass = "green";
                    }
                }
    
               const colContainer = document.createElement("div");
               colContainer.className = "col-sm-12";
               let taskDiv = document.createElement("div");
               taskDiv.className = "alterConstant-width btn alterReview cleaner col-sm-8 offset-sm-2";
    
               //get edited status
               let color;
                if(tasks[t].edited)
                    color="red";
                else
                    color = "green";
                    
    
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
                      </h3>
                         <pre><p>${tasks[t].task}</p> </pre>
                      
                         <span class="bold">Created at: ${tasks[t].date}</span> |||
                         <span class="bold ${comdelClass}">${comdel}${tasks[t].completionDate}</span> 
                         `;
               //Getting replies on the right tasks
               //Getting replies on the right tasks
               
                  colContainer.appendChild(taskDiv);
                  colContainer.innerHTML+="<br><br>";
                  taskContainer.appendChild(colContainer);
            } 
            
              setTimeout(()=>{
                $(taskContainer).fadeIn();
                },700);
    
         const taskCount = document.querySelector("#taskCount");
            taskCount.innerHTML = "Task count: "+calcCount(taskContainer);
            $(taskCount).fadeIn(300);
    
            if(calcCount(taskContainer) == 0)
                removePointer(true);
            else 
                removePointer(false);
    
                taskContainer.classList+=" row-reverse";
                //Load tasks into html
      }
    


function removePointer(add){

        if(add){
            $("#filterName").addClass("pointerEvents");
            $("#filterName").parent().addClass("noCursor");
            $("#filterSystem").addClass("pointerEvents");
            $("#filterSystem").parent().addClass("noCursor");
        }else{
             $("#filterName").removeClass("pointerEvents");
             $("#filterName").parent().removeClass("noCursor");
             $("#filterSystem").removeClass("pointerEvents");
             $("#filterSystem").parent().removeClass("noCursor");
            }
    }



    $("#viewAll").on("click", () => {

        const taskContainer = document.querySelector("#task");
            $(taskContainer).fadeOut();
            $("#filterSystem").val("Software"); 
            $("#filterName").val("Agent"); 
        
            setTimeout(()=>{
        
            loadFulfilledTasks();
            }, 300);
        
        });
        
         function filterByAgent(e){
            const agentName = e.target.value.toLowerCase();
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
        
         function filterBySystem(e){
            const systemName = e.target.value.toLowerCase();
            let counter = 0;
            document.querySelectorAll(".errorSys>strong").forEach((task) =>{
                const item = task.firstChild.textContent.split("-")[0].trim();
                if (item.toLowerCase().indexOf(systemName) != -1){
                    $(task.parentElement.parentElement.parentElement).fadeIn();
                        counter++;
                }
                else 
                    $(task.parentElement.parentElement.parentElement).fadeOut();
            });
            counterCheck(counter);
        }
        
        function counterCheck(counter){
            if(counter == 0){
                document.querySelector("#taskTitle").innerHTML="No results"
                $(document.querySelector("#taskCount")).fadeOut();
            }else{
                document.querySelector("#taskTitle").innerHTML=taskTitleMessage;
                $(document.querySelector("#taskCount")).fadeIn();
                document.querySelector("#taskCount").innerHTML="Task count: "+counter;
            }
        }
        
          function calcCount(element){
            return element.childElementCount;
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
        
        
         //clear fields for filtering, only one at a time
         $("#filterName").on("focusin", ()=>{
             $("#filterSystem").val("Software"); 
            });
        
         $("#filterSystem").on("focusin", ()=>{
             $("#filterName").val("Agent"); 
            });
        
          