const express = require("express")
const recycler_router = new express.Router()
const {db} = require("../db/conn")
const {orders} = require("../db/conn")
const middleware = require("../middlewares/recycler_middleware")

recycler_router.post("/recycler/register", middleware.register, async (req, res) => {
    console.log(req.session.isAuth);
    if (req.session.alreadyRegistered) {
        res.render("login")
    }
    else if (req.session.isAuth) {
        res.redirect("/recycler/dashboard")
    }
    else {
        res.render("register")
    }
})

recycler_router.post("/recycler/login", middleware.login, async (req, res) => {
    if (req.session.isAuth) {
        req.session.isAuth = true
        res.redirect("/recycler/dashboard")
    }
    else {
        res.render("login")
    }
})

recycler_router.get("/recycler/dashboard", middleware.isAuth ,async (req, res) => {
    // Display Accepted Requests
    let accepted_requests;
    await db.promise().query(`select * from orders where recycler_id = ${req.session.company_id} and order_status = ${process.env.ACCEPTED_ORDER_STATUS};`)
    .then((data) => {
        accepted_requests = data[0]
        // console.log(accepted_requests);
    }).catch((err) => {
        console.log(err.message);
    })

    // Display available Requests
    let available_requests;
    let available_requests_not_rej = [];
    await db.promise().query(`select * from orders where waste_type = ${req.session.waste_type} and order_status > ${process.env.ENTIRELY_REJECTED_ORDER};`)
    .then(async(data) => {
        available_requests = data[0]
        for (let i = 0; i < available_requests.length; i++) {
            temp_order_id = available_requests[i].order_id;
            // await orders.find({order_id: temp_order_id, rejected_by: req.session.company_id})
            await orders.find({order_id: temp_order_id, rejected_by: req.session.company_id})
            .then((data) => {
                if (data.length === 0) {
                    // console.log(data);
                    available_requests_not_rej.push(available_requests[i]);
                }
            })
            .catch((err) => {
                console.log("Cannot get data", err.message);
            })
        }
        // console.log(available_requests);
    }).catch((err) => {
        console.log(err.message);
    })

    // Display Pending Verification Requests
    let pending_verification_requests;
    await db.promise().query(`select * from orders where recycler_id = ${req.session.company_id} and order_status = ${process.env.RECYCLER_EXECUTED_ORDER_STATUS};`)
    .then((data) => {
        pending_verification_requests = data[0]
        // console.log(pending_verification_requests);
    }).catch((err) => {
        console.log(err.message);
    })

    // Display Executed Requests
    let executed_requests;
    await db.promise().query(`select * from orders where recycler_id = ${req.session.company_id} and order_status = ${process.env.PRODUCER_EXECUTED_ORDER_STATUS};`)
    .then((data) => {
        executed_requests = data[0]
        // console.log(executed_requests);
    }).catch((err) => {
        console.log(err.message);
    })

    req.session.isAuth = true

    res.render("recycler_dashboard", {
        name: req.session.username,
        accepted_requests: accepted_requests,
        available_requests: available_requests_not_rej,
        pending_verification_requests: pending_verification_requests,
        executed_requests: executed_requests
    })
})

recycler_router.get("/recycler/order/accept/:id", middleware.isAuth, middleware.acceptOrder, async (req, res) => {
    res.redirect("/recycler/dashboard")
})

recycler_router.get('/recycler/order/execute/:id', middleware.isAuth, middleware.executeOrder, async (req,res)=>{
    console.log(req.session.isAuth, "outside");
    res.redirect('/recycler/dashboard')
})


recycler_router.get('/recycler/order/reject/:id', middleware.isAuth, middleware.rejectOrder, async (req,res)=>{
    console.log(req.session.isAuth, "outside");
    res.redirect('/recycler/dashboard')
})

recycler_router.get("/recycler/logout", middleware.isAuth, (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME)
    req.session.destroy()
    console.log("Logged out successfully");
    res.redirect("/login")
})

module.exports = recycler_router