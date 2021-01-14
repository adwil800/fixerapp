

document.addEventListener("DOMContentLoaded", loadTasks())
document.querySelector("#agentFilter").addEventListener("change", filterByAgent);
 

//ADD REVIEW 
const taskPost = document.querySelector("#postTask");
taskPost.addEventListener('submit', (e) => postTasks(e));
//UPDATE REVIEW WITH NEW EDIT 
document.querySelector("#updateReview").addEventListener("click", (e) => updateTasks(e));
//EDIT OR DELETE REVIEW 
document.body.addEventListener("click", (e) =>editDelTasks(e));
//MODAL LOADING
document.body.addEventListener("click", (e) => superModal(e)); 
 
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



