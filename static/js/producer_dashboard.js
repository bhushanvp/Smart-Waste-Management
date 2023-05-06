history.pushState(null, null, location.href);
window.onpopstate = function(event) {
  history.go(1);
};

const order_form = document.getElementById("create-order-form")
const order_form_btn = document.getElementById("create-order-image")
const close_order_form_btn = document.getElementById("close-button")

order_form_btn.addEventListener("click", () => {
    // order_form.style.backdropFilter = 'blur(5px)';
    order_form.style.display='block'
})

close_order_form_btn.addEventListener("click", () => {
    // order_form.style.backdropFilter = 'blur(0px)';
    order_form.style.display = 'none'
})

const acc_req = document.getElementsByClassName("accepted-requests")
const no_acc_req = document.getElementsByClassName("accepted-requests-label")[0]
if (acc_req[0].children[0].childElementCount<2) {
    no_acc_req.textContent = "No Accepted Requests as of now"
    acc_req[0].style.display = 'none'
}

const pend_req = document.getElementsByClassName("pending-requests")
const no_pend_req = document.getElementsByClassName("pending-requests-label")[0]
if (pend_req[0].children[0].childElementCount<2) {
    no_pend_req.textContent = "No Pending Requests as of now"
    pend_req[0].style.display = 'none'
}

const pexe_req = document.getElementsByClassName("pending-verification-requests")
const no_pexe_req = document.getElementsByClassName("pending-verification-requests-label")[0]
if (pexe_req[0].children[0].childElementCount<2) {
    no_pexe_req.textContent = "No Pending Verification Requests as of now"
    pexe_req[0].style.display = 'none'
}

const exe_req = document.getElementsByClassName("executed-requests")
const no_exe_req = document.getElementsByClassName("executed-requests-label")[0]
if (exe_req[0].children[0].childElementCount<2) {
    no_exe_req.textContent = "No Executed Requests as of now"
    exe_req[0].style.display = 'none'
}

const waste_type = document.getElementById("waste-type")
const waste_quantity = document.getElementById("waste-quantity")
const pick_up_time = document.getElementById("pickup-time")

const no_type = document.getElementById("no-waste-type")
const no_quantity = document.getElementById("no-waste-quantity")
const too_soon = document.getElementById("wrong-date")

waste_type.addEventListener("input", () => {
    if (waste_type.value === "") {
        no_type.textContent = "Please enter a valid waste type"
    }
    else {
        no_type.textContent = ""
    }
})

waste_quantity.addEventListener("input", () => {
    if (waste_quantity.value==="") {
        no_quantity.textContent = "Please enter a valid waste quantity"
        return false
    }
    else {
        no_quantity.textContent = ""
    }
})

pick_up_time.addEventListener("input", () => {
    const curr_date = new Date(pick_up_time.value)
    const tommo = new Date()
    tommo.setDate(tommo.getDate() + 1)
    if (curr_date < tommo) {
        too_soon.textContent = "Please select a time beyond today"
        return false
    }
    else {
        too_soon.textContent = ""
    }
})

const validateOrder = () => {
    
    if (waste_type.value === null) {
        return false
    }
    if (waste_quantity.value<=0) {
        return false
    }
    const curr_date = new Date(pick_up_time.value)
    const tommo = new Date()
    tommo.setDate(tommo.getDate() + 1)
    if (curr_date < tommo) {
        return false
    }
}