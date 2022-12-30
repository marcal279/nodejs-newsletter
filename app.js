const PORT = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
    apiKey: "db1b892ecb11e146aafb5f3b6c9a81be-us13",
    server: "us13"
})

async function mailchimpPing(){
    const response = await mailchimp.ping.get();
    console.log(response);
}

const listID = "88c216ce94";    // MusicMail

async function mailchimpAddMember(fname, lname, emailArg){
    const response = await mailchimp.lists.addListMember(listID,{
        email_address: emailArg,
        status: "subscribed",
        merge_fields: {
            FNAME: fname,
            LNAME: lname
        }
    })
    console.log(`creation status: ${response.status}`);
}

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,resp)=>{
    resp.sendFile(__dirname+'/html/index.html');
})

app.post('/', (req,resp)=>{
    const name = req.body.nameData;
    var fname = name.slice(0,name.indexOf(' ')), lname = name.slice(name.indexOf(' ')); 
    const email = req.body.emailData;

    mailchimpPing();
    mailchimpAddMember(fname, lname, email).then(()=>{
        resp.sendFile(__dirname+'/html/success.html');
    }).catch(()=>{
        resp.sendFile(__dirname+'/html/failure.html');
    });
})

app.listen(PORT, ()=>{console.log(`Server running on Port ${PORT}`)} );