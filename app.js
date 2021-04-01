var express = require("express");  
var app = express();  

app.use(express.static("public"));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/html/index.html");
})

console.log("listen http://127.0.0.1:8080 ...")

app.listen(8080);