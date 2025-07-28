document.addEventListener("DOMContentLoaded", ()=>{
    const update_petDetailsElement = document.querySelector(".update_petDetails");
    const edit_petDetailsElement = document.querySelector(".edit_petDetails");
    const editPetBtn = document.getElementById("update_petDetailsBtn");

    const submitClaimBtn = document.getElementById("submitClaimBtn");
    
   if(editPetBtn  && update_petDetailsElement && edit_petDetailsElement){

        editPetBtn.addEventListener("click",(e)=>{
            update_petDetailsElement.style.display = "none";
            edit_petDetailsElement.style.display = "block";
         });
    }
    

    function submitClaimFunction(){
        alert("Your claim has been submitted for review");
    }
    if(submitClaimBtn){
        submitClaimBtn.addEventListener('click',submitClaimFunction)
    }

});