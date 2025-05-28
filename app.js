//configurations
const express = require("express");
const mongoose = require("mongoose");

// import connected to DB
//const UserLoginDetail = require("./models/userlogindetail");
const RegisterUser = require("./models/registeruser");
const PetAccountDetail = require("./models/petaccountdetail");
const ClaimDetail = require("./models/claimsdetail");
const RegisterInsurer = require("./models/registerinsurer");
const RegisterInsuranceCompany = require("./models/registerinsurancecompany")

//create the Express app
const app = express();
//create session logs
const session = require("express-session");
const { result } = require("lodash");

//load environment 
require('dotenv').config();

//session configurations
app.use(
    session({
           // securing the password as its expose if hardcoded moved to its own file .env    
        secret: process.env.session_secret,
            // prevents uncecessary session saving
        resave: false,
        // no empty sessions
        saveUninitialized: false,
        //resetting session after 1 min if the site isnt touched it will make user sign back in
          // reset
        rolling: true,
          // 1 min of none active it will reset 
       cookie:{ maxAge: 60000}

    })
);


// Mongodb connection ** Will have to move and encrpted this
const dbURI = "mongodb+srv://ComputerProject:GlpXTRDjQtYyOdfD@mainmhi.ag9zvki.mongodb.net/MAinmhiAppDb?retryWrites=true&w=majority&appName=mainmhi";
mongoose.connect(dbURI)
    .then((result) => app.listen(3000)) // listen for incoming requests
    .catch((error) => console.log(error)); //listen for errors

//instruction with the view engine to be used
app.set("view engine", "ejs")
//Retrieves data to server
app.use(express.urlencoded({ extended: true }));



//middleware to allow access to static files
app.use(express.static("public"));
//Middleware to check Authentication
function isAuthen(request, response, next) {
    if (request.session.user) {
        return next();
    }
    response.redirect("/user/user_loginpage");
}

function isInsurerAuthen(request, response, next) {
    if (request.session.insurerUser) {
        return next();
    }
    response.redirect("/insurance/insurance_loginpage");
}


//listen for incoming requests
//app.listen(3000);


//////////////////////////////////////////////////

//route and response

//Index Page
app.get("/", (request, response) => {
    response.render("index", { title: "Home" });
});

// About Page
app.get("/about", (request, response) => {
    response.render("about", { title: "about" });
});

//redirect
app.get("/aboutus", (request, response) => {
    response.redirect("/about");
});

//Support Page
app.get("/support", (request, response) => {
    response.render("support", { title: "support" });
});

//redirect
app.get("/supportpage", (request, response) => {
    response.redirect("/support");
});



//////////////////////////////////////////////
//User & Pet pages

// Login Page
app.get("/user/user_loginpage", (request, response) => {
    response.render("user/user_loginpage", { title: "User Login" });

});

app.post("/user/user_loginpage", async  (request, response) => {

    const{ username,password}= request.body;

    try{
        const user = await RegisterUser.findOne({ username, password });
        if(user){
            request.session.user = user;
            response.redirect("/user/user_profile");

        }else{
            response.status(201).send("Login Stored");
        }
    }catch(error){
        console.error("Error with Login", error);
        response.status(500).send("Error with Login");
    }

  /*  response.render("user/reg_userpage");*/
    
});



// User register get
app.get("/user/reg_userpage", (request, response) => {
    response.render("user/reg_userpage", { title: "User Reg" });

});

// Post Request
app.post("/user/reg_userpage",async (request, response) => {
    try{
        const user = await RegisterUser(request.body);
        const userSaved = await user.save();
        //User is saved in session
        request.session.user  = userSaved;
      //  response.redirect("/user/user_profile");
        response.redirect("/user/reg_petpage");

    }catch(error){
        console.error("Error with registration", error);
        response.status(500).send("Error with registration");
    }

});  


//User Profile
app.get("/user/user_profile", isAuthen, async (request, response) => {
   try{
    // show the login user and the pet connected to that
        const user = request.session.user;
       //const user = await RegisterInsurer.findById(request.session.user._id);
        const pets  = await PetAccountDetail.find({userId: user._id});
        response.render("user/user_profile", { 
            title: "user profile", 
             user: user,
             pets: pets
        });


   }catch(error){
        console.error("Error with displaying data", error);
        response.status(500).send("Error with data");
   }

});

////////////////////////////////////////////////////////////////
//Pet Side


// Pet Create Account Page
app.get("/user/reg_petpage", (request, response) => {
    response.render("user/reg_petpage", { title: "Pet registration" });
});

app.post("/user/reg_petpage", async (request, response) => {
    try{
        // const petData = request.body;
        if(!request.session.user) {
            return response.redirect("/user/user_loginpage");
        }

        const pet = new PetAccountDetail({
            petName: request.body.petName,
            petType: request.body.petType,
            breed: request.body.breed,
            gender: request.body.gender,
            colour: request.body.colour,
            dateOfBirth: request.body.dateOfBirth,
            microchipping: request.body.microchipping,
            microchippingNum: request.body.microchippingNum,
            policyNum: request.body.policyNum,
            insuranceCompanyName: request.body.insuranceCompanyName,
            userId: request.session.user._id

        });
        await pet.save();
        response.redirect("/user/user_profile");

    }catch(error){
        console.error("Error with registration", error);
        response.status(500).send("Error with registration");
    }
});

// Pet Profile
app.get("/user/pets_profile",isAuthen, async (request, response) => {

    try{
        const pets  = await PetAccountDetail.find({userId: request.session.user._id});
        const claimsdetail = await ClaimDetail.find({});

        response.render("user/pets_profile", {
             title: "pets profile",
             pets: pets,
             user: request.session.user,
             claimsdetail: claimsdetail
        });

    }catch(error){
        console.error("Error with pet profile details", error);
        response.status(500).send("Error with pet profile");
    }


   // response.render("user/pets_profile", { title: "pets profile" });
});

/*
app.post("/user/pets_profile", (request, response) => {
   // console.log(request.body);
   const claimdetail = new ClaimDetail(request.body);
   claimdetail.save()
    .then((result)=> {response.redirect("/user/pets_profile")})
    .catch((error)=> console.log(error));
});


app.post("/user/pets_profile", (request, response) => {
    const petaccountdetail = new PetAccountDetail(request.body);
    petaccountdetail.save("/user/pets_profile")
     .then(result => response.render())
     .catch((error)=> console.log(error));
});

*/

//app.post("/user/pets_profile", (request, response) => {
//    try{
//        const claimdetail = new ClaimDetail(request.body);
//        claimdetail.save()
//         .then((result)=> {response.redirect("/user/pets_profile")})
//         .catch((error)=> console.log(error));
//
//        const petaccountdetail = new PetAccountDetail(request.body);
//        petaccountdetail.save("/user/pets_profile")
//         .then(result => response.render())
//         .catch((error)=> console.log(error));
//
//    }catch(error){
//        console.error("Error with claims and  pet details displaying", error);
//        response.status(500).send("Error with claims and  pet details displaying");
//    }
//    
//});

/////////////////////////////////////////////////
//Claim Side

// Claims Page
app.get("/user/new_claims", isAuthen, async (request, response) => {
   try{
        const pets  = await PetAccountDetail.find({userId: request.session.user._id});
        
        response.render("user/new_claims", {
             title: "pets profile",
             pets: pets,
             user: request.session.user
        });

    }catch(error){
        console.error("Error with registration", error);
        response.status(500).send("Error with registration");
    }
});

// display the claims on pet profile

app.get("/user/pets_profile/:id", (request, response) => {
    const claimId = request.params.id;
    ClaimDetail.findById(claimId)
     .then(result => response.render("claim", {
        claim: result, 
        claimTitle: "Claim Details"
    }))
     .catch((error)=> console.log(error));
});


//app.get("/user/pets_profile/:id", isAuthen, async (request, response) => {
//      try{
//        const petId = request.params.id;
//        const pet  = await PetAccountDetail.findOne({petId:petId, userId: request.session.user._id});
//        
//        const claims = await ClaimDetail.find({petId: petId});
//
//        response.render("user/pets_profile", {
//             title: "pets profile",
//             pet,
//             claimsdetail: claims,
//             user: request.session.user
//        });
//
//    }catch(error){
//        console.error("Error with registration", error);
//        response.status(500).send("Error with registration");
//    }
//});








//Display
app.get("/user/view_claims/:id", isAuthen, async (request, response) => {

    try{

        const claimId = request.params.id;

        const pets  = await PetAccountDetail.find({userId: request.session.user._id});
    
       // const claimsdetail  = await ClaimDetail.find({userId: request.session.user._id});

        const claim = await ClaimDetail.findById(claimId);

        response.render("user/view_claims", { 
            title: "View Claim",
            //pets: pets,
            pets,
            claim,
            user: request.session.user,
           // claimsdetail: claimsdetail
        });

    }catch(error){
        console.error("View error", error);
        response.status(500).send("Error with view");
    }

    
});

// Edit Claim and display updated content
app.post("/user/view_claims/:id", isAuthen, async (request, response) => {
    try{
        const claimId = request.params.id;
        const updatedClaimData = { 
            claimTitle:  request.body.claimTitle,
            claimDescription:  request.body.claimDescription,
            areaOfIssue:  request.body.areaOfIssue,
            incidentStartDate: request.body.incidentStartDate,
            vetDate: request.body.vetDate,
            vetDetail: request.body.vetDetail,
            claimStatus: request.body.claimStatus,
            claimAmount: request.body.claimAmount
        };
        await  ClaimDetail.findOneAndUpdate({_id: claimId}, updatedClaimData );
        
        //await  ClaimDetail.findOneAndUpdate(claimId, updatedClaimData );

       // const pets  = await PetAccountDetail.find({userId: request.session.user._id});
        const updatedClaim = await ClaimDetail.findById(claimId);
        
        response.render("user/view_claims", { 
            title: "View Claim",
            pets: await PetAccountDetail.find({userId: request.session.user._id}),
            claim: updatedClaim,
            user: request.session.user,
        });
                  
    }catch(error){
        console.error("Edit error", error);
        response.status(500).send("Error with Edit");
    }

});




/////////////////////////////////////////////////

//logi * will have to go or be changed

app.get("/login", (request, response) => {
    response.render("login", { title: "login" });
});

//////////////////////////////////////////////////////////////////
// Insurance Company 


// Insurance register
app.get("/insurance/reg_insuranceCompany", (request, response) => {
    response.render("insurance/reg_insuranceCompany", { title: "insurance Company Registration" });
});


// Post Request
/*
    Collecting both the insurance User and the company details
    storing them in two different schemas 
*/

app.post("/insurance/reg_insuranceCompany",async (request, response) => {
    try{

        //if (!request.session.insurerUser) {
        //    return response.redirect("/insurance/insurance_loginpage");
        //}
        const{
            staffFirstName, staffLastName, staffEmailAddress, 
            staffContactNumber,staffNumber,
            staffRole, username, password, 
            insuranceCompanyName, insuranceCompanyEmail,
            insuranceCompanyContact, insuranceCompanyAddress,
        } = request.body;


        const newInsurerCompany = new RegisterInsuranceCompany({
           insuranceCompanyName, insuranceCompanyEmail,
           insuranceCompanyContact, insuranceCompanyAddress,
          // insurerId: savedInsurerUser._id
       });
       
       const company = await newInsurerCompany.save();
    
        const insurerUser = await RegisterInsurer({
            staffFirstName, staffLastName, staffEmailAddress, 
            staffContactNumber,staffNumber,
             staffRole, username, password,
          company: company._id,
        });


       const savedInsurerUser = await insurerUser.save();
       savedInsurerUser.company = company._id;
       await savedInsurerUser.save();
       request.session.insurerUser = await RegisterInsurer.findById(savedInsurerUser._id).populate('company');
       response.redirect("/insurance/insurance_profile");

    }catch(error){
        console.error("Error with registration", error);
        response.status(500).send("Error with registration");
    }

});  


// Insurance Company User
app.get("/insurance/insurance_loginpage", (request, response) => {
    response.render("insurance/insurance_loginpage", { title: "insurance Login"});
});

app.post("/insurance/insurance_loginpage", async (request, response) => {
    
    const{username,password} = request.body;

    try{
        const insurerUser = await RegisterInsurer.findOne({ username, password }).populate("company");;
      //  console.log("Login correct", savedInsurerUser);

        if(insurerUser){
            request.session.insurerUser = insurerUser;
            response.redirect("/insurance/insurance_profile");
        }else{
            response.status(401).send("insurance Login invalid");
        }   
    }catch(error){
        console.error("Error with Insurance Login", error);
        response.status(500).send("Error with Insurance Login");
    }

});


// Insurance User Profile page
app.get("/insurance/insurance_profile", isInsurerAuthen, async (request, response) => {

    try{
        
        if(!request.session.insurerUser){
            return response.redirect("/insurance/insurance_loginpage");
        }

        const insurerUser = await RegisterInsurer.findById(request.session.insurerUser._id).populate("company");
      //  console.log(insurerUser);
        
        if(!insurerUser){
            return response.status(404).send("User not found");
        }

      

        response.render("insurance/insurance_profile", {
             title: "Insurer profile",
             insurerUser,
             company: insurerUser.company
             //insurerUser: request.session.insurerUser,
             //company: request.session.insurerUser.company
           // insurerUser: savedInsurerUser
         });
        // response.redirect("/insurance/insurance_profile");

    }catch(error){
        console.error(error);
        response.status(500).send("Login error");
    }
    
    
});



//////////////////////////////////////////////////////////////////
// Admin

app.get("/admin/admin_profile", (request, response) => {
    response.render("admin/admin_profile", { title: "Admin" });
});



/////////////////////////////////////////////

// log off account
app.get("/logout", (request, response) => {
    //request.session.destroy(() => { response.redirect("/user/user_loginpage");  });
    request.session.destroy(() => { response.redirect("/");  });
});

//404 page
app.use((request, response) => {
    response.status(404).render("404", { title: "404" });
});



