//SERVER
const http = require('http');

//creating a server -> it accepts a callback function , that has request and response as its parameter
const server = http.createServer((req,res) =>{
    res.end('response from the server')
});

//now we need a listner to listen to these req (listen(port,host(part before .com),optional : callback function))
//optional callback function => runs as soon as server start listening
server.listen(8000,'127.0.0.1',()=>{
    console.log('server is listening')
})