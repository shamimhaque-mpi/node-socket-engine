let buffer = require('./buffer');

let request = class {

    socket  = false;
    buffer  = false;
    request = {};

    constructor (socket, bufferData, request)
    {
        this.socket = socket;
        this.buffer  = new buffer(bufferData);
        this.request = request;
    }

    headers(){
        return this.request.headers;
    }

    header(key){
        return this.request.headers[key];
    }

    data(){
        return this.buffer.data();
    }

    user(){
        return 'N/A';
    }
}


module.exports = request;