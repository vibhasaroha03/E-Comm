var http = require("http")
http.createServer(function(req,res){
res.write("Hello World ")
res.end()


}).listen(5000)
console.log("Server is running at 5000")