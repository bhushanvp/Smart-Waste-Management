const login_form = document.getElementById("login-form")
const login_entity = document.getElementById("login-entity")
const err_login_entity = document.getElementById("no-login-entity")


login_entity.addEventListener("input", () => {
    console.log(login_entity.value);
    if (login_entity.value === "") {
        err_login_entity.textContent = "Please select an entity type"
    }
    else {
        err_login_entity.textContent = ""
        login_form.action = `/${login_entity.value}/login`
    }
    console.log(login_form.action);
})

const validateLogin = () => {
    if (login_form.action === "/login") {
        err_login_entity.textContent = "Please select an entity type"
        return false
    }
    else {
        err_login_entity.textContent = ""
        login_form.action = `/${login_entity.value}/login`
        console.log(login_form.action);
        return true
    }
}