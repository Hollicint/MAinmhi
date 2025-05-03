const express = require("express");
const mongoose = require("mongoose");

// import this module
const UserLoginDetail = require("./models/userlogindetail");
const RegisterUser = require("./models/registeruser");
const PetAccountDetail = require("./models/petaccountdetail");

//create the Express app
const app = express();
//create session logs
const session = require("express-session");

//load environment 
require('dotenv').config();

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
    request.session.destroy(() => { response.redirect("/user/user_loginpage");  });
});


app.get("/user/reg_userpage", (request, response) => {
    response.render("user/reg_userpage", { title: "User Reg" });

});

// Post Request
app.post("/user/reg_userpage",(request, response) => {
   const registerUser = new RegisterUser(request.body);
   registerUser.save()
   .then((result) => {
         response.redirect("/user/user_loginpage") 
        })
   .catch((error) => console.log(error));
});


//User Profile
app.get("/user/user_profile", isAuthen, (request, response) => {
    response.render("user/user_profile", { title: "user profile",  user: request.session.user });
});





// Pet Create Account Page
app.get("/user/pets_accountCreation", (request, response) => {
    response.render("user/pets_accountCreation", { title: "pets account creation" });
});


// Pet Profile
app.get("/user/pets_profile", (request, response) => {
    response.render("user/pets_profile", { title: "pets profile" });
});

// Claims Page
app.get("/user/claims", (request, response) => {
    response.render("user/claims", { title: "claims" });
});


//logi * will have to go or be changed

app.get("/login", (request, response) => {
    response.render("login", { title: "login" });
});

//////////////////////////////////////////////////////////////////
// Insurance Company page


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




/////////////////////////////////////////////



//404 page
app.use((request, response) => {
    response.status(404).render("404", { title: "404" });
});



