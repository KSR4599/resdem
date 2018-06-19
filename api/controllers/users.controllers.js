var mongoose = require('mongoose')
var User = mongoose.model('User')
var fs= require("fs")
const multer = require('multer');
var upload = multer({dest: '../resdem/views/images/profilepics'})
const nodemailer = require('nodemailer')

module.exports.userRegister = function(req, res){
res
 .render('register')
}

module.exports.userLogin = function(req, res){
global.user=req.user;
res
 .render('login')
}

module.exports.getProfile = function(req, res){
  var user=req.user;

res.render('profile',{user,pic:user.profileimage})

}


module.exports.getContact = function(req, res){
res
 .render('contact')
}

module.exports.sendContact = function(req, res){
const output=`
<p> You have made a following query with us!</p>
<h3>Details:-</h3>
<ul>
 <li>Name:${req.body.name}</li>
 <li>Email:${req.body.email}</li>
 <li>Phone:${req.body.phone}</li>
 <li>Query:${req.body.query}</li>
</ul>
<h3>Query:-</h3>
<p>${req.body.query}</p>
<h4>We will look forward with your query and deliver the best support we can!</h4>
`;

// create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'killershell9@gmail.com', // generated ethereal user
            pass:  'KSRKILL459945'// generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
  /*
    let mailOptions = {
        from: '"KSR🔥" <killershell9@gmail.com>', // sender address
        to: '', // list of receivers
        subject: 'We have received your request', // Subject line
        text: 'Hello', // plain text body
        html: output // html body
    };
*/

let mailOptions = {
    from: '"KSR🔥" <killershell9@gmail.com>', // sender address
    to: 'requests4599@gmail.com', // list of receivers
    subject: 'We have received a query request for Askss Website', // Subject line
    text: 'Hello', // plain text body
    html: output // html body
};






    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
         res.render('thn')
    });




}
