const express = require("express");
//create the Express app
const app = express();

//instruction with the view engine to be used
app.set("view engine", "ejs")


//listen for incoming requests
app.listen(3000);

 //middleware to allow access to static files
 app.use(express.static("public"));


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



