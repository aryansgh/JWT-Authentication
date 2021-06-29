const http = require('http');
const fs = require('fs');
const lo = require('lodash');
//creating a server:
//request and reponse object
const server = http.createServer((req, res) => {
    //lodash prep

    const num = lo.random(0, 20);
    console.log(num);

    const greet = lo.once(() => {
        console.log('Lodash method');
    })

    greet();
    greet();

    console.log('request has been made');
    console.log(req.url, req.method);

    //set header content type
    res.setHeader('Content-Type', 'text/html');
    // res.write('<p>Hello world</p>');
    // res.write('<h1>Hello world</h1>');
    // res.end();
    // fs.readFile('./views/index.html', (err,data) => {
    //     if(err) {
    //         console.log(err);
    //         res.end();
    //     }
    //     else {
    //         res.write(data);
    //         res.end();
    //     }
    // })

    let path = './views/';
    switch(req.url) {
        case '/':
            path += 'index.html';
            res.statusCode = 200;
            break;
        case '/about':
            path+='about.html'
            res.statusCode = 200;
            break;
        case '/about-me':
            res.statusCode = 301;
            //redirect the request
            res.setHeader('Location', '/about');
            res.end();
            break;
        default:
            path+='404.html';
            res.statusCode = 404;
            break;
    }

    fs.readFile(path, (err,data) => {
        if(err) {
            console.log('There has been an error');
            console.log(err);
            res.end();
        }
        else {
            res.write(data);
            res.end();
        }
    })
});

server.listen(3000, 'localhost', () => {
    console.log('Listening for request on port 3000');
});