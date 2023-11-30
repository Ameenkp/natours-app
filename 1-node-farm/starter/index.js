const fs = require('fs');
const http = require('http');

//
// const textIn = fs.readFileSync('./txt/input.txt' , 'utf-8');
// const textOut = `This is what we know ${textIn}. \nCreated on ${Date.now()}`;
//
//
// fs.writeFileSync('./txt/input.txt' , textOut);
// console.log('fileWritten !');
// fs.readFile('./txt/input.txt' , 'utf-8' , (err , data) =>{
//     if (err){
//         console.log("error reading file " , err.message);
//     }
//     console.log("File Content :" , data);
//     console.log(Date.now());
// });


const server = http.createServer((req , res) =>{

     console.log(req);
    res.end('Hello from the server !');
});

server.listen(8080 , '127.0.0.1' , ()=>{
    console.log('the server is running on port 8080 ! ');
});
