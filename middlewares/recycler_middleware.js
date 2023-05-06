const bcrypt = require("bcrypt")
const {db} = require("../db/conn")
const {orders} = require("../db/conn")
 
const register = async (req, res, next) => {
    req.session.alreadyRegistered = false
    const recycler_name = req.body['company-name']
    const email = req.body['company-email']
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body['password'], salt)
    const contact_number = req.body['company-contact-number']
    const building_number = req.body['building-number']
    const building_name = req.body['building-name']
    const street = req.body['street']
    const city = req.body['city']
    const district = req.body['district']
    const pincode = req.body['pincode']

    const north = parseFloat(req.body['north-coordinate'])
    const east = parseFloat(req.body['east-coordinate'])

    const waste_type = Number(req.body['waste-type'])

    try {
        let company_id;

        await db.promise().query(`select * from recyclers where recycler_email='${email}'`)
        .then((data) => {
            if (data[0].length!=0) {
                req.session.isAuth = false
                req.session.alreadyRegistered = true
                console.log("Returned");
                next()
                return
            }
        })
        .catch((err) => {
            console.log(err);
        })

        await db.promise().query(`insert into recyclers (recycler_name, recycler_email, recycler_contact_number, waste_type, password) values ('${recycler_name}', '${email}', ${contact_number}, ${waste_type}, '${password}');`)
            .then(async (data) => {
                company_id = data[0]['insertId']

                await db.promise().query(`insert into addresses values (${company_id}, '${building_number}','${building_name}', '${street}', '${city}', '${district}', ${pincode}, ${north}, ${east});`)
                    .then((data) => {
                        req.session.username = recycler_name
                        req.session.company_id = company_id
                        req.session.waste_type = waste_type
                        req.session.entity = "recycler"
                        req.session.isAuth = true
                        next()
                        return
                    })
                    .catch((err) => {
                        console.log(err);
                        // req.session.isAuth = false
                    })
            })
            .catch((err) => {
                console.log(err.message);
                // req.session.isAuth = false
            })
    } catch (error) {
        console.log(error.message);
        // req.session.isAuth = false
    }
}

const login = async (req, res, next) => {
    const email = req.body['company-email']
    const password = req.body['password']

    let user

    await db.promise().query(`select * from recyclers where recycler_email = '${email}';`)
        .then((data) => {
            user = data[0][0]
            if (user === undefined) {
                // console.log("Wrong Email ID");
                req.session.isAuth = false
            }
            bcrypt.compare(password, user['password'])
                .then((auth) => {
                    if (auth) {
                        // console.log("Logged in successfully");
                        req.session.username = user.recycler_name
                        req.session.company_id = user.company_id
                        req.session.waste_type = user.waste_type
                        req.session.entity = "recycler"
                        req.session.isAuth = true
                        next()
                    }
                    else {
                        // console.log("Wrong Password");
                        req.session.isAuth = false
                    }
                })
                .catch((err) => {
                    // console.log(err);
                    req.session.isAuth = false
                })
        })
        .catch((err) => {
            // console.log(err.message);
            req.session.isAuth = false
        })
}

const isAuth = (req, res, next) => {
    // console.log(req.session.isAuth, "inside");
    if (req.session.isAuth) {
        next()
    }
    else {
        res.render("login")
    }
}

const acceptOrder = async (req, res, next) => {
    req.session.isAuth = true
    const order_id = req.params['id']
    try {
        await db.promise().query(`update orders set order_status = ${process.env.ACCEPTED_ORDER_STATUS}, recycler_id = ${req.session.company_id} where order_id = ${order_id};`)
            .then(() => {
                // console.log("Accepted Order");
                req.session.isAuth = true
            })
            .catch((err) => {
                // console.log(err.message);
                req.session.isAuth = true
            })
    } catch (error) {
        // console.log(error.message);
        req.session.isAuth = true
    }
    req.session.isAuth = true
    next()
}

const executeOrder = async (req, res, next) => {
    // console.log("Here");
    const order_id = req.params['id'];

    console.log(order_id);
    try {
        await db.promise().query(`update orders set order_status = ${process.env.RECYCLER_EXECUTED_ORDER_STATUS}, recycler_id = ${req.session.company_id} where order_id = ${order_id};`)
            .then(async() => {
                await orders.deleteOne({order_id:order_id})
                .then((ok) => {
                    console.log(`Executed Order ${order_id} by recycler`);
                })
                .catch((err) => {
                    console.log(err.message);
                })
            })
            .catch((err) => {
                console.log(err.message);
            })
    } catch (error) {
        console.log(error.message);
    }
    next()
}

const rejectOrder = async (req, res, next) => {
    // console.log("Here");
    const order_id = req.params['id'];
    console.log(order_id);
    try {
        await db.promise().query(`update orders set order_status = order_status-1 where order_id = ${order_id};`)
            .then(async() => {
                try {
                    // mongo query to add recycler_id to rejected array
                    await orders.updateOne({order_id:order_id},{$push:{rejected_by:req.session.company_id}})
                    .then(() => {
                        // console.log(`Rejected Order ${order_id} by recycler`);
                        next()
                        return
                    })
                    .catch((err) => {
                        console.log(err);
                    } )
                } catch (error) {
                    console.log(error);
                }
            })
            .catch((err) => {
                console.log(err.message);
            })
    } catch (error) {
        console.log(error.message);
    }
    next()
}



module.exports = { register, login, isAuth, acceptOrder, executeOrder , rejectOrder}
















