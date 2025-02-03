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

app.get("/contact", (request, response) => {
    response.render("contact", { title: "contact" });
});

//redirect
app.get("/contactus", (request, response) => {
    response.redirect("/contact");
});




//customers pages
app.get("/claims", (request, response) => {
    response.render("claims", { title: "claims" });
});

app.get("/insurance/insurance_profile", (request, response) => {
    response.render("insurance/insurance_profile", { title: "Insurance" });
});

app.get("/user/user_profile", (request, response) => {
    response.render("user/user_profile", { title: "user profile" });
});
app.get("/user/pets_profile", (request, response) => {
    response.render("user/pets_profile", { title: "pets profile" });
});

app.get("/login", (request, response) => {
    response.render("login", { title: "login" });
});









//404 page
app.use((request, response) => {
    response.status(404).render("404", { title: "404" });
});



