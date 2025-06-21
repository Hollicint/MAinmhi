//Setup and importing 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// Imports for GRIDFS  - middleware  for files /storage
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket } = require("mongodb");
const path = require("path");
const bodyParser = require('body-parser');
const { body, validationResult } = require("express-validator");

//app.use(express.json());

// import of models connected to DB
//const UserLoginDetail = require("./models/userlogindetail");
const RegisterUser = require("./models/registeruser");
const PetAccountDetail = require("./models/petaccountdetail");
const ClaimDetail = require("./models/claimsdetail");
const RegisterInsurer = require("./models/registerinsurer");
const RegisterInsuranceCompany = require("./models/registerinsurancecompany")

//Login Security 
//inserting limit attempts for login
const rateLimit = require('express-rate-limit');
//imports bcrypt for hashing
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
//sets level of hashing
const saltRounds = 12;

//create session logs
const session = require("express-session");
const { result } = require("lodash");
const { request } = require("http");

//load environment 
require('dotenv').config();

//session configurations
app.use(
    session({
        // securing the password as its expose if hardcoded moved to its own file .env    
        secret: process.env.session_secret,
        // prevents uncecessary session saving
        //resave: true,
        resave: false,
        // no empty sessions
        saveUninitialized: false,
        //saveUninitialized: false,
        //resetting session after 1 min if the site isnt touched it will make user sign back in
        //securing cookies
        cookie: {
            httpOnly: true, //prevenets XSS using JS in the browser
            secure: process.env.NODE_ENV === 'production', // cookies sent over HTTPS
            sameSite: 'strict', //allows only request and trusted sites cookies
            maxAge: 60000 // 1 min of none active it will reset 
        },
        // reset
        rolling: true,
    })
);

//Sets the limit tries to enter login
const limitLogin = rateLimit({
    windowMs: 1 * 60 * 1000, //recover time before attempt again
    max: 3, // min attempts to try
    message: "Your login attempts are up" // error message
});

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

// Mongodb connection
const dbURI = process.env.mongo_db;

/*
connecting mongoose to the db on mongodb
Creating a bucket to be able to store files for GRIDFS

 ** https://www.npmjs.com/package/multer-gridfs-storage


https://mongodb.github.io/node-mongodb-native/3.4/tutorials/gridfs/streaming/
https://www.mongodb.com/docs/manual/core/gridfs/
https://www.mongodb.com/docs/drivers/java/sync/v4.3/fundamentals/gridfs/

had to put the whole code in the bracket to work

*/
mongoose.connect(dbURI) // connects DB
    .then(() => {  // start after connection

    const myDb = mongoose.connection.db;
    // creating a bucket and giving it a name
    const bucket = new GridFSBucket(myDb, {
        bucketName: 'ClaimFiles'
    });
    //connecting it to the appilcation to be able to use
    app.locals.gridFSBucket = bucket;
    /*
     Creating storage for GRIDFS
      - file upload will need to be unqiue in its naming
      - checking the type of image and document being uploaded
    
      ** https://kn8.hashnode.dev/image-uploads-and-storage-in-mongodb-a-step-by-step-guide-with-multer-and-gridfs
    */
    const storage = new GridFsStorage({
        db: mongoose.connection,
        file: (request, file) => {
            // file name must be unqiue
            const filename = `${Date.now()}_${file.originalname}`;
            return {
                bucketName: 'ClaimFiles',
                filename
            };
        }
    });
    const upload = multer({
        storage, fileFilter: (request, file, callback) => {

            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/)) {
                request.fileValidationError = "Invalid file format";
                return callback(new Error("Invalid file error"), false);
            }
            callback(null, true);
        }
    });


        /* original connection
        mongoose.connect(dbURI) // connects DB
            .then((result) => app.listen(3000)) // listen for incoming requests
            .catch((error) => console.log(error)); //listen for errors
        */
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
     //User Login & Register
     // User register get
     app.get("/user/reg_userpage", (request, response) => {
         response.render("user/reg_userpage", {
             title: "User Reg"
        });
     });
        /*
           https://medium.com/@amirakhaled2027/how-to-implement-node-js-bcrypt-js-in-your-code-61aecef19ced
       */

    // Post Request
    app.post("/user/reg_userpage", async (request, response) => {
        try {
            const {
                firstName, lastName, emailAddress, contactNumber, dateOfBirth,
                address, username, password
            } = request.body;

            // Check Email is entered correctly
            const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!emailFormat.test(emailAddress)) {            
                    errorMessage: "Incorrect email format"
            }
        //Check Username is enterd correctly
            if(username.length < 6){
                errorMessage: "Incorrect username format"
              }
            
        //Check Password is enterd correctly
            if(password.length < 8 || password.length > 14 ){ 
                errorMessage: "Incorrect password length must be between 8 to 14"
            }
            // adding bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds);
             const user = await RegisterUser({
                 firstName, lastName, emailAddress, contactNumber, dateOfBirth,
                address, username, password:hashedPassword
             }); 

            const userSaved = await user.save(); 
            request.session.user  = userSaved;
            // Redirecting to Pet Register page
            response.redirect("/user/reg_petpage");

        } catch (error) {
            console.error("Error with registration", error);
            response.status(500).send("Error with registration");
        }

    });



    // Login Page
    app.get("/user/user_loginpage", (request, response) => {
        response.render("user/user_loginpage", {
            title: "User Login",
            user: request.session.user || null,
            errorMessage: null
        });

    });

    app.post("/user/user_loginpage", limitLogin, async (request, response) => {
        const { username, password } = request.body;
        try {
          //  const user = await RegisterUser.findOne({ username, password });
            const user = await RegisterUser.findOne({ username });
            if (!user) {
                response.render("user/user_loginpage", {
                title: "User Login",
                errorMessage: "Not Registered user" 
                 });                    
            } 
            
            const matchedLogin = await bcrypt.compare(password, user.password);

            if(!matchedLogin) {
                response.render("user/user_loginpage", {
                title: "User Login",
                errorMessage: "Not Registered password" 
            });                    
            } 


            // connects to user registered logins and goes to profile
             request.session.user = user;
             response.redirect("/user/user_profile");


        } catch (error) {
            console.error("Error with Login", error);
            response.status(500).send("Error with Login");
        }

        /*  response.render("user/reg_userpage");*/

    });

    //User Profile
    app.get("/user/user_profile", isAuthen, async (request, response) => {
        try {
            // show the login user and the pet connected to that
            const user = request.session.user;

           // const hashedPasswords = await bcrypt.hash(request.body.password);

            //const user = await RegisterInsurer.findById(request.session.user._id);
            const pets = await PetAccountDetail.find({ userId: user._id });
            response.render("user/user_profile", {
                title: "user profile",
                user: user,
                pets: pets
            });


        } catch (error) {
            console.error("Error with displaying data", error);
            response.status(500).send("Error with data");
        }

    });

 ////////////////////////////////////////////////////////////////
    //Pet  Login & Register
    app.get("/user/reg_petpage", async(request, response) => {
        try {
            const insuranceCompanies = await RegisterInsuranceCompany.find(); 
            response.render("user/reg_petpage", {
                title: "Pet registration",
                insuranceCompanies
            });
          } catch (error) {
            console.error("Error with registration", error);
            response.status(500).send("Error with registration");
        }
    });
    // Post Pets reg form and save to connected user
    app.post("/user/reg_petpage", async (request, response) => {
        try {
            // const petData = request.body;
            if (!request.session.user) {
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
                insurerCompanyId: request.body.insurerCompanyId,
                userId: request.session.user._id

            });
            await pet.save();
            response.redirect("/user/user_profile");

        } catch (error) {
            console.error("Error with registration", error);
            response.status(500).send("Error with registration");
        }
    });


    // display the claims on pet profile
    app.get("/user/pets_profile/:id",isAuthen, async (request, response) => {
        try{
            const petId = request.params.id;
            const pet = await PetAccountDetail.findOne({
                 _id:petId, 
                 userId: request.session.user._id 
            });
      
            const claimsdetail = await ClaimDetail.find({petId }); 
            response.render("user/pets_profile", {
              title: "pets profile",
              pet,
              user: request.session.user,
              claimsdetail
            });

        }catch(error){
            console.error("Error with pet profile details", error);
             response.status(500).send("Error with pet profile");
        }

    });
 
 /////////////////////////////////////////////////
     //Claim Side
        app.get("/user/new_claims", isAuthen, async (request, response) => {
             try {

             const pet = await PetAccountDetail.find({ userId: request.session.user._id });
             response.render("user/new_claims", {
                 title: "pets profile",
                 pets: pet  ,
                 user: request.session.user
             });

             } catch (error) {
                 console.error("Error with creating claim", error);
                 response.status(500).send("Error with creating claim");
             }
         });



        // Get claim form and connect pet
     app.get("/user/new_claims/:id", isAuthen, async (request, response) => {
         try{
                const petId = request.params.id;
                const pet = await PetAccountDetail.findOne({
                     _id:petId, 
                     userId: request.session.user._id 
                });

                response.render("user/new_claims", {
                    title: "new claim",
                    pet: pet  ,
                    user: request.session.user
                 });
      

            }catch(error){
                console.error("Error with pet profile details", error);
                 response.status(500).send("Error with pet profile");
            }
       });




        // Post new claims and upload file to db and open back pet profile
        app.post("/user/new_claims", isAuthen, upload.fields([{ name: 'claimImage', maxCount: 5 }, { name: 'claimDocument', maxCount: 10 }]), async (request, response) => {
            try {
                const { body, files } = request;
                // help view the file input
                // console.log("Files entered", files);

                if (request.fileValidationError) {
                    return response.status(400).send(request.fileValidationError);
                }

                //const files = request.files;

                const newClaim = new ClaimDetail({
                    claimTitle: request.body.claimTitle,
                    claimDescription: request.body.claimDescription,
                    areaOfIssue: request.body.areaOfIssue,
                    incidentStartDate: request.body.incidentStartDate,
                    vetDate: request.body.vetDate,
                    vetDetail: request.body.vetDetail,
                    claimStatus: request.body.claimStatus,
                    claimAmount: request.body.claimAmount,
                    claimImage: (files.claimImage || []).map(file => ({
                        file: file.filename,
                        fileId: file.id,
                    })),
                    claimDocument: (files.claimDocument || []).map(file => ({
                        file: file.filename,
                        fileId: file.id,
                    })),
                    //claimImage: files.claimImage?.map(f =>f.filename),
                    //claimDocument: files.claimDocument?.map(f =>f.filename),
                    petId: request.body.petId,
                    userId: request.session.user._id

                });
                await newClaim.save();
                response.redirect("/user/pets_profile/");

            } catch (error) {
                console.error("Error with creating claim ", error);
                response.status(500).send("Error with creating claim");
            }
        });

        // stream the file to get it later
        app.get("/file/:filename", async (request, response) => {
            try {
                const bucket = request.app.locals.gridFSBucket;
                const fileStream = bucket.openDownloadStreamByName(request.params.filename);

                fileStream.on("error", () => {
                    return response.status(400).send("File doesnt exist");
                });

                //const radStream = fileStream.createReadStream({filename});

                fileStream.pipe(response);

            } catch (error) {
                console.error("Error with File ", error);
                response.status(500).send("Error with File streaming");

            }
        });


        //Get and display certain claim
        app.get("/user/view_claims/:id", isAuthen, async (request, response) => {

            try {
           
               const claimId = request.params.id;
               const claim = await ClaimDetail.findById(claimId);

                const pet = await PetAccountDetail.findOne({
                     _id: claim.petId, 
                     userId: request.session.user._id 
                });

               response.render("user/view_claims", {
                   title: "View Claim",
                   pet: pet,
                   claim,
                   user: request.session.user,
               });

            } catch (error) {
                console.error("View error", error);
                response.status(500).send("Error with view");
            }


        });

        // Edit Claim - inputs/images/documents
        app.post("/user/view_claims/:id", isAuthen, upload.fields([{ name: 'claimImage', maxCount: 5 }, { name: 'claimDocument', maxCount: 10 }]), async (request, response) => {
            try {
                const claimId = request.params.id;
                const { body, files } = request;

                const claim = await ClaimDetail.findById(claimId);

                claim.claimTitle = body.claimTitle;
                claim.claimDescription = body.claimDescription;
                claim.areaOfIssue = body.areaOfIssue;
                claim.incidentStartDate = body.incidentStartDate;
                claim.vetDate = body.vetDate;
                claim.vetDetail = body.vetDetail;
                claim.claimStatus = body.claimStatus;
                claim.claimAmount = body.claimAmount;

                if (files.claimImage) {
                    claim.claimImage = files.claimImage.map(file => ({
                        file: file.filename,
                        fileId: file.id,
                    }))
                };
                if (files.claimDocument) {
                    claim.claimDocument = files.claimDocument.map(file => ({
                        file: file.filename,
                        fileId: file.id,
                    }))
                };


                await claim.save();

                //await  ClaimDetail.findOneAndUpdate(claimId, updatedClaimData );

                const updatedClaim = await ClaimDetail.findById(claimId);
                const pet = await PetAccountDetail.findOne({ 
                    _id: claim.petId, 
                    userId: request.session.user._id
                 });

                response.render("user/view_claims", {
                    title: "View Claim",
                   // pets: await PetAccountDetail.find({ userId: request.session.user._id }),
                    pet: pet,
                    claim: updatedClaim,
                    user: request.session.user,
                });

            } catch (error) {
                console.error("Edit error", error);
                response.status(500).send("Error with Edit");
            }

        });

//////////////////////////////////////////////////////////////////
//  // Insurance Company 


// Get Insuracnce User Company form
    app.get("/insurance/reg_insuranceCompany", (request, response) => {
            response.render("insurance/reg_insuranceCompany", { 
                title: "insurance Company Registration",
                insurerUser: request.session.user || null,
                errorMessage: null
            });
    });


    // Post Request
    /*
        Collecting both the insurance User and the company details
        storing them in two different schemas 
    */
    app.post("/insurance/reg_insuranceCompany", async (request, response) => {
        try {
            const {
                staffFirstName, staffLastName, staffEmailAddress,
                staffContactNumber, staffNumber,
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
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const insurerUser = await RegisterInsurer({
                staffFirstName, staffLastName, staffEmailAddress,
                staffContactNumber, staffNumber,
                staffRole, username, password:hashedPassword,
                company: company._id,
            });
            const savedInsurerUser = await insurerUser.save();
            savedInsurerUser.company = company._id;
            await savedInsurerUser.save();
            request.session.insurerUser = await RegisterInsurer.findById(savedInsurerUser._id).populate('company');
            response.redirect("/insurance/insurance_profile");
        } catch (error) {
            console.error("Error with registration", error);
            response.status(500).send("Error with registration");
        }
    });
    // Insurance Company User logins in
    app.get("/insurance/insurance_loginpage", (request, response) => {
        response.render("insurance/insurance_loginpage",
             { title: "insurance Login",
                

              });
    });

    
    // post login details to correct user profile
    app.post("/insurance/insurance_loginpage", async (request, response) => {
        const { username, password } = request.body;
        try {
            const insurerUser = await RegisterInsurer.findOne({ username }).populate("company");;
            if (!insurerUser) {
                    response.render("insurance/insurance_loginpage", {
                    title: "insurer User Login",
                    errorMessage: "Not Registered user" 
                     });                    
                } 
            const matchedLogin = await bcrypt.compare(password, insurerUser.password);    
            if(!matchedLogin) {
                    response.render("insurance/insurance_loginpage", {
                    title: "insurer User Login",
                    errorMessage: "Not Registered password" 
                    });                    
                } 
   
            request.session.insurerUser = insurerUser;
            response.redirect("/insurance/insurance_profile");    


            //  console.log("Login correct", savedInsurerUser);
           // if (insurerUser) {
           //     request.session.insurerUser = insurerUser;
           //     response.redirect("/insurance/insurance_profile");
           // } else {
           //     response.status(401).send("insurance Login invalid");
           // }
        } catch (error) {
            console.error("Error with Insurance Login", error);
            response.status(500).send("Error with Insurance Login");
        }
    });
    // Insurance User Profile page
  // app.get("/insurance/insurance_profile", isInsurerAuthen, async (request, response) => {
  //      try {

  //          const insurerUser = await RegisterInsurer.findById(request.session.insurerUser._id).populate("company");
  //  
  //           const claimsdetail = await ClaimDetail.find({ petId}); 

  //          response.render("insurance/insurance_profile", {
  //              title: "Insurer profile",
  //              insurerUser,
  //              company: insurerUser.company
  //          });
  //      } catch (error) {
  //          console.error(error);
  //          response.status(500).send("Login error");
  //      }
  //  });



   app.get("/insurance/insurance_profile", isInsurerAuthen, async (request, response) => {
    try {

        const insurerUser = await RegisterInsurer.findById(request.session.insurerUser._id).populate("company");
          
      //  const pets = await PetAccountDetail.find({ insurerCompanyId: insurerUser._id }).select('_id');
       //const pets = await PetAccountDetail.find({ insurerCompanyId: insurerUser.company._id }).select('_id');
        const pets = await PetAccountDetail.find({  }).select('_id');
        const petIds = pets.map(pet => pet._id);

        const claims = await ClaimDetail.find({ petId: { $in: petIds } })
           .populate("petId")
           .populate("userId")
           .exec();

        
       return response.render("insurance/insurance_profile", {
           title: "Insurer profile",
           insurerUser,
           company: insurerUser.company,
           claims
       });
    } catch (error) {
       console.error("Error with Insurer profile details", error);
        response.status(500).send("Error with Insurer profile");
      }
   });

   
    //////////////////////////////////////////////////////////////////
    // Admin
    app.get("/admin/admin_profile", (request, response) => {
        response.render("admin/admin_profile", { title: "Admin" });
    });
    /////////////////////////////////////////////////
    //logi * will have to go or be changed
    app.get("/login", (request, response) => {
        response.render("login", { title: "login" });
    });
    /////////////////////////////////////////////
    // log off account
    app.get("/logout", (request, response) => {
        //request.session.destroy(() => { response.redirect("/user/user_loginpage");  });
        request.session.destroy(() => { response.redirect("/"); });
    });



//404 page
app.use((request, response) => {
    response.status(404).render("404", { title: "404" });
});

app.listen(3000, () => console.log("Server running"));
  
});
     //.catch(err => console.error("MongoDB connection error:", err));

