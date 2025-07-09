document.addEventListener("DOMContentLoaded", ()=>{
    const update_userDetailsElement = document.querySelector(".update_userDetails");
    const edit_userDetailsElement = document.querySelector(".edit_userDetails");

    const editBtn = document.getElementById("update_userDetailsBtn");
    const saveBtn = document.getElementById("save_editUserDetailsBtn");  


    if(editBtn && saveBtn && update_userDetailsElement && edit_userDetailsElement){
        editBtn.addEventListener("click",(e)=>{
            update_userDetailsElement.style.display = "none";
            edit_userDetailsElement.style.display = "block";
         });
         saveBtn.addEventListener("click",(e)=>{
            update_userDetailsElement.style.display = "block";
            edit_userDetailsElement.style.display = "none";
        });
    }
    

});