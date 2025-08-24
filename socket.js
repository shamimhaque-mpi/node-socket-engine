
const crypto  = require('crypto');
const clientRequest = require('./vendor/request');
const channels = require('./vendor/channel');


class Socket {

    // ANONYMOUS METHOD LIST
    anonymous = {
        middleware : false,
        alive : false,
    }; 

    chennels = new channels();
    server   = false;
    config   = {
        validation_type : 'header',
        header:'client_key',
    };

    constructor (server, config={}){
        this.server = server;
        this.config = {...this.config, ...config};
        this.init();
    }



    init(){
        if(this.server)
        this.server.on('upgrade', (request, socket, head)=>{
            //
            if(this.setClientPing(request, socket)){

                socket.on('data', (buffer)=>{
                    if(!this.isPong(buffer)){
                        try {
                            if(this.anonymous.alive) {
                                this.anonymous.alive(new clientRequest(socket, buffer, request), new channels(this.chennels));
                            }
                        }
                        catch(err){
                            console.log(err);
                        }
                    }
                });
                //
                socket.on('error', ()=>{});
                socket.on('close', ()=>{});
            }
        });
    }



    alive(fn=false){
        this.anonymous.alive=fn;
        return this;
    }




    /*******************************
    * CHECKING DEVELOPER POLICY 
    * @RETURN SELF OBJECT
    **************************** */
    middleware(fn=false){
        this.anonymous.middleware = fn;
        return this;
    }








    /*******************************
    * SET PING INVERVAL FOR 
    * CLIENT ALIVE 
    * @RETURN BOOLEAN
    **************************** */
    setClientPing(request, socket){

        let valid_client = request.headers[this.config.header];

        if(valid_client && (!this.anonymous.middleware || this.anonymous.middleware(request)))
        {
            socket.write(this.makeSocketHaders(request));
            socket.setKeepAlive();

            this.chennels[valid_client] = socket;
            let checkUserActivity = setInterval(()=>{
                if(socket.readyState==='open')
                    socket.write(Buffer.from([0x89, 0x00]));
                else {
                    delete this.chennels[valid_client];
                    clearInterval(checkUserActivity);
                }
            }, 5000);
            //
            return true;
        }
        return false
    }









    /*******************************
    *  CHECKING PONG RESPONSE
    *  @RETURN BOOLEAN
    **************************** */
    isPong(buffer){
        const firstByte = buffer[0];
        const opcode = firstByte & 0x0F; // Mask out the FIN and RSV bits
        return (opcode === 0x0A); // Pong frame opcode
    }




    



    /*******************************
    *  SET SOCKET HEADER WITH
    *  ACCEPT KEY
    *  @RETURN PLAIN TEXT
    **************************** */
    makeSocketHaders(req)
    {
        const acceptKey = req.headers["sec-websocket-key"];
        const hash = crypto
            .createHash("sha1")
            .update(acceptKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
            .digest("base64");

        const responseHeaders = [
            "HTTP/1.1 101 Switching Protocols",
            "Upgrade: websocket",
            "Connection: Upgrade",
            `Sec-WebSocket-Accept: ${hash}`,
        ];
        return responseHeaders.join('\r\n') + '\r\n\r\n';
    }


}

module.exports = Socket;