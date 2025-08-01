# M'Ainmhi

## Table of Contents

-  Overview 
-  Access to Application
-  How to Install M'Ainmhi
-  Features 
-  Security Used
-  Credits


## Overview 
- M'Ainmhi allows users to create an account for themselves and their pets with the goal to store claims or issues that their pets are currently going through. 
-  Future plan of the site is that the Users' insurance company and their vets will be able to create an account on the app and allow them to have a one stop shop to interact and keep all the pets' details in one location to help speed up the claim processes.
- Security implemented on this application is to secure the users details from the frontend to backend. The use of encryption, LimitLogin, input checks being implemented to force a level of security for the protection of the users.

##  Access to Application
- Clone code from Github,
- Copy the link or open via GitHub Desktop

  

#### How to Install M'Ainmhi

- Install the following input with npm install

  "dependencies": {
    "bcrypt": "^6.0.0",
    "body-parser": "^2.2.0",
    "bson": "^5.5.1",
    "busboy": "^1.6.0",
    "cookie-parser": "^1.4.7",
    "crypto": "^1.0.1",
    "dicer": "^0.3.1",
    "dotenv": "^16.5.0",
    "ejs": "^3.1.10",
    "express": "^4.21.2",
    "express-async-errors": "^3.1.1",
    "express-rate-limit": "^7.5.0",
    "express-session": "^1.18.1",
    "express-validator": "^7.2.1",
    "hbs": "^4.2.0",
    "lodash": "^4.17.21",
    "mongodb": "^5.9.2",
    "mongoose": "^7.5.0",
    "multer": "^2.0.1",
    "multer-gridfs-storage": "^5.0.2",
    "nodemailer": "^7.0.4",
    "ratelimit": "^0.0.4"
  },

- Open terminal page in VS Code and input: nodemon app
- Located on http://localhost:3000/ in any browser


 ### Deployed Version can be found [ LINK TO ADDRESS ]

## Features 

- M'Ainmhi  is based around three roles - User, Insurance Company User (ICU), and Admin
  -  User
     - Create Account
        - User creates a profile and a pet profile
        - User can create more pet profiles once logged in
        - User can edit their profile details and their pet's profiles
     - Claim Creation via Pet Profile
       - Select Create Claim and complete claim form
       - Add images & documents 
       - Once saved the claim will appear on pets' profile page
       - User will be able to view and edit the form
     - Archive Claims
       - Select Archive claim option on pets profile page
       - User will be able to view claim but wont be able to edit it once archived
     - Submit Claims
       - User will be able to select the submit button that notifies the insurance company that a claim is ready to view.
  - Insurance Company User (ICU)
     - ICU can create a profile for their company
     - ICU will be able to view all users connected to the company
     - ICU will be able to view open claims
     - ICU will be able to leave a comment / change status
  - Admin
     - Admin can login and view all users on the app
     - Admin will be able to Unlock users accounts
     - Admin will be able to create reports connected to users or claims on the site

## Security

  - Session & Cookies
   As there are 3 roles users that can access the site, the use of session and authentication the session was a need. All three can login at different browsers at the same time without affect one another

<img width="644" height="531" alt="Image" src="https://github.com/user-attachments/assets/909f6a65-4f23-4978-b4c7-0c60c5872d59" />

   - Header security
   Blocking XSS attacks and the use of other attack and messages sent over https. It allows only trusted or secure site cookies with a check for the users’ activity on the page, if none the pages check will restart.
   
<img width="1169" height="266" alt="Image" src="https://github.com/user-attachments/assets/70df20fa-ff78-4ff8-a18e-da0e7e350d61" />

   - limitLogin
  To be able to have the function of locked accounts and stop a user inputting their passwords too many times incorrectly.
<img width="437" height="110" alt="Image" src="https://github.com/user-attachments/assets/f59ad24e-6698-4772-8bad-8e65aa45a64b" />

   - Middleware
  All three have different restrictions or allowance on what they can or cannot access to their connected role. These are then called in the routes connecting to the individual user to check that the correct user account is being accessed. 
<img width="374" height="425" alt="Image" src="https://github.com/user-attachments/assets/c8decf87-8f1a-432f-a93f-2105b27fffd4" />

   - Register Checks &  Login checks
 Checks at registration and Login was needed to make sure the user is inputted the correct format and to also check that if the users already has an account they arent duplicating their account
<img width="619" height="510" alt="Image" src="https://github.com/user-attachments/assets/67466fb0-e65d-4c9b-af7e-aa46a7638fea" />
<img width="537" height="313" alt="Image" src="https://github.com/user-attachments/assets/d9c6b556-3c78-4799-ad21-a1455dac330f" />

 - Password Encryption
Once the user registers their account and their details are correct the password will be save to the database. to ensure even if hacked the password was hashed to protect the users account
<img width="491" height="120" alt="Image" src="https://github.com/user-attachments/assets/8499af3d-376f-487c-848a-cb3fd60fa6c5" />

 
## Credits

HOLLY DOWLING  :  X21150117 - x21150117@student.ncirl.ie