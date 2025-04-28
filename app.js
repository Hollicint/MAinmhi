const express = require("express");
const mongoose = require("mongoose");

// import this module
const UserLoginDetail = require("./models/userlogindetail");
const PetAccountDetail = require("./models/petaccountdetail");

//create the Express app
const app = express();

//const { ConnectionPoolClosedEvent } = require("mongodb");

const dbURI = "mongodb+srv://ComputerProject:GlpXTRDjQtYyOdfD@mainmhi.ag9zvki.mongodb.net/MAinmhiAppDb?retryWrites=true&w=majority&appName=mainmhi";
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((error) => console.log(error));

//instruction with the view engine to be used
app.set("view engine", "ejs")
//middleware to allow access to static files
app.use(express.static("public"));


//test the creation of the data 
app.get("/models/new-userlogindetail", (request, response) => {
    const userlogindetail = new UserLoginDetail({
        firstName: "Jane",
        lastName: "Doe",
        dateOfBirth: "20/01/1995",
        email: "jane.doe@gmail.com",
        phoneNum: "+353 085 123 9987"
    });
    userlogindetail.save()
        .then((result) => response.send(result))
        .catch((error) => console.log(error));
});
app.get("/models/new-petaccountdetail", (request, response) => {
    const petaccountdetail = new PetAccountDetail({
        petName: "Penny",
        breed: "Cavahion",
        dateOfBirth: "18/05/2021",
        colour: "brawn"
    });
    petaccountdetail.save()
        .then((result) => response.send(result))
        .catch((error) => console.log(error));
});




//tells server to get ready
app.use(express.urlencoded({ extended: true }));

//listen for incoming requests
//app.listen(3000);

//route and response
app.get("/", (request, response) => {
    response.render("index", { title: "Home" });
});

app.get("/about", (request, response) => {
    response.render("about", { title: "about" });
});

//redirect
app.get("/aboutus", (request, response) => {
    response.redirect("/about");
});

app.get("/support", (request, response) => {
    response.render("support", { title: "support" });
});

//redirect
app.get("/supportpage", (request, response) => {
    response.redirect("/support");
});




//User pages


app.get("/user/user_loginpage", (request, response) => {
    response.render("user/user_loginpage", { title: "User Login" });
});

app.get("/user/user_profile", (request, response) => {
    response.render("user/user_profile", { title: "user profile" });
});

app.get("/user/pets_profile", (request, response) => {
    response.render("user/pets_profile", { title: "pets profile" });
});

app.get("/user/pets_accountCreation", (request, response) => {
    response.render("user/pets_accountCreation", { title: "pets account creation" });
});
app.get("/user/claims", (request, response) => {
    response.render("user/claims", { title: "claims" });
});


//logi * will have to go or be changed

app.get("/login", (request, response) => {
    response.render("login", { title: "login" });
});



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






//404 page
app.use((request, response) => {
    response.status(404).render("404", { title: "404" });
});



