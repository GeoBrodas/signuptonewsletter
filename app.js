const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.post("/", function(req, res){
  const fName = req.body.firstName;
  const sName = req.body.secondName;
  const eId = req.body.emailId;
  //console.log(fName + " " + sName + " " + eId);
  //Data to be sent to mailChimp
  const data = {
    members : [
      {
        email_address: eId,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: sName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/708c6854c5";
  const options = {
    method: "POST",
    auth: "geo: b4218d0d740df506551b8a914588a5b0-us17"
  };

  const request = https.request(url, options, function(response){

    if (response.statusCode===200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html")
    }

    /*response.on("data", function(data){
      //console.log(JSON.parse(data));
    });*/
  });

  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started at port 3000");
});

//b4218d0d740df506551b8a914588a5b0-us17
//id = 708c6854c5
