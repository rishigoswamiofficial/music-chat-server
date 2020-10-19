const express = require('express');

const app = express();
const PORT = 3000

app.listen(PORT,'localhost', function (){
    console.log("Server Connected!!");
})