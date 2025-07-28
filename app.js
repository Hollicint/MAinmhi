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

// import of models connected to DB
//const UserLoginDetail = require("./models/userlogindetail");
const RegisterUser = require("./models/registeruser");
const PetAccountDetail = require("./models/petaccountdetail");
const ClaimDetail = require("./models/claimsdetail");
const ArchiveClaimsDetail = require("./models/archiveclaimsdetail");
const RegisterInsurer = require("./models/registerinsurer");
const RegisterInsuranceCompany = require("./models/registerinsurancecompany")
const AdminUser = require("./models/adminuser");

//inserting limit attempts for login
const rateLimit = require('express-rate-limit');
//imports bcrypt for hashing
const bcrypt = require('bcrypt');
// imports tokens
const crypto = require("crypto");
// import to help send emails
const nodemailer = require('nodemailer');
//imports cookie parser
const cookieParser = require('cookie-parser');
//sets level of hashing
const saltRounds = 12;

// session logs
const session = require("express-session");
// works with different formats - arrays/string etc
const { result, values } = require("lodash");
// allows http requests - GET/POST/PUT/Delete
const { request } = require("http");
const { title } = require("process");

//load environment 
require('dotenv').config();



// ####################### SESSION & MIDDLEWARE SECTION  ##############################################

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
        //resetting session after 1 min if the site isnt touched it will make user sign back in
        //securing cookies
        cookie: {
            httpOnly: true, //prevenets XSS using JS in the browser
            secure: process.env.NODE_ENV === 'production', // cookies sent over HTTPS
            sameSite: 'strict', //allows only request and trusted sites cookies
           // maxAge: 60000 // 1 min of none active it will reset 
           maxAge: 24 * 60 * 60 * 1000 //day time
        },
        // reset
        rolling: true,
    })
);


app.use((request, response, next)=>{
    response.locals.user = request.session.user || null;
    response.locals.insurerUser = request.session.insurerUser || null;
    response.locals.adminUser = request.session.adminUser || null;
    next();
});


//Sets the limit tries to enter login
const limitLogin = rateLimit({
    windowMs: 1 * 60 * 1000, //recover time before attempt again
    max: 3, // min attempts to try
    message: "Your login attempts are up" // error message
});

//instruction with the view engine to be used
app.set("view engine", "ejs")
app.set('views', __dirname + '/views');


//middleware to allow access to static files
app.use(express.static("public"));
//Retrieves data to server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
function isAdminAuthen(request, response, next) {
    if (request.session.adminUser) {
        return next();
    }
    response.redirect("/admin/admin_loginpage");
}



// ####################### MONGODB & GRIDFS SECTION  ##############################################

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



// #######################  PUBLIC PAGES SECTION  ##############################################

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




// #######################  USER SIDE SECTION  ##############################################

     // User register get
     app.get("/user/reg_userpage", (request, response) => {
         response.render("user/reg_userpage", {
             title: "User Reg",
             errorMessage: {},
             values:{}
        });
     });
        /*
           https://medium.com/@amirakhaled2027/how-to-implement-node-js-bcrypt-js-in-your-code-61aecef19ced
       */

    // Post Request
    app.post("/user/reg_userpage", async (request, response) => {
       
        const {
            firstName, lastName, emailAddress, contactNumber, dateOfBirth,
            address, username, password
        } = request.body;

        const errorMessage ={};
        const values=request.body;

         try {    
            // Check Email is entered correctly
            const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!emailFormat.test(emailAddress)) { 
              //  errorMessage.push( "Invalid credentials");
                 errorMessage.emailAddress ="Email already on system";
            }
        //Check Username is enterd correctly
            if(username.length < 6){
               // errorMessage.push( "Invalid credentials");
               errorMessage.username ="Username must be more than 6 characters";
              }
            
        //Check Password is enterd correctly
            if(password.length < 8 || password.length > 14 ){ 
               // errorMessage.push( "Invalid credentials");
                errorMessage.password ="password must contain 8-14 characters";
            }

        // Check if details already Exist             
            const userExisting = await RegisterUser.findOne({ 
                $or: [{username},{emailAddress}]
            });
            if(userExisting){ 
                if(userExisting.username === emailAddress){
                    errorMessage.username ="Username already exist";
                }
                if(userExisting.emailAddress === emailAddress){
                    errorMessage.emailAddress ="email Address already exist";
                }
            }

            //Check if errors are on page it will stay and not go to pet reg page
            if(Object.keys(errorMessage).length >0){
                return response.render("user/reg_userpage",{
                    title: "Register User",
                    errorMessage,
                    values: request.body,
                });
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
   // app.post("/user/user_loginpage", async (request, response) => {
       
        const { username, password } = request.body;
        try {
            //  finds users username
            const user = await RegisterUser.findOne({ username });

            // Gives error if users doesnt exist
            if (!user) {
                 return response.render("user/user_loginpage", {
                    title: "User Login",
                    errorMessage: "User credentials do not exist" 
                 });                    
            } 
            // checking password
            const matchedLogin = await bcrypt.compare(password, user.password);

            if(!matchedLogin) {
                return response.render("user/user_loginpage", {
                    title: "User Login",
                    errorMessage: "Invalid password credentials" 
                });                    
            } 
            // connects to user registered logins and goes to profile
           //  request.session.user = user;
             request.session.user ={
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddress,
                contactNumber: user.contactNumber,
                dateOfBirth: user.dateOfBirth,
                address: user.address
             };


             response.redirect("/user/user_profile");


        } catch (error) {
            console.error("Invalid credentials", error);
            response.status(500).send("Invalid credentials");
        }

        /*  response.render("user/reg_userpage");*/

    });

    //User Profile
    app.get("/user/user_profile", isAuthen, async (request, response) => {
        try {
            // show the login user and the pet connected to that
            const user = request.session.user;
            //Displays the pets connected to users account
            const pets = await PetAccountDetail.find({ userId: user._id });
            // sending data to the correct location to display
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



        //Get 
    app.get("/user/user_profile/:id", isAuthen, async (request, response) => {
        response.render("/user/user_profile", {
            title: "User Profile",
            user: request.session.user || null,
            errorMessage: null
        });

    });


    // edit user profile details
    app.post("/user/user_profile/:id", isAuthen, async(request, response)=>{
        try{
            const userId = request.params.id;
            const {
            firstName, lastName, emailAddress, contactNumber,
             dateOfBirth, address, username, password
            } = request.body;

            
            const user = await RegisterUser.findById(userId);

            user.firstName = firstName;
            user.lastName = lastName;
            user.emailAddress = emailAddress;
            user.contactNumber = contactNumber;
            user.dateOfBirth = dateOfBirth;
            user.address = address;
            user.username = username;
           // user.password = password;

           // update the password 
            if(password && password.trim() !==""){
                const hashedPassword = await bcrypt.hash(password, 12);
                user.password = hashedPassword;
            }
            // save details
            await user.save();
            //get the updated details
           // const updatedUserDetails = await RegisterUser.findById(userId);

            request.session.user ={
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddress,
                contactNumber: user.contactNumber,
                dateOfBirth: user.dateOfBirth,
                address: user.address,
                username: user.username,
                password: user.password,
            }

            const pets = await PetAccountDetail.find({ userId: user._id });
            //user = await RegisterUser.findOne({ 
            //    _id: user,
            //    userId: request.session.user._id,
            //});

          // response.redirect(`/user/user_profile/${userId}`);

           response.render("user/user_profile", {
                title: "User Profile",
                // user: updatedUserDetails,
               // user: request.session.user,
               user: user,
                pets: pets,
                errorMessage: null
            });

        } catch (error) {
            console.error("Update error", error);
            response.status(500).send("Error with Update");
        }

    });


// #######################  PET SECTION  ##############################################

    // GET - register pet account
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
                desexed: request.body.desexed,
                startDate: request.body.startDate,
                endDate: request.body.endDate,
                //insuranceCompanyName: request.body.insuranceCompanyName,
                //insurerCompanyId: request.body.insurerCompanyId,
               // insurerCompanyId: request.body.insurerCompanyId,
               insuranceCompanyName: request.body.insuranceCompanyName,
            userId: request.session.user._id

            });
            await pet.save();
            response.redirect("/user/user_profile");

        } catch (error) {
            console.error("Error with registration", error);
            response.status(500).send("Error with registration");
        }
    });

    //Get pet profile
     app.get("/user/pets_profile",isAuthen, async (request, response) => {
        try {

            const pets = request.session.user;
            response.render("/user/pets_profile", {
                title: "Pet profile",
                pets: pets
            });


        } catch (error) {
            console.error("Error with displaying data", error);
            response.status(500).send("Error with data");
        }   
    });


    // display the claims on pet profile
    app.get("/user/pets_profile/:id",isAuthen, async (request, response) => {
        try{
            const petId = request.params.id;
            const pet = await PetAccountDetail.findOne({
                 _id:petId, 
                 userId: request.session.user._id 
            }).populate("insurerCompanyId");
      
            const claimsdetail = await ClaimDetail.find({petId }); 
            const archiveClaim = await ArchiveClaimsDetail.find({petId }); 


            const claimsdetailFlag = await claimsdetail.map((claim)=>({
                _id: claim._id,
                claimTitle: claim.claimTitle,
                claimDescription : claim.claimDescription,
                areaOfIssue : claim.areaOfIssue,
                incidentStartDate : claim.incidentStartDate,
                vetDate : claim.vetDate,
                vetDetail : claim.vetDetail,
                claimStatus : claim.claimStatus,
                claimAmount : claim.claimAmount,
                claimImage : claim.claimImage,
                claimDocument : claim.claimDocument,
                additionalclaimDescription : claim.additionalclaimDescription,
                petId: claim.petId,
                userId: claim.userId,
                isArchived: false,  
            })); 
            const archiveClaimFlag = archiveClaim.map((claim)=>({
                _id: claim._id,
                claimTitle: claim.claimTitle,
                claimDescription : claim.claimDescription,
                areaOfIssue : claim.areaOfIssue,
                incidentStartDate : claim.incidentStartDate,
                vetDate : claim.vetDate,
                vetDetail : claim.vetDetail,
                claimStatus : "Archived",
                claimAmount : claim.claimAmount,
                claimImage : claim.claimImage,
                claimDocument : claim.claimDocument,
                additionalclaimDescription : claim.additionalclaimDescription,
                petId: claim.petId,
                userId: claim.userId,
                isArchived: true, 
            })); 

            const allclaimsconnected = [...claimsdetailFlag, ...archiveClaimFlag];

            response.render("user/pets_profile", {
              title: "pets profile",
              pet,
              user: request.session.user,
              claimsdetail: allclaimsconnected,
            //  insurerCompany
            });

        }catch(error){
            console.error("Error with pet profile details", error);
             response.status(500).send("Error with pet profile");
        }

    });




    // Edit pet profile details
    app.post("/user/pets_profile/:id",isAuthen, async (request, response) => {
        try{
            const petId = request.params.id;
            
            const {
                petName, petType, breed, gender,
                colour, dateOfBirth, microchipping, microchippingNum,
                policyNum,desexed, startDate, endDate,insuranceCompanyName //, insurerCompanyId
            } = request.body;        

             const pet = await PetAccountDetail.findById(petId);
            



             // update pet details
             pet.petName = petName,
             pet.petType= petType,
             pet.breed = breed,
             pet.gender = gender,
             pet.colour = colour,
             pet.dateOfBirth = dateOfBirth,
             pet.microchipping = microchipping,
             pet.microchippingNum = microchippingNum,
             pet.policyNum = policyNum,
             pet.desexed = desexed,
             pet.startDate = startDate,
             pet.endDate = endDate,
              pet.insuranceCompanyName = insuranceCompanyName,
          //   pet.insurerCompanyId = insurerCompanyId,

            // save details
            await pet.save();
            //get the updated details
           //const updatedPetDetails = await PetAccountDetail.findById(petId);
        //    request.session.user ={
        //        //_id: pet._id,
        //        petName: pet.petName,
        //        petType: pet.petType,
        //        breed: pet.breed,
        //        gender: pet.gender,
        //        colour: pet.colour,
        //        dateOfBirth: pet.dateOfBirth,
        //        microchipping: pet.microchipping,
        //        microchippingNum: pet.microchippingNum,
        //        policyNum: pet.policyNum,
        //        desexed: pet.desexed,
        //        startDate: pet.startDate, 
        //        dateOfBirth: pet.dateOfBirth,
        //        endDate: pet.endDate,
        //         insuranceCompanyName: pet.insuranceCompanyName,  
        //       // insurerCompanyId: pet.insurerCompanyId,                              
        //    }
            const claimsdetail = await ClaimDetail.find({petId: pet._id }); 


            response.render("user/pets_profile", {
                title: "Pet Profile",
                pet: pet,
                claimsdetail: claimsdetail,
                errorMessage: null
            });
        }catch(error){
            console.error("Error with pet profile details", error);
            response.status(500).send("Error with pet profile");
        }    
    });
 



// #######################  CLAIM SECTION  ##############################################


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
                    pet: pet,
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
                    additionalclaimDescription: request.body.additionalclaimDescription,
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
                const pet = await PetAccountDetail.findById(body.petId);
                response.render("user/new_claims", {
                    title: "new claim",
                    pet: pet  ,
                    user: request.session.user
                 });
      
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
               let claim = await ClaimDetail.findById(claimId);

               let isArchived = false;

                // If claim not found in active claims, check archived claims
                if (!claim) {
                   claim = await ArchiveClaimsDetail.findById(claimId);
                  if (claim) {
                     isArchived = true;
                  }else{
                    return response.status(404).send("Claim not found");
                  }
               
                }

                if (!claim) {
                    return response.status(404).send("Claim not found");
                }
                const pet = await PetAccountDetail.findOne({
                     _id: claim.petId, 
                     userId: request.session.user._id 
                });

               response.render("user/view_claims", {
                   title: "View Claim",
                   pet:pet,
                   claim,
                   user: request.session.user,
                   isArchived: isArchived
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
                claim.additionalclaimDescription = body.additionalclaimDescription;
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
                    isArchived: false
                });

            } catch (error) {
                console.error("Edit error", error);
                response.status(500).send("Error with Edit");
            }

        });

        // post notifcation to claim is ready to insurer
    //    app.post("/update_insurer_of_Claim", async(request, response)=>{
    //        try{
    //
    //        }
    //        catch(error){
    //            console.error("Error with claim Notfying to Insurer");
    //            response.status(500).send("Error with Notfying");
    //        }
    //    });

        //archiving a claim
         app.post("/user/archive_claims/:id",isAuthen, async (request, response) => {
            try {
                const claimId = request.params.id;
                // checking for claim with the id
                const claim = await ClaimDetail.findById(claimId);
                 if (!claim) {
                    return response.status(404).send("Claim not found");
                }
                // creating a field for archiveClaim
                const archiveClaim = await ArchiveClaimsDetail({
                    claimTitle: claim.claimTitle,
                    claimDescription : claim.claimDescription,
                    areaOfIssue : claim.areaOfIssue,
                    incidentStartDate : claim.incidentStartDate,
                    vetDate : claim.vetDate,
                    vetDetail : claim.vetDetail,
                    claimStatus : claim.claimStatus,
                    claimAmount : claim.claimAmount,
                    claimImage : claim.claimImage,
                    claimDocument : claim.claimDocument,
                    additionalclaimDescription : claim.additionalclaimDescription,
                    petId: claim.petId,
                    userId: claim.userId,
                    archivedAt: new Date()    
                });   
                //save archive claim
                await archiveClaim.save();
                // remove the orignal claim
                await  ClaimDetail.findByIdAndDelete(claimId);

               
               const pet = await PetAccountDetail.findOne({ 
                   _id: claim.petId, 
                   userId: request.session.user._id
                });

               response.render("user/view_claims", {
                   title: "View Claim",
                   pet: pet,
                   claim: archiveClaim,
                   user: request.session.user,
                   // archving 
                   isArchived: true,
               });

              //  response.redirect("/user/pets_profile/${claim.petId}");

            } catch (error) {
                console.error("archiving error", error);
                response.status(500).send("Error with archiving");
            }

        });

    // GET - User Payment Details
    app.get("/user/user_paymentDetails/id",  isAuthen, async (request, response) => {
            response.render("user/user_paymentDetails", { 
                title: "User Payment Details",
                pet: pets,
                user: request.session.user || null,
                errorMessage: null
            });
    });        





// #######################  INSURANCE COMPANY USER SIDE SECTION  ##############################################


//############# Insurance Company User Register  ########################//

    // GET - ICU Register
    app.get("/insurance/reg_insuranceCompany", (request, response) => {
            response.render("insurance/reg_insuranceCompany", { 
                title: "insurance Company Registration",
                insurerUser: request.session.user || null,
                errorMessage: {},
                values: {},
            });
    });


    // Post Request
    /*
        Collecting both the insurance User and the company details
        storing them in two different schemas 
    */
    app.post("/insurance/reg_insuranceCompany", async (request, response) => {
       
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

            const errorMessage ={};   
            const values= request.body;

         try {   
            // Check Email is entered correctly
            const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            if (!emailFormat.test(staffEmailAddress,)) { 
                 errorMessage.staffEmailAddress ="Incorrect email format";
            }

            if (!emailFormat.test(insuranceCompanyEmail,)) { 
                 errorMessage.insuranceCompanyEmail ="Incorrect email format";
            }


        //Check Username is enterd correctly
            if(!username || username.length < 6){
               errorMessage.username ="Username does not meet requirements please recheck";
              }

    	//Check Password is enterd correctly
            if(!password || password.length < 8 || password.length > 14 ){ 
                errorMessage.password ="password does not meet requirements please recheck";
            }


        // Check if details already Exist             
            const userExisting = await RegisterInsurer.findOne({ 
                $or: [{username},{staffEmailAddress}]
            });


            if(userExisting){ 
                if(userExisting.username === staffEmailAddress){
                    errorMessage.username ="Username already exist";
                }
                if(userExisting.staffEmailAddress === staffEmailAddress){
                    errorMessage.staffEmailAddress ="email Address already exist";
                } 
            }

        //Check if errors are on page it will stay and not go to pet reg page
            if(Object.keys(errorMessage).length >0){
                return response.render("insurance/reg_insuranceCompany",{
                    title: "Register User",
                    errorMessage,
                    values,
                });
            }

            //saving details
            const company = await newInsurerCompany.save();
            // hashing password
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

//############# Insurance Company User Login  ########################//

    // GET - ICU Login
    app.get("/insurance/insurance_loginpage", (request, response) => {
        response.render("insurance/insurance_loginpage", { 
            title: "insurance Login",
            insurerUser: request.session.insurerUser || null,    
            errorMessage: null
        });
    });

     // POST - ICU Login details to direct to profile
    app.post("/insurance/insurance_loginpage",limitLogin, async (request, response) => {
        const { username, password } = request.body;
        try {
            const insurerUser = await RegisterInsurer.findOne({ username }).populate("company");

            //Checking if the user matches on the system    
            if (!insurerUser) {
                   return response.render("insurance/insurance_loginpage", {
                    title: "insurer User Login",
                    errorMessage: "Not a Registered user" 
                     });                    
                } 

            //Checking if the password matches on the system    
            const matchedLogin = await bcrypt.compare(password, insurerUser.password); 

            if(!matchedLogin) {
                    return response.render("insurance/insurance_loginpage", {
                    title: "insurer User Login",
                    errorMessage: "Not Registered password" 
                    });                    
                } 
   
            //request.session.insurerUser = insurerUser;
            request.session.insurerUser ={
                _id: insurerUser._id,
                username: insurerUser.username,
                company: insurerUser.company?.name || null
            };
            // if passes go to profile page
            response.redirect("/insurance/insurance_profile");    

        } catch (error) {
            console.error("Error with Insurance Login", error);
            response.status(500).send("Error with Insurance Login");
        }
    });

//############# Insurance Company User Profile  ########################//

    // GET - ICU Profile
   app.get("/insurance/insurance_profile", isInsurerAuthen, async (request, response) => {
    try {
        //Get the login Insurance user
        const insurerUser = await RegisterInsurer.findById(request.session.insurerUser._id).populate("company");
          // get the users connect to insurance company
        const users = await RegisterUser.find({ 
            insurerCompanyId: insurerUser.company._id 
        }).select('_id firstName lastName');

         // Get the users ID's
        const userIds = users.map(user => user._id);//.toString());

       //get the pets connect to insurance company
        const pets = await PetAccountDetail.find({
           // insurerCompanyId: companyId
        }).select('_id');

        // Get the Pets and the claims ID's
        const petIds = pets.map(pet => pet._id);//.toString());

        // Get the pet claims 
        const claims = await ClaimDetail.find({
           // petId: { $in: petIds }
        })
           .populate("petId")
           .populate("userId")
           .exec();


        // display on profile page
       return response.render("insurance/insurance_profile", {
           title: "Insurer profile",
           insurerUser,
           company: insurerUser.company,
           claims,
           pet:pets,
           users,
       });
    } catch (error) {
       console.error("Error with Insurer profile details", error);
        response.status(500).send("Error with Insurer profile");
      }
   });

    // POST - ICU Profile
   app.get("/insurance/insurance_profile", isInsurerAuthen, async (request, response) => {
    try{

    }catch (error) {
       console.error("Error with Insurer profile details", error);
        response.status(500).send("Error with Insurer profile");
      }
   });



   
// #######################  ADMIN SIDE SECTION ##############################################


    
// GET Reg adming - Admin wont have access to this section. as there wont be a visibale register admin page
 app.get("/admin/reg_adminpage", (request, response) => {
    response.render("admin/reg_adminpage", {
        title: "Admin",
        errorMessage: {},
        values:{}
    });
   
    }); 
    //POST Admin reg
 app.post("/admin/reg_adminpage", async (request, response) => {
    const {
       adminfirstName, adminLastName, adminEmailAddress, adminStaffNumber, username,password
        }= request.body;
    const errorMessage ={};
    const values=request.body;

    try{
        // Check Email is entered correctly
        const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailFormat.test(adminEmailAddress)) { 
            errorMessage.adminEmailAddress ="Email Already on system";
        }
        //Check Password is enterd correctly
            if(password.length < 8 || password.length > 14 ){ 
               // errorMessage.push( "Invalid credentials");
                errorMessage.password ="password must contain 8-14 characters";
            }

        // Check if details already Exist             
            const userExisting = await AdminUser.findOne({ 
                $or: [{username},{adminEmailAddress}]
            });
            if(userExisting){ 
                if(userExisting.username === adminEmailAddress){
                    errorMessage.username ="Username already exist";
                }
                if(userExisting.adminEmailAddress === adminEmailAddress){
                    errorMessage.adminEmailAddress ="email Address already exist";
                }
            }

        //Check if errors 
        if(Object.keys(errorMessage).length >0){
                return response.render("admin/reg_adminpage",{
                    title: "Register Admin",
                    errorMessage,
                    values: request.body,
                });
        }  
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);   
        const admin = await AdminUser({
            adminfirstName, adminLastName, adminEmailAddress, 
            adminStaffNumber, username, password:hashedPassword
        }); 

   
        const adminSaved = await admin.save(); 
        request.session.admin  = adminSaved;
        response.redirect("/admin/admin_profile");

    }catch(error){
        console.error("Error with Admin profile details", error);
        response.status(500).send("Error with Admin profile");     
    }
    
    });


    // Login Page
    app.get("/admin/admin_loginpage", (request, response) => {
        response.render("admin/admin_loginpage", {
            title: "Admin  Login",
            adminUser: request.session.adminUser || null,
            errorMessage: null
        });

    });
 
   app.post("/admin/admin_loginpage", limitLogin, async (request, response) => {
       const { username, password } = request.body;
       try{
           const adminUser = await AdminUser.findOne({ username });

           // Gives error if users doesnt exis
           if (!adminUser) {
                return response.render("admin/admin_loginpage", {
                   title: "Admin Login",
                   errorMessage: "Invalid credentials" 
                });                    
           } 
           // checking password
           const matchedLogin = await bcrypt.compare(password, adminUser.password)
           if(!matchedLogin) {
           //if(adminUser.password !== password){
               return response.render("admin/admin_loginpage", {
                   title: "Admin Login",
                   errorMessage: "Invalid credentials" 
               });                    
           }
            request.session.adminUser ={
                _id: adminUser._id,
                adminfirstName: adminUser.adminfirstName,
                adminLastName: adminUser.adminLastName,
                adminEmailAddress: adminUser.adminEmailAddress,
                adminStaffNumber: adminUser.adminStaffNumber,
                username: adminUser.username
            }
            response.redirect("/admin/admin_profile");
       }catch(error){
           console.error("Error with Admin Login details", error);
           response.status(500).send("Error with Admin Login");
       }
   }); 


  app.get("/admin/admin_profile",isAdminAuthen,async (request, response) => {
    try{
        // Get the Admin User
        const adminUser = await AdminUser.findById(request.session.adminUser._id).lean();

        const users = await RegisterUser.find({ }).select('_id firstName lastName emailAddress insurerCompanyId');
        const insurerUsers = await RegisterInsurer.find({}).populate('company').lean(); 

        response.render("admin/admin_profile", {
            title: "Admin profile",
            adminUser,
            users,
           insurerUsers
        });

    }catch(error){
        console.error("Error with Admin profile details", error);
        response.status(500).send("Error with Admin profile");
    }    


  });


/*
     const adminUser = await AdminUser.findById(request.session.adminUser._id).lean();
      const users = await RegisterUser.find({ }).select('_id');
      const userIds = users.map(user => user._id);
     -// const insurerUser = await RegisterInsurer.findById(request.session.insurerUser._id).populate("company");
      response.render("admin/admin_profile", {
          title: "Admin profile",
          adminUser,
          users,
        //  insurerUser
      });

*/
 // app.get("/admin/admin_profile", (request, response) => {
 //     response.render("admin/admin_profile", { title: "Admin" });
 // });



// #######################  LOGOUT SECTION  ##############################################

    //user
    app.get("/user/logout", (request, response) => {
        request.session.destroy(() => {
            //response.redirect("/user/user_loginpage");
            response.redirect("/");
        });
    });
    //Insurance user
    app.get("/insurance/logout", (request, response) => {
        request.session.destroy(() => {
            //response.redirect("/insurance/insurance_loginpage");
            response.redirect("/");
        });
    });

    //Admin user
    app.get("/admin/logout", (request, response) => {
        request.session.destroy(() => {
            //response.redirect("/insurance/insurance_loginpage");
            response.redirect("/");
        });
    });



    //app.get("/login", (request, response) => {
    //    response.render("login", { title: "login" });
    //});
    ///////////////////////////////////////////////
    //// log off account
    //app.get("/logout", (request, response) => {
    //    //request.session.destroy(() => { response.redirect("/user/user_loginpage");  });
    //    request.session.destroy(() => { response.redirect("/"); });
    //});


// #######################  404 page  ##############################################

app.use((request, response) => {
    response.status(404).render("404", { title: "404" });
});




// ####################### TESTING  ##############################################

 // Important for testing
  // when testing cypress uncomment this and remove test: jest in package.json 
   
  app.listen(3000, () => console.log("Server running"))



});

 //when testing Jest uncomment this and add test: jest in package.json    
 //module.exports = app;


/*######################## END OF TESTING SECTION #######################################*/ 






 // while testing commenting aout app.listen to not run server and jsut using module.exports 
//.catch(err => console.error("MongoDB connection error:", err));
// will switch when finished  // module.exports = app;

//if (require.main !== module) {
   // module.exports = app; 
//} else {  
 // app.listen(3000, () => console.log("Server running"))
//}
     //.catch(err => console.error("MongoDB connection error:", err));