const get_location = document.getElementById("get-location")

let user_location = null;

const location_not_fetched = document.getElementById("location-not-fetched")

const north_cords = document.getElementById("north-coordinate")
const east_cords = document.getElementById("east-coordinate")
// const location = document.getElementById("map-location")


get_location.addEventListener("click", () => {
    location_not_fetched.textContent = "Please wait while we fetch your location..."

    navigator.geolocation.getCurrentPosition(async (position) => {
        location_not_fetched.textContent = ""
        user_location = position

        north_cords.value = position.coords.latitude
        // console.log(north_cords);
        east_cords.value = position.coords.longitude
        // console.log(east_cords);
        
        // const { Map } = await google.maps.importLibrary("maps");
      
        // map = new Map(document.getElementById("map"), {
        //   center: { lat: north_cords.value, lng: east_cords.value },
        //   zoom: 8,
        // });

    }, (err) => {
        location_not_fetched.textContent = err.message
        // console.log(err.message);
        north_cords.textContent = ""
        east_cords.textContent = ""
    },
    {
        enableHighAccuracy: true
    })
})

const b_number = document.getElementById("building-number")
// console.log(b_name.value);
b_number.addEventListener("input", () => {
    const b_number_err = document.getElementById("no-building-number")
    if (b_number.value === "") {
        b_number_err.textContent = "Required Building Number"
    }
    else {
        b_number_err.textContent = ""
    }
})

const b_name = document.getElementById("building-name")
// console.log(b_name.value);
b_name.addEventListener("input", () => {
    const b_name_err = document.getElementById("no-building-name")
    if (b_name.value === "") {
        b_name_err.textContent = "Required Building Name"
    }
    else {
        b_name_err.textContent = ""
    }
})

const street = document.getElementById("street")
// console.log(street.value);
street.addEventListener("input", () => {
    const street_err = document.getElementById("no-street")
    if (street.value === "") {
        street_err.textContent = "Required Street / Landmark"
    }
    else {
        street_err.textContent = ""
    }
})

const city = document.getElementById("city")
// console.log(city.value);
city.addEventListener("input", () => {
    const city_err = document.getElementById("no-city")
    if (city.value === "") {
        city_err.textContent = "Required City"
    }
    else {
        city_err.textContent = ""
    }
})

const district = document.getElementById("district")
// console.log(district.value);
district.addEventListener("input", () => {
    const district_err = document.getElementById("no-district")
    if (district.value === "") {
        district_err.textContent = "Required District"
    }
    else {
        district_err.textContent = ""
    }
})

const pincode = document.getElementById("pincode")
// console.log(pincode.value);
pincode.addEventListener("input", () => {
    const pincode_err = document.getElementById("no-pincode")
    if (pincode.value <= 0) {
        pincode_err.innerText = "Invalid pincode"
    }
    else {
        pincode_err.innerText = ""
    }
})

if (user_location != null) {
    location_not_fetched = ""
}

const validateLocation = () => {
    if (user_location === null) {
        return false
    }
    else {
        return true
    }
}

///////////////////////////////////////////////////////////////////////////////////


///////     Company Name
const company_name = document.getElementById("company-name")
// console.log(company_name.value);
const no_company_name = document.getElementById("no-company-name")
company_name.addEventListener("input", () => {
    if (company_name.value === "") {
        no_company_name.textContent = "Required company name"
    }
    else {
        no_company_name.textContent = ""
    }
})

///////     Company Number
const company_phone = document.getElementById("company-contact-number")
const no_company_phone = document.getElementById("no-contact-number")
// console.log(company_phone.value);
company_phone.addEventListener("input", () => {
    if (company_phone.value === "") {
        no_company_phone.textContent = "Required company contact number"
    }
    else {
        no_company_phone.textContent = ""
    }
})

///////     Company Email
const company_email = document.getElementById("company-email")
// console.log(company_email.value);
const no_company_email = document.getElementById("no-company-email")
company_email.addEventListener("input", () => {
    if (company_email.value === "") {
        no_company_email.textContent = "Required company email"
    }
    else {
        no_company_email.textContent = ""
    }
})

///////     Passwords
const password = document.getElementById("password")
const password_err = document.getElementById("password-err")
const cpassword = document.getElementById("confirm-password")
const cpassword_err = document.getElementById("confirm-password-err")

password.addEventListener("input", () => {
    if (password.value === "") {
        password.textContent = "Required password"
    }
    else {
        password.textContent = ""
    }
})

cpassword.addEventListener("input", () => {
    if (cpassword.value === "") {
        cpassword_err.textContent = "Required confirmation of password"
    }
    else if (cpassword.value != password.value) {
        cpassword_err.textContent = "Confirm password must be same as password"
    }
    if (cpassword.value === password.value) {
        cpassword_err.textContent = ""
    }
})

///////     Waste Type
const products = document.getElementsByClassName("waste-type")
const no_waste = document.getElementById("no-waste")
for (let j = 0; j < products.length; j++) {
    products[j].addEventListener("change", () => {
        let checked = false
        for (let i = 0; i < products.length; i++) {
            const element = products[i];
            if (element.checked === true) {
                checked = true
                no_waste.textContent = ""
                break
            }
        }
        if (checked === false) {
            no_waste.textContent = "Select atleast one product"
        }
    })
}

/////////////////////////////////////////////////////////////////////////////////

const validateRegistration = () => {
    if (north_cords.value === null || east_cords.value === null) {
        return false
    }
    else if (company_phone <= 0) {
        return false
    }
    else if (cpassword.value != password.value) {
        return false
    }
    else {
        // console.log("Form Validated");
        return true
    }
}

/////////////////////////////////////////////////////////////////////////////////

const signup_form = document.getElementById("signup-form")

const signup_entity = document.getElementById("signup-entity")
const err_signup_entity = document.getElementById("no-signup-entity")

signup_entity.addEventListener("input", () => {
    console.log(signup_entity.value);
    if (signup_entity.value === "") {
        err_signup_entity.textContent = "Please select an entity type"
    }
    else {
        err_signup_entity.textContent = ""
        signup_form.action = `/${signup_entity.value}/register`
    }
    // console.log(signup_form.action);
})