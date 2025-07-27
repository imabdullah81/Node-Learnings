const express = require('express');
const app = express();
const fs = require('fs');
const users = require('./MOCK_DATA.json');
// app.use() ---> Midddlewares containing functions that execute during the request-response cycle
// Middleware to parse JSON request bodies ------
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log("Hello from middleware 1.");
    //Middleware can make changes to the request and response objects
    fs.appendFile('log.txt',`\n${Date.now()} : ${req.path} : ${req.method}`, (err,data)=>{
        next();
    })
     req.myName = "Abdullah";
    //return res.send("Hello from middleware 1.");
    //next(); // Call next() to pass control to the next middleware function
})
/*
app.use((req, res, next) => {
    console.log("Hello from middleware 2.",req.myName);
    return res.end("Hello from middleware 2.");
    //next(); // Call next() to pass control to the next middleware function
})
*/

//Server side rendering the html
app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
})

//Routes for REST API
app.get('/api/users', (req, res) => {
    res.json(users);
})
/*
app.get('/api/users/:id',(req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user)=>user.id === id);
    res.send(user ? user : { error: 'User not found' });

});

app.patch('/api/users/:id',(req,res)=>{
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user)=>user.id === id);
    if(userIndex !== -1){
        const updatedUser = {...users[userIndex], ...req.body};
        users[userIndex] = updatedUser;
        res.send(updatedUser);
    } else {
        res.status(404).send({ error: 'User not found' });
    }
});
app.delete('/api/users/:id',(req,res)=>{
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user)=>user.id === id);
    if(userIndex !== -1){
        users.splice(userIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send({ error: 'User not found' });
    }
});
*/

app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        res.json(user ? user : { error: 'User not found' });
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex !== -1) {
            const updatedUser = { id: users[userIndex].id, ...req.body };
            users[userIndex] = updatedUser;
            fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err, data) => {
                res.send("User updated successfully");
            })
            //res.json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err, data) => {
                res.status(204).send();
            })
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });

app.post('/api/users', (req, res) => {
    const body = req.body;
    users.push({id: users.length + 1, ...body});
    fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        res.status(201).json({status : "User created successfully"});
    });
    //console.log("Body : ",body);
    //return res.send("pending...")
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})