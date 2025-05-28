document.addEventListener("DOMContentLoaded", ()=>{
    const viewClaimDivElement = document.querySelector(".viewClaimSection");
    const editClaimDivElement = document.querySelector('.editClaimSection');

    const editBtn = document.getElementById("editClaim");
    const saveBtn = document.getElementById("saveClaim");


    if(editBtn && saveBtn && viewClaimDivElement && editClaimDivElement){
        editBtn.addEventListener("click",(e)=>{
            viewClaimDivElement.style.display = "none";
            editClaimDivElement.style.display = "block";
        });
        saveBtn.addEventListener("click",(e)=>{
            viewClaimDivElement.style.display = "block";
            editClaimDivElement.style.display = "none";
        });
    }

});


