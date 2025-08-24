let channel = class {

    request = false;
    buffer = false;
    client_key;
    client;

    constructor (request, buffer){
        this.request = request;
        this.buffer = buffer;
    }
    user(client_key){
        this.client_key = client_key;
        this.client = this.request[client_key];
        return this;
    }
    info(){
        return this.client;
    }
    send(message='', client_key){
        const text = JSON.stringify({
            client_key : client_key,
            message : message
        });
        const reply = Buffer.from([0x81, text.length, ...Buffer.from(text)]);
        this.client.write(reply);
    }
}


module.exports = channel;