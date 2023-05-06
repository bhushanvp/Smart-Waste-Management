const bcrypt = require("bcrypt")
const {db} = require("../db/conn")
const {orders} = require("../db/conn")

const register = async (req, res, next) => {
    req.session.alreadyRegistered = false
    const producer_name = req.body['company-name']
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

        await db.promise().query(`select * from producers where producer_email='${email}'`)
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

        await db.promise().query(`insert into producers (producer_name, producer_email, producer_contact_number, waste_type, password) values ('${producer_name}', '${email}', ${contact_number}, ${waste_type}, '${password}');`)
            .then(async (data) => {
                company_id = data[0]['insertId']

                await db.promise().query(`insert into addresses values (${company_id}, '${building_number}','${building_name}', '${street}', '${city}', '${district}', ${pincode}, ${north}, ${east})`)
                    .then((data) => {
                        req.session.username = producer_name
                        req.session.id = company_id
                        req.session.north = north
                        req.session.east = east
                        req.session.entity = "producer"
                        req.session.isAuth = true
                        // res.redirect("/producer/dashboard")
                        next()
                        return
                    })
                    .catch((err) => {
                        console.log(err);
                        // res.redirect("/register")
                        // req.session.isAuth = false
                    })

            })
            .catch((err) => {
                console.log(err);
                // res.redirect("/register")
                // req.session.isAuth = false
            })
    } catch (error) {
        console.log(error);
        // res.redirect("/register")
        // req.session.isAuth = false
    }
    // req.session.isAuth = true
}

const login = async (req, res, next) => {
    const email = req.body['company-email']
    const password = req.body['password']

    let user

    await db.promise().query(`select * from producers where producer_email = '${email}'`)
        .then((data) => {
            user = data[0][0]
            if (user === undefined) {
                // console.log("Wrong Email ID");
                req.session.isAuth = false
                return
            }
            bcrypt.compare(password, user['password'])
            .then(async (auth) => {
                    if (auth) {
                        // console.log("Logged in successfully");
                        req.session.username = user.producer_name
                        req.session.company_id = user.company_id
                        await db.promise().query(`select north_coordinate, east_coordinate from addresses where company_id = ${user.company_id}`)
                        .then((data) => {
                            req.session.north = data[0][0]['north_coordinate']
                            req.session.east = data[0][0]['east_coordinate']
                            req.session.entity = "producer"
                            console.log(req.socket.server.connection);
                        })
                        .catch((err) => {
                            // console.log(err.message);
                        })
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

const createOrder = async (req, res, next) => {
    const waste_type = Number(req.body['waste_type'])
    const waste_quantity = req.body['waste_quantity']
    const pickup_time = req.body['pick_up_time']

    try {
        let count = 0

        // await db.promise().query(`select count(*) from addresses where company_id > 19999 and north_coordinate > 0 and east_coordinate > 0 and company_id in (select company_id from recyclers where waste_type = ${waste_type});`)
        await db.promise().query(`select count(*) from addresses where company_id > 19999 and company_id in (select company_id from recyclers where waste_type = ${waste_type});`)
        .then((data) => {
            // console.log("Here");
            count = data[0][0]['count(*)']
        })
        .catch((err) => {
            // console.log(err);
            req.session.order_status = "No recyclers found"
        })

        if (count>0) {
            //////////////////////////////////////////////////////////////////////
            await db.promise().query(`insert into orders (producer_id, waste_type, waste_quantity, pickup_date, order_status, north_coordinate, east_coordinate) values (${req.session.company_id}, ${waste_type}, '${waste_quantity}', '${pickup_time}', ${count}, ${req.session.north}, ${req.session.east});`)
            .then(async (data) => {
                // console.log(data[0]['insertId']);
                let order_id = data[0]['insertId']
                console.log(order_id);
                const order = {
                    order_id: order_id,
                    rejected_by: []
                }
                await orders.insertMany(order)

                // console.log(`Found ${count} recycler(s)`);
                // console.log("Created Order");
                req.session.order_status = "Order Placed"
            })
            .catch((err) => {
                console.log(err.message);
                req.session.order_status = "No recyclers found"
            })
        }
        else {
            // console.log("No recyclers found");
            req.session.order_status = "No recyclers found"
        }
    } catch (error) {
        // console.log(error.message);
        req.session.order_status = "No recyclers found"
    }
    req.session.isAuth = true
    next()
}

const executeOrder = async (req, res, next) => {
    const order_id = req.params['id']
    console.log(order_id);
    try {
        await db.promise().query(`update orders set order_status = ${process.env.PRODUCER_EXECUTED_ORDER_STATUS}, producer_id = ${req.session.company_id} where order_id = ${order_id};`)
            .then(() => {
                console.log(`Executed Order ${order_id} by producer`);
            })
            .catch((err) => {
                console.log(err.message);
            })
    } catch (error) {
        console.log(error.message);
    }
    next()
}

module.exports = { register, login, isAuth, createOrder, executeOrder }