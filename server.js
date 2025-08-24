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




// checkUser('eyJpdiI6ImxKSkZBYUxVMVpIMHVUdEN0WHpYeGc9PSIsInZhbHVlIjoiRFdWaStqZVhkNkVNVzdSWVI1V3VIaG03U1IrdWhmMGdwb1ZsbFhRWGx4VWU4R1pmRVlNc2Z1aDN3azNyZng2RmFLRWhxTmZWR3JFaUQ4ZmxYUVBHU2lPWDl0ZEx3SlY3am1VN0VjRk9nRFg0cDJMb0xHRGlRM0VHdzRYVldxRzkiLCJtYWMiOiI2MzYyMWIzNzI3YWZlZjI4NWFiNTUxY2ExZjEwOGYyM2UxMGFmNTg4OTRlNzU0MmFmM2NjMDliYWMxODY1ODc0IiwidGFnIjoiIn0%3D').then(res=>{
//     console.log(res, 'resdddd');
// })
// .catch(err=>console.log(err));



function checkUser($token=''){

    return new Promise((resolve, reject)=>{

        // 
        const request = http.request({
            hostname: 'localhost',
            port: 8000,
            path: '/user',
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : $token,
                'Cookie'       : `XSRF-TOKEN=${$token};laravel_session=eyJpdiI6InNIL2o5eFEzN1phUlhGbFBibjNSOWc9PSIsInZhbHVlIjoidlpCd0RtZjBlbGRnTENrNG5hQkxka1ZBdm51SDVmN0h6OFFxRTVsOHJCT09FZUNqRlF3WE9NRmVHSWJISEFQdms0SFpqVy8xWlZIcENGN0Y4aGFUVTN5Z1Y2L2ZiN0IxWUc2OEhJQ0hIYmRCVFJjVTluUExGZzRZbjNMdGJ2LysiLCJtYWMiOiI1ZjFmZDBmZDlmMTkzM2FmOWRhMzY0MTE0MDdmMWUwMzY4NjI3N2QyODA1N2IxYmM0YmM0YjY2MWMyYjkwZDFiIiwidGFnIjoiIn0%3D`
            }
        }, (res)=>{
            let data = '';
            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });
        
            // The whole response has been received. Print out the result.
            res.on('end', () => {
                resolve(data);
            });
        });
        
        
        request.on('error', function(e){
            reject(e.message);
        });
        // request.write(JSON.stringify({'name':'shamim'}))
        request.end();

    });
}



server.listen(8080, ()=>{
    console.log('WebSocket server listening on ws://localhost:8080');
});