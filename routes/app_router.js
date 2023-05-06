const express = require("express")
const app_router = new express.Router()
const mailer = require('nodemailer')

app_router.get("/", (req, res) => {
    if (req.session.isAuth) {
        req.session.isAuth = true
        res.redirect(`/${req.session.entity}/dashboard`)
    }
    else {
        res.render("index")
    }
})

app_router.get("/register", (req, res) => {
    if (req.session.isAuth) {
        req.session.isAuth = true
        res.redirect(`/${req.session.entity}/dashboard`)
    }
    else {
        res.render("register")
    }
})

app_router.get("/login", async (req, res) => {
    if (req.session.isAuth) {
        req.session.isAuth = true
        res.redirect(`/${req.session.entity}/dashboard`)
    }
    else {
        res.render("login")
    }
})

app_router.get("/contact", (req, res) => {
    if (req.session.isAuth) {
        req.session.isAuth = true
        res.redirect(`/${req.session.entity}/dashboard`)
    }
    else {
        res.render("contact")
    }
})

app_router.post("/contact", (req, res) => {
    const {email,subject,message} = req.body;
    let status = "Message sent successfully. We'll revert back soon" 
    smtpProtocol = mailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.COMPANY_EMAIL,
          pass: process.env.COMPANY_EMAIL_PASSWORD,
        },
      });

      var mailoption = {
        from: email,
        to: process.env.COMPANY_EMAIL,
        subject: subject,
        html: `<p>${message}</p>`,
      };
      smtpProtocol.sendMail(mailoption, function (err, response) {
        if (err) {
          console.log(err);
          status = err.message;
        }
        console.log("Message Sent" + response.message);
        smtpProtocol.close();
        res.render("contact",{status:status})
      });
})

app_router.get("/about", (req, res) => {
    if (req.session.isAuth) {
        req.session.isAuth = true
        res.redirect(`/${req.session.entity}/dashboard`)
    }
    else {
        res.render("about")
    }
})

app_router.post("/login", (req, res) => {
    res.render("login")
})

app_router.post("/register", (req, res) => {
    res.render("register")
})

module.exports = app_router