const http = require('http');
const fs = require('fs');
const url = require('url');
const myServer = http.createServer((req, res) => {
    if(req.url === "/favicon.ico") {
        return res.end();
    }
    const myUrl = url.parse(req.url, true);
    const log = `${Date.now()} : Request received for ${req.url}`;
    fs.appendFile("log.txt", log + "\n", (err,data) => { res.end("Hello, World!"); });
    //console.log(myUrl);
    switch(myUrl.pathname){
        case "/":
            res.end("Welcome to the homepage!");
            break;
        case "/about":
            if(myUrl.query.myname) {
                res.end(`Hello, ${myUrl.query.myname} how are you!`);
            } else {
                res.end("Muhammad Abdullah 221476.");
            }
            break;
        case "/signup":
            if(req.method === "GET") {

                res.end(`This is a  signup page! with ${req.method} method.
                Your name is ${myUrl.query.myname} Id : ${myUrl.query.id} Gender : ${myUrl.query.gender}`);
            }
            else if (req.method === "POST"){
                res.end("Successfully signed up!");
            }
            break;
        default:
            res.end("404 Not Found");
    }
});

myServer.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});