// importing express
const express = require('express');
const app = express();

// using express, ensuring we can read json values
app.use(express.json())

app.get('/', function (req, res) {
    res.send('<h1> Hi Ife b the girl <h1>')
});

const users = [
    {
        firstName: 'Lani',
        lastName: 'Juyitan',
        email: 'ooluwalani@gmail.com',
        password: '123456',
    },
    {
        firstName: 'Tomi',
        lastName: 'Thomas',
        email: 'tthomas@gmail.com',
        password: '13531',
    },
];

// get all users
app.get("/users", (req, res) => {
    res.status(200).json(users);
});

// register  new user and check for unique email. Log welcome message
app.post("/users", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if ( !firstName || !lastName || !email || !password ) {
        return res
        .status(400)
        .json({ status: "fail", message: "Incomplete details" });
    }
    if(users.find(el => el.email === email.toLowerCase())) {
        return res
        .status(409)
        .json({ status: "fail", message: "User exists. Please register with another email." });
    }
    users.push(req.body);
    res.status(201).json({status: "success", message: `Sign Up successful. Welcome ${firstName}`});
});

// use middlewares
app.use("/users/:userEmail", (req, res, next) => {
    const { userEmail } = req.params;
    const currentUser = users.find(el => el.email === userEmail);
    if (currentUser) {
        req.currentUser = currentUser;
        return next();
    }
    // res.status(404).json({status: "fail", message: `User not found`})
    res.status(404).json({status: "fail", message: `User with email "${ userEmail }" not found`})

})

// get single user
app.get("/users/:userEmail", (req, res) => {
    // console.log(req.currentUser)
    return res.status(200).json({ 
        status: "success", 
        message: "User fetched successfully", 
        data: req.currentUser 
    });
});

// edit firstname and last name

// app.put("/users/:userEmail", (req, res) => {
//     const updateData = {...req.currentUser , firstName: req.body.firstName} || {...req.currentUser , lastName: req.body.lastName };
//     // const currentEmail = users.find((el) => el.email === (updateData.email));
//     const index = users.findIndex((el) => el.email === (updateData.email));
//     users[index] = updateData;
//     res.status(200).json({ 
//         status: "success", 
//         message: `User with email ${ updateData.email }, has a first name of ${ req.body.firstName } 
//         and a last name of ${ req.body.lastName }`, 
//         data: updateData });
// })


// edit firstname and last name
app.put("/users/:userEmail", (req, res) => {
    if (req.body.firstName) {
        req.currentUser.firstName = req.body.firstName 
    }
    if (req.body.lastName) {
        req.currentUser.lastName = req.body.lastName 
    }
    if (req.body.password) {
        req.currentUser.password = req.body.password 
    } 
    return res.status(200).json({ 
        status: "success", 
        message: `User with email ${ req.currentUser.email }, has a first name of ${ req.currentUser.firstName } and a last name of ${ req.currentUser.lastName }`, 
        data: req.currentUser  
    });

    // const {userEmail} = req.params;
    // const currentUser = users.find(el => `${el.email}` === userEmail);
    // const updateData = {...req.currentUser , firstName: req.body.firstName} || {...req.currentUser , lastName: req.body.lastName };
    // const currentEmail = users.find((el) => el.email === (updateData.email));
    // const index = users.findIndex((el) => el.email === (updateData.email));
    // users[index] = updateData;
})

// user login

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if ( !email || !password ) {
        return res
        .status(400)
        .json({ status: "fail", message: "Invalid email or password. Kindly fill in details correctly." });
    }
    const user = users.find(el => el.email === email.toLowerCase()) 
    if (!user) {
        return res
        .status(400)
        .json({ status: "fail", message: "Incorrect email" });
    }
    if (user.password != password){
        return res
        .status(409)
        .json({ status: "fail", message: "Incorrect password" });
    }
    res.status(200).json({status: "success", message: `Log in successful. Welcome ${user.firstName}`});
});

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`);
});