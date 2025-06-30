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

    //cliams button being sent to insurance user
    // https://www.geeksforgeeks.org/javascript/javascript-fetch-method/
     const sendBtnICU = document.getElementById("sendBtnICU");
  //######  
     // if(sendBtnICU){
    //    sendBtnICU.addEventListener("click",()=>{
    //     // alert("Sending claim to Insurance Company");
    //    const claimId = sendBtnICU.getAttribute("data_claim_notify");

    //        fetch('/update_insurer_of_Claim',{
    //            // send data to server
    //            method: "Post", 
    //            // Sending Json content
    //            headers:{"Content-Type":"application/json" }, 
    //            // data that is being sent
    //            body: JSON.stringify(claimId)
    //        })
    //        //checking response is true if not error will show
    //        .then(response => {
    //             if (!response.ok) {
    //                throw new Error(`HTTP error! Status:`);
    //             }
    //            return response.json();
    //        })
    //        // notes the receives data
    //        .then((data) =>{
    //            alert("Sending claim to Insurance Company");
    //        })
    //        //catches errors
    //        .catch(error => console.error('Notifying error to insurance Company', error.message));
    //    });
    //    }    


     if(sendBtnICU){
         sendBtnICU.addEventListener("click",()=>{
           alert("Sending claim to Insurance Company");

         });
     }    

});


///https://youtu.be/i_8NQuEAOmg?si=Ou8RhLz7m_aD0jbT