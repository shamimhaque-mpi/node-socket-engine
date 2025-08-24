const http   = require('http');
const socket = require('./socket');


const server = http.createServer((request, res)=>{
    res.writeHead(404);
    res.end('eeeeee');
});


const chennel = new socket(server, {
    validation_type : 'header',
    header_key:'client_key'
});

chennel.middleware(function(request){
    // console.log(this.config);
    return true;
})
.alive(function(request, chennels){
    
    const res = JSON.parse(request.data());

    if(chennels.request[res.client_key]){
        chennels.user(res.client_key).send(res.message, request.header('client_key'));
    }
});


server.listen(8080, ()=>{
    console.log('WebSocket server listening on ws://localhost:8080');
});