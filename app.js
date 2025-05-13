//configurations
const express = require("express");
const mongoose = require("mongoose");

// import connected to DB
const UserLoginDetail = require("./models/userlogindetail");
const RegisterUser = require("./models/registeruser");
const PetAccountDetail = require("./models/petaccountdetail");
const ClaimDetail = require("./models/claimsdetail");

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
        maxAge: 60000,

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


//listen for incoming requests
//app.listen(3000);


//////////////////////////

//test the creation of the data 

//app.get("/models/new-userlogindetail", (request, response) => {
//    const userlogindetail = new UserLoginDetail({
//        firstName: "Jane",
//        lastName: "Doe",
//        dateOfBirth: "20/01/1995",
//        email: "jane.doe@gmail.com",
//        phoneNum: "+353 085 123 9987"
//    });
//    userlogindetail.save()
//        .then((result) => response.send(result))
//        .catch((error) => console.log(error));
//});
//app.get("/models/new-petaccountdetail", (request, response) => {
//    const petaccountdetail = new PetAccountDetail({
//        petName: "Penny",
//        breed: "Cavahion",
//        dateOfBirth: "18/05/2021",
//        colour: "brawn"
//    });
//    petaccountdetail.save()
//        .then((result) => response.send(result))
//        .catch((error) => console.log(error));
//});

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

// log off account
app.get("/logout", (request, response) => {
    //request.session.destroy(() => { response.redirect("/user/user_loginpage");  });
    request.session.destroy(() => { response.redirect("/");  });
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

    //const registerUser = new RegisterUser(request.body);
   //registerUser.save()
   //.then((result) => {
   //      response.redirect("/user/user_loginpage") 
   //     })
   //.catch((error) => console.log(error));
});  


//User Profile
app.get("/user/user_profile", isAuthen, (request, response) => {
    response.render("user/user_profile", { title: "user profile",  user: request.session.user });
});



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

app.post("/user/pets_profile", (request, response) => {
   // console.log(request.body);
   const claimdetail = new ClaimDetail(request.body);
   claimdetail.save()
    .then((result)=> {response.redirect("/user/pets_profile")})
    .catch((error)=> console.log(error));
});

/////////////////////////////////////////////////

// Claims Page
app.get("/user/new_claims", isAuthen, async (request, response) => {
   // response.render("user/new_claims", { title: "claims" });
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


app.get("/user/pets_profile:id", (request, response) => {
    const claimId = request.params.id;
    ClaimDetail.findById(claimId)
     .then(result => response.render("claim", {claim: result, claimTitle: "Claim Details"}))
     .catch((error)=> console.log(error));
});

// directed claims
app.get("/user/view_claim", (request, response) => {
     response.render("user/view_claim", { title: "View Claim" });
});

/////////////////////////////////////////////////

//logi * will have to go or be changed

app.get("/login", (request, response) => {
    response.render("login", { title: "login" });
});

//////////////////////////////////////////////////////////////////
// Insurance Company 


// Insurance Company User
app.get("/insurance/insurance_loginpage", (request, response) => {
    response.render("insurance/insurance_loginpage", { title: "Insurance Login" });
});

app.get("/insurance/insurance_profile", (request, response) => {
    response.render("insurance/insurance_profile", { title: "Insurance" });
});

app.get("/insurance/clients_list", (request, response) => {
    response.render("insurance/clients_list", { title: "Client List" });
});

/*app.get("/insurance/clients_claim", (request, response) => {
    response.render("insurance/clients_claim", { title: "clients claim" });
})*/

//////////////////////////////////////////////////////////////////
// Admin

app.get("/admin/admin_profile", (request, response) => {
    response.render("admin/admin_profile", { title: "Admin" });
});


////////////////////////////////////////
// test page

app.get("/insurance/linda_green", (request, response) => {
    response.render("insurance/linda_green", { title: "Linda Green" });
});
app.get("/insurance/test_views", (request, response) => {
    response.render("insurance/test_views", { title: "Linda Green" });
});

/////////////////////////////////////////////



//404 page
app.use((request, response) => {
    response.status(404).render("404", { title: "404" });
});



